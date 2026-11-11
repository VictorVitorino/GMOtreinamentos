/**
 * 07_Historico.gs — toda alteração de contrato vira uma linha de histórico.
 *
 * Uma nova versão é detectada de dois jeitos:
 *   a) o arquivo cadastrado foi editado (verificarVersoes compara a impressão digital do texto);
 *   b) chegou em 01_Entrada um arquivo cujo nome começa com o código do contrato (CT-0001 ...).
 * Em ambos os casos: a cópia integral é guardada, o código compara parágrafo a parágrafo e a IA
 * explica o efeito de cada mudança. Se a IA falhar, o histórico é gravado do mesmo jeito, sem o resumo.
 */

const PROMPT_VERSOES_ = [
  'Você compara duas versões de um contrato para um escritório de advocacia brasileiro. Você recebe somente os trechos',
  'que mudaram, já calculados por um programa: o que saiu (ANTES) e o que entrou (DEPOIS).',
  '',
  'Regras:',
  '1. Descreva somente as alterações da lista. Não suponha mudanças que não estão nela.',
  '2. Em "antes" e "depois", copie literalmente o trecho central que mudou (até 300 caracteres, sem reticências).',
  '   Em inclusão, "antes" fica vazio. Em exclusão, "depois" fica vazio.',
  '3. Avalie o efeito para a parte representada: favoravel, desfavoravel ou neutro.',
  '   Mudança de número, prazo, percentual ou índice nunca é neutra sem explicação.',
  '4. Risco "alto" quando a mudança desfavorável atinge responsabilidade, dados pessoais, preço, rescisão ou nível de serviço.',
  '5. Não cite leis nem jurisprudência.',
  '6. Marcadores como [CNPJ_1] substituem dados reais. Mantenha-os exatamente como estão.',
].join('\n');

const ESQUEMA_VERSOES_ = {
  type: 'object',
  additionalProperties: false,
  required: ['resumo', 'alteracoes'],
  properties: {
    resumo: { type: 'string' },
    alteracoes: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['clausula', 'tipo', 'antes', 'depois', 'efeito', 'risco', 'comentario'],
        properties: {
          clausula: { type: 'string' },
          tipo: { type: 'string', enum: ['incluida', 'excluida', 'modificada'] },
          antes: { type: 'string' },
          depois: { type: 'string' },
          efeito: { type: 'string', enum: ['favoravel', 'desfavoravel', 'neutro'] },
          risco: { type: 'string', enum: ['alto', 'medio', 'baixo'] },
          comentario: { type: 'string' },
        },
      },
    },
  },
};

function verificarVersoes(evento) {
  comTrava_('verificarVersoes', function () {
    if (foraDoExpediente_(evento)) return;
    let novas = 0;
    lerTabela_('Contratos').forEach(function (contrato) {
      if (!contrato['ID do arquivo']) return;
      if (['Em análise pela IA', 'Na fila da IA', 'Encerrado'].indexOf(contrato['Status']) >= 0) return;
      let arquivo;
      try {
        arquivo = DriveApp.getFileById(contrato['ID do arquivo']);
      } catch (erro) {
        return registrar_('Arquivo do contrato não encontrado', contrato['ID']);
      }
      const visto = ehData_(contrato['Verificado em']) ? contrato['Verificado em'] : new Date(0);
      if (arquivo.getLastUpdated() <= visto) return;
      const texto = textoDoArquivo_(arquivo);
      if (hash_(texto) === contrato['Hash']) return atualizar_('Contratos', contrato._linha, { 'Verificado em': new Date() });
      registrarVersao_(contrato, texto, arquivo);
      novas++;
    });
    if (novas) atualizarPainel_();
    avisar_(novas + ' nova(s) versão(ões) registrada(s) no Histórico.');
  });
}

