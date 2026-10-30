#!/usr/bin/env bash
# Mixes narration (S1-S7), transition whooshes and the looping ambient bed
# into audio/mix.m4a, aligned with the scene timeline of index.html.
set -euo pipefail
cd "$(dirname "$0")/audio"

ffmpeg -y \
  -stream_loop 6 -i bed.mp3 \
  -i S1.mp3 -i S2.mp3 -i S3.mp3 -i S4.mp3 -i S5.mp3 -i S6.mp3 -i S7.mp3 \
  -i whoosh.mp3 \
  -filter_complex "
[0:a]atrim=0:169.7,volume=0.15,afade=t=in:st=0:d=2,afade=t=out:st=165.2:d=4.5[bed];
[1:a]adelay=1200|1200[n1];
[2:a]adelay=19000|19000[n2];
[3:a]adelay=42400|42400[n3];
[4:a]adelay=74600|74600[n4];
[5:a]adelay=96500|96500[n5];
[6:a]adelay=123100|123100[n6];
[7:a]adelay=146400|146400[n7];
[8:a]volume=0.30,asplit=6[wa][wb][wc][wd][we][wf];
[wa]adelay=17950|17950[w1];
[wb]adelay=41350|41350[w2];
[wc]adelay=73550|73550[w3];
[wd]adelay=95450|95450[w4];
[we]adelay=122050|122050[w5];
[wf]adelay=145350|145350[w6];
[bed][n1][n2][n3][n4][n5][n6][n7][w1][w2][w3][w4][w5][w6]amix=inputs=14:normalize=0[mx];
[mx]loudnorm=I=-16:TP=-1.5:LRA=11,alimiter=limit=0.97,aresample=48000[out]
" -map "[out]" -t 169.7 -c:a aac -b:a 192k mix.m4a

echo "mix ok: $(ffprobe -v error -show_entries format=duration -of csv=p=0 mix.m4a)s"
