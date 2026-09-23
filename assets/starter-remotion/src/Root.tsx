import React from 'react';
import { Composition, Folder } from 'remotion';
import { DEMO_DURATION, DoorsDemo } from './DoorsDemo';
import { DURATION, Opener } from './Opener';

// 60 fps = sama dengan export-frames.mjs versi HTML. Turunkan ke 30 bila render terlalu lama.
const FPS = 60;

export const Root: React.FC = () => (
  <>
    <Composition id="Opener" component={Opener} durationInFrames={DURATION * FPS} fps={FPS} width={1920} height={1080} />
    {/* 9:16 hanya bila diminta: semua resep membaca W/H dari useVideoConfig */}
    <Composition id="OpenerVertical" component={Opener} durationInFrames={DURATION * FPS} fps={FPS} width={1080} height={1920} />
    <Folder name="Perkakas">
      <Composition
        id="DoorsDemo"
        component={DoorsDemo}
        durationInFrames={Math.round(DEMO_DURATION * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </Folder>
  </>
);