function registrarVersao_(contrato, textoNovo, arquivo) {
  const impressao = hash_(textoNovo);
  const arquivoNovo = arquivo.getId() !== contrato['ID do arquivo'];
  if (impressao === contrato['Hash']) {
    if (arquivoNovo) arquivo.moveTo(pasta_('analise'));
    return registrar_('Arquivo sem alterações', contrato['ID'] + ' · ' + arquivo.getName());
  }

  const versao = Number(contrato['Versão']) + 1;
  const textoAntigo = textoDaVersao_(contrato['ID'], contrato['Versão']);
  const mudancas = compararTextos_(textoAntigo, textoNovo);
  const copia = guardarCopia_(contrato['ID'], versao, textoNovo);

  let resumo = mudancas.length + ' trecho(s) alterado(s). Resumo da IA indisponível: leia o detalhe.';
  let alerta = '';
  let detalhe = mudancas.map(function (m, i) {
    return (i + 1) + '. [' + m.tipo + ']\nANTES: ' + (m.antes || '(nada)') + '\nDEPOIS: ' + (m.depois || '(nada)');
  }).join('\n\n');

  const sensivel = termoVermelho_(textoNovo);
  if (sensivel) {
    resumo = mudancas.length + ' trecho(s) alterado(s). Termo sensível "' + sensivel + '": alterações não enviadas à IA.';
  } else if (mudancas.length > CONFIG.MAX_ALTERACOES_PARA_RESUMO) {
    resumo = mudancas.length + ' trechos alterados: documento muito diferente da versão anterior. Trate como contrato novo.';
  } else if (mudancas.length) {
    const mascara = novaMascara_();
    const antigoMascarado = mascara.aplicar(textoAntigo);
    const novoMascarado = mascara.aplicar(textoNovo);
    const lista = mudancas.map(function (m, i) {
      return 'ALTERAÇÃO ' + (i + 1) + ' (' + m.tipo + ')\nANTES: ' + (mascara.aplicar(m.antes) || '(nada)') +
        '\nDEPOIS: ' + (mascara.aplicar(m.depois) || '(nada)');
    }).join('\n\n');
    const resposta = chamarIA_({
      sistema: PROMPT_VERSOES_,
      mensagem: 'PARTE REPRESENTADA PELO ESCRITÓRIO: ' + (contrato['Parte representada'] || 'não informada') + '\n\n' + lista,
      esquema: ESQUEMA_VERSOES_,
      esforco: CONFIG.ESFORCO_ROTINA,
    });
    if (resposta.ok) {
      // Guardrail de saída: o "antes" tem de existir na versão antiga e o "depois", na nova.
      const confere = resposta.dados.alteracoes.map(function (a) {
        return (!a.antes || trechoConfere_(a.antes, antigoMascarado)) && (!a.depois || trechoConfere_(a.depois, novoMascarado));
      });
      const d = mascara.remover(resposta.dados);
      const graves = d.alteracoes.filter(function (a) { return a.efeito === 'desfavoravel' && a.risco === 'alto'; }).length;
      resumo = d.resumo;
      if (graves) alerta = 'ATENÇÃO: ' + graves + ' alteração(ões) desfavorável(is) de risco alto';
      detalhe = d.alteracoes.map(function (a, i) {
        return (i + 1) + '. ' + a.clausula + ' · ' + a.tipo + ' · ' + a.efeito + ' · risco ' + a.risco +
          (confere[i] ? '' : ' · TRECHO NÃO CONFIRMADO') +
          '\nANTES: ' + (a.antes || '(nada)') + '\nDEPOIS: ' + (a.depois || '(nada)') + '\n' + a.comentario;
      }).join('\n\n') + '\n\nA IA comentou ' + d.alteracoes.length + ' de ' + mudancas.length + ' trecho(s) alterado(s) calculado(s) pelo sistema.';
    } else {
      registrar_('Resumo de alterações não concluído', contrato['ID'] + ' · ' + resposta.motivo);
    }
  }

  const LIMITE_CELULA = 45000;
  if (detalhe.length > LIMITE_CELULA) detalhe = detalhe.slice(0, LIMITE_CELULA) + '\n[Detalhe cortado: compare as cópias em 03_Versoes.]';

  acrescentar_('Historico', {
    'Data': new Date(), 'Contrato': contrato['ID'], 'Versão': versao, 'Autor': autorDaAlteracao_(arquivo), 'Hash': impressao,
    'Alterações': mudancas.length, 'Resumo': resumo, 'Alerta': alerta, 'Detalhe': detalhe, 'Cópia (ID)': copia,
  });
  const campos = { 'Versão': versao, 'Hash': impressao, 'Verificado em': new Date(), 'Status': 'Aguardando revisão' };
  if (arquivoNovo) {
    arquivo.moveTo(pasta_('analise'));
    campos['Arquivo'] = arquivo.getUrl();
    campos['ID do arquivo'] = arquivo.getId();
  }
  atualizar_('Contratos', contrato._linha, campos);
  registrar_('Nova versão registrada', contrato['ID'] + ' v' + versao + ' · ' + mudancas.length + ' alteração(ões)' + (alerta ? ' · ' + alerta : ''));

  if (alerta && CONFIG.AVISAR_ALERTAS_POR_EMAIL) {
    // O aviso vai somente para o seu próprio endereço.
    MailApp.sendEmail({
      to: usuario_(),
      subject: alerta + ' · ' + contrato['ID'] + ' v' + versao,
      htmlBody: '<p>' + escapar_(resumo) + '</p><pre style="white-space:pre-wrap">' + escapar_(detalhe) + '</pre>',
    });
  }
}

