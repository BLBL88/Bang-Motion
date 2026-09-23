/* =========================================================
   FOOTAGE — padanan clip() di starter HTML (techniques.md §9b).
   Remotion sudah mengikat video ke frame, jadi yang tersisa hanya
   memetakan opsi Bang Motion {at, in, out, rate, hold} ke props <Video>.
   Animasikan PEMBUNGKUSNYA (<Footage style=...>), bukan video-nya.
   ========================================================= */
import React from 'react';
import { Video } from '@remotion/media';
import { AbsoluteFill, Freeze, Sequence, staticFile, useVideoConfig } from 'remotion';

export const Footage: React.FC<{
  src: string;               // nama berkas di public/ (mis. "klip.mp4") atau URL https
  at: number;                // detik timeline klip mulai
  in?: number;               // potongan awal sumber (detik)
  out?: number;              // potongan akhir sumber (detik)
  rate?: number;             // kecepatan (0.5 = slow motion)
  hold?: boolean;            // tahan frame akhir sampai akhir video
  volume?: number;           // default 0: musik/VO tetap trek terpisah
  style?: React.CSSProperties;          // pembungkus: posisi, mask, radius, grade
  videoStyle?: React.CSSProperties;
}> = ({ src, at, in: inT = 0, out, rate = 1, hold = false, volume = 0, style, videoStyle }) => {
  const { fps } = useVideoConfig();
  const url = /^https?:/.test(src) ? src : staticFile(src);
  const from = Math.round(at * fps);
  const len = out != null ? Math.round(((out - inT) / rate) * fps) : undefined;
  const vStyle: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover', ...videoStyle };
  const video = (
    <Video
      src={url}
      trimBefore={Math.round(inT * fps)}
      trimAfter={out != null ? Math.round(out * fps) : undefined}
      playbackRate={rate}
      volume={volume}
      style={vStyle}
    />
  );
  return (
    <>
      <Sequence from={from} durationInFrames={len} layout="none" name={`Footage ${src}`}>
        <AbsoluteFill style={{ overflow: 'hidden', ...style }}>{video}</AbsoluteFill>
      </Sequence>
      {hold && len != null && (
        <Sequence from={from + len} layout="none" name={`Hold ${src}`}>
          <AbsoluteFill style={{ overflow: 'hidden', ...style }}>
            <Freeze frame={len - 1}>{video}</Freeze>
          </AbsoluteFill>
        </Sequence>
      )}
    </>
  );
};
