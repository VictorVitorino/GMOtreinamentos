"""Boletim Maestro de encerramento da Operação Assistida, editável, sobre o boletim de setembro/26.

Uso: python3 build_boletim.py <boletim_mensal.pptx> [saida.pptx]

Parte do slide 1 do boletim mensal (setembro/26): mesmo layout, logos, cabeçalho e estilos. Troca os textos,
fecha os três estágios (testar, ajustar, estabilizar), atualiza a linha dos grandes marcos, transforma
"Atividades em andamento" em "O que entregamos" e põe a mensagem do Marcelo Prais no lugar do convite final.
Fonte dos marcos: status semanais do Comitê Gestor da Operação Assistida (13/07 a 30/10/2026).
"""
import copy
import os
import sys

from lxml import etree
from pptx import Presentation
from pptx.oxml.ns import qn
from pptx.util import Emu

SRC = sys.argv[1]
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(
    os.path.dirname(os.path.abspath(__file__)), 'dist', 'Boletim_Maestro_Encerramento_Operacao_Assistida.pptx')

VERDE, VERDE_ESC, CINZA, AMARELO = '486018', '3D5714', '55585B', 'D4D300'

MARCOS = [  # (número, data, título, legenda)
    ('01', '15 JUL', 'Início da\nOperação Assistida', 'Retomada estruturada da implantação'),
    ('02', '04 - 05 AGO', 'Workshop de Gerências\ne Comunidades', 'Escopo, processos e integrações'),
    ('03', '26 - 27 AGO', 'Webinars com as\náreas clientes', 'Modelo de Operação e capacitação'),
    ('04', 'SET - OUT', 'Comunidades\nem operação', 'Representantes e Azure DevOps'),
    ('05', '30 OUT', 'Encerramento da\nOperação Assistida', 'Entregáveis e roadmap de evolução'),
]
MARCO_IDS = [(80, 81, 82, 84), (86, 87, 88, 89), (91, 92, 93, 94), (96, 97, 98, 99), (101, 102, 103, 104)]

ENTREGAS = [  # (id rótulo, id título, id texto, título, texto)
    (115, 116, 117, 'Trilha de capacitação publicada',
     'Modelo de Operação Matricial, Gestão de Projetos Ágeis e Arquitetura de Modelos no ONS Educa+, além de IA e '
     'Azure DevOps.'),
    (121, 122, 123, 'Comunidades em funcionamento',
     'Comunidades de Entrega com 100% de aderência a ritos, papéis e interfaces com as áreas de negócio, e backlog no '
     'Azure DevOps em produção.'),
    (141, 142, 143, 'Canais e informação',
     'Boletins semanais e mensais, conteúdo dos sites das Gerências da FE e comunicado formalizando os Representantes '
     'de Negócio nas Comunidades.'),
    (147, 148, 149, 'Engajamento e diagnóstico',
     'Diagnóstico das lideranças, Guia de Bolso Interativo, Rede de Influenciadores ativada e mapa de adoção aos '
     'comportamentos esperados.'),
]

MENSAGEM = [
    'O encerramento da operação assistida do Projeto Maestro representa um marco importante na jornada de '
    'fortalecimento da autonomia tecnológica do ONS.',
    'Ao longo dessa trajetória, avançamos na estruturação de um modelo de atuação mais integrado, colaborativo e '
    'preparado para responder, com agilidade e rigor técnico, aos desafios cada vez mais complexos do Sistema '
    'Interligado Nacional.',
    'Agradeço a todos os profissionais, lideranças e parceiros envolvidos pelo comprometimento, dedicação e '
    'contribuições ao longo dessa construção coletiva.',
    'Encerramos uma etapa, mas seguimos com a responsabilidade de consolidar as novas práticas, fortalecer nossas '
    'capacidades internas e ampliar nosso papel como orquestradores de um ecossistema tecnológico inovador.',
    'O futuro do FE será construído pela capacidade de transformar o modelo que desenhamos em resultados consistentes '
    'e duradouros.',
]