function autorDaAlteracao_(arquivo) {
  try {
    const dados = Drive.Files.get(arquivo.getId(), { fields: 'lastModifyingUser(displayName)' });
    return dados.lastModifyingUser.displayName;
  } catch (semDado) {
    return usuario_();
  }
}

// ── Comparação de textos (feita pelo código, sem IA) ─────────────────────

/** Parágrafos do texto, sem linhas vazias e sem numeração de página (ruído típico de PDF). */
function paragrafos_(texto) {
  return String(texto).split(/\n+/)
    .map(function (p) { return p.replace(/\s+/g, ' ').trim(); })
    .filter(function (p) { return p && !/^(\d{1,4}|p[áa]gina \d+( de \d+)?)$/i.test(p); });
}

/**
 * Compara dois textos parágrafo a parágrafo e devolve a lista de mudanças:
 * { tipo: 'modificada' | 'excluida' | 'incluida', antes, depois }.
 */
function compararTextos_(antigo, novo) {
  const a = paragrafos_(antigo);
  const b = paragrafos_(novo);
  // Maior sequência comum de parágrafos idênticos.
  const comum = [];
  for (let i = 0; i <= a.length; i++) comum.push(new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      comum[i][j] = a[i] === b[j] ? comum[i + 1][j + 1] + 1 : Math.max(comum[i + 1][j], comum[i][j + 1]);
    }
  }
  const mudancas = [];
  let saiu = [];
  let entrou = [];
  const fecharBloco = function () {
    parear_(saiu, entrou).forEach(function (m) { mudancas.push(m); });
    saiu = [];
    entrou = [];
  };
  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) { fecharBloco(); i++; j++; }
    else if (j >= b.length || (i < a.length && comum[i + 1][j] >= comum[i][j + 1])) saiu.push(a[i++]);
    else entrou.push(b[j++]);
  }
  fecharBloco();
  return mudancas;
}

/** Dentro de um bloco alterado, casa cada parágrafo que saiu com o mais parecido que entrou. */
function parear_(saiu, entrou) {
  const usados = {};
  const mudancas = [];
  saiu.forEach(function (antes) {
    let melhor = -1;
    let nota = 0.4;  // abaixo disso os parágrafos são considerados diferentes
    entrou.forEach(function (depois, k) {
      if (usados[k]) return;
      const s = semelhanca_(antes, depois);
      if (s > nota) { nota = s; melhor = k; }
    });
    if (melhor >= 0) {
      usados[melhor] = true;
      mudancas.push({ tipo: 'modificada', antes: antes, depois: entrou[melhor] });
    } else {
      mudancas.push({ tipo: 'excluida', antes: antes, depois: '' });
    }
  });
  entrou.forEach(function (depois, k) {
    if (!usados[k]) mudancas.push({ tipo: 'incluida', antes: '', depois: depois });
  });
  return mudancas;
}

/** Proporção de palavras em comum entre dois parágrafos (0 a 1). */
function semelhanca_(x, y) {
  const palavras = function (t) {
    const conjunto = {};
    t.toLowerCase().split(/[^a-z0-9à-ÿ%]+/).filter(Boolean).forEach(function (p) { conjunto[p] = true; });
    return conjunto;
  };
  const px = palavras(x);
  const py = palavras(y);
  const todas = Object.keys(Object.assign({}, px, py)).length;
  const emComum = Object.keys(px).filter(function (p) { return py[p]; }).length;
  return todas ? emComum / todas : 0;
}
