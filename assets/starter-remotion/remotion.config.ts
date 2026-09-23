// Bang Motion x Remotion — pengaturan render.
// crf 16 + yuv420p = sama dengan preset ffmpeg di scripts/export-frames.mjs versi HTML.
import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setPixelFormat('yuv420p');
Config.setCrf(16);
Config.setConcurrency(null);           // null = otomatis sesuai jumlah core
Config.setChromiumOpenGlRenderer('angle');   // WebGL/filter lebih stabil di Windows