def E(pt):
    return Emu(int(round(pt * 12700)))


def walk(shapes):
    for sh in shapes:
        yield sh
        if sh.shape_type == 6:
            yield from walk(sh.shapes)


def _rpr(base, fmt):
    r = copy.deepcopy(base) if base is not None else etree.Element(qn('a:rPr'))
    r.tag = qn('a:rPr')
    r.set('lang', 'pt-BR')
    if 'b' in fmt:
        r.set('b', '1' if fmt['b'] else '0')
    if 'sz' in fmt:
        r.set('sz', str(int(fmt['sz'] * 100)))
    if 'color' in fmt:
        for f in r.findall(qn('a:solidFill')):
            r.remove(f)
        sf = etree.Element(qn('a:solidFill'))
        etree.SubElement(sf, qn('a:srgbClr'), val=fmt['color'])
        ln = r.find(qn('a:ln'))
        (ln.addnext(sf) if ln is not None else r.insert(0, sf))
    return r


def set_text(sh, paras, space_after=None):
    """Troca o texto mantendo o estilo do primeiro trecho. `paras`: lista de parágrafos; cada um é texto ou lista de
    (texto, formato). Quebras de linha com \\n viram <a:br/>."""
    body = sh.text_frame._txBody
    ps = body.findall(qn('a:p'))
    r0 = ps[0].find('.//' + qn('a:r'))
    base = r0.find(qn('a:rPr')) if r0 is not None else ps[0].find(qn('a:endParaRPr'))
    ppr = ps[0].find(qn('a:pPr'))
    for p in ps:
        body.remove(p)
    for segs in paras:
        segs = [(segs, {})] if isinstance(segs, str) else segs
        p = etree.SubElement(body, qn('a:p'))
        if ppr is not None:
            pp = copy.deepcopy(ppr)
            if space_after is not None:
                for t in ('a:spcAft',):
                    for e in pp.findall(qn(t)):
                        pp.remove(e)
                sa = etree.Element(qn('a:spcAft'))
                etree.SubElement(sa, qn('a:spcPts'), val=str(int(space_after * 100)))
                prev = pp.find(qn('a:spcBef'))
                prev = prev if prev is not None else pp.find(qn('a:lnSpc'))
                if prev is not None:
                    prev.addnext(sa)
                else:
                    pp.insert(0, sa)
            p.append(pp)
        for text, fmt in segs:
            for k, ln in enumerate(text.split('\n')):
                if k:
                    br = etree.SubElement(p, qn('a:br'))
                    br.append(_rpr(base, fmt))
                r = etree.SubElement(p, qn('a:r'))
                r.append(_rpr(base, fmt))
                etree.SubElement(r, qn('a:t')).text = ln


def move(sh, dy=0, top=None, height=None):
    if top is not None:
        sh.top = E(top)
    elif dy:
        sh.top = sh.top + E(dy)
    if height is not None:
        sh.height = E(height)


def fill_from(dst, src):
    sp_d, sp_s = dst._element.spPr, src._element.spPr
    for f in sp_d.findall(qn('a:solidFill')):
        sp_d.remove(f)
    sp_d.find(qn('a:prstGeom')).addnext(copy.deepcopy(sp_s.find(qn('a:solidFill'))))


def main():
    prs = Presentation(SRC)
    lst = prs.slides._sldIdLst
    for sid in list(lst)[1:]:  # fica só o boletim de setembro, como base
        prs.part.drop_rel(sid.rId)
        lst.remove(sid)
    s = prs.slides[0]
    s._element.attrib.pop('show', None)
    sh = {x.shape_id: x for x in walk(s.shapes)}

    # cabeçalho e seção 1
    set_text(sh[67], ['Outubro/26'])
    set_text(sh[48], ['A OPERAÇÃO ASSISTIDA CHEGA AO FIM!'])
    set_text(sh[50], [[('De julho a outubro, a Operação Assistida levou o novo Modelo de Operação ', {}),
                       ('da definição à prática', {'b': True, 'color': VERDE}),
                       (': gerências e comunidades estruturadas, papéis e fóruns em funcionamento e ferramentas '
                        'oficiais em produção.', {})]])
    set_text(sh[52], ['Agora, o modelo segue para a rotina, com um roadmap de monitoramento e evolução para consolidar '
                      'as novas práticas nas Gerências e Comunidades.'])
    set_text(sh[56], ['OPERAÇÃO ASSISTIDA'])
    set_text(sh[58], ['Etapa\nconcluída.'])
    fill_from(sh[69], sh[62])  # os três estágios concluídos

    # seção 2: grandes marcos
    set_text(sh[106], ['Os principais passos que percorremos na Operação Assistida, de julho a outubro.'])
    for (n, d, t, leg), (i_n, i_d, i_t, i_l) in zip(MARCOS, MARCO_IDS):
        set_text(sh[i_n], [n])
        set_text(sh[i_d], [d])
        set_text(sh[i_t], [t])
        set_text(sh[i_l], [leg])
    sh[99].top, sh[99].height = sh[94].top, sh[94].height  # legenda 04 com duas linhas, alinhada às demais

    # seção 3: o que entregamos (cartões mais baixos para abrir espaço à mensagem final)
    set_text(sh[152], ['O QUE ENTREGAMOS'])
    set_text(sh[111], ['Resultados que passam a sustentar o novo Modelo de Operação no dia a dia.'])
    for i_r, i_t, i_x, t, x in ENTREGAS:
        set_text(sh[i_t], [t])
        set_text(sh[i_x], [x])
    linha1 = [112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123]
    linha2 = [138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149]
    for i in linha1:
        move(sh[i], -6)
    for i in linha2:
        move(sh[i], -16)
    for i in (112, 118, 138, 144):
        sh[i].height = E(72)
    move(sh[155], -11)
    sh[156].top, sh[156].height = E(640), E(150)
    move(sh[160], -11)

    # seção 4: mensagem de encerramento no lugar do convite
    for i in (167, 173, 36):
        el = sh[i]._element
        el.getparent().remove(el)
    move(sh[161], -36)
    move(sh[177], -36)
    set_text(sh[163], ['MENSAGEM DE ENCERRAMENTO'])
    sh[163].width = E(430)
    sh[162].width = E(420)
    card = copy.deepcopy(sh[30]._element)
    barra = copy.deepcopy(sh[34]._element)
    texto = copy.deepcopy(sh[117]._element)
    tree = s.shapes._spTree
    for el in (card, barra, texto):
        tree.append(el)
    novos = list(s.shapes)[-3:]
    c, b, t = novos
    c.left, c.top, c.width, c.height = E(25), E(831), E(490), E(103)
    b.left, b.top, b.width, b.height = E(25), E(836), E(4), E(93)
    t.left, t.top, t.width = E(38), E(836), E(468)
    paras = [[(m, {'sz': 7.3})] for m in MENSAGEM]
    paras.append([('Marcelo Prais', {'sz': 7.6, 'b': True, 'color': VERDE_ESC}),
                  ('  |  Gerente Executivo de Ferramentas Eletroenergéticas | ONS', {'sz': 7.3, 'color': VERDE})])
    set_text(t, paras, space_after=2.5)
    bp = t.text_frame._txBody.bodyPr
    for e in list(bp):
        bp.remove(e)
    etree.SubElement(bp, qn('a:noAutofit'))
    t.height = E(93)
    bp.set('anchor', 'ctr')

    # ids novos só para as cópias (os conectores do modelo apontam para os ids originais)
    nxt = max(int(e.get('id')) for e in s.shapes._spTree.iter(qn('p:cNvPr'))) + 1
    for k, x in enumerate(novos):
        x._element.find('.//' + qn('p:cNvPr')).set('id', str(nxt + k))
    os.makedirs(os.path.dirname(os.path.abspath(OUT)), exist_ok=True)
    prs.save(OUT)
    print('ok', OUT)


main()
