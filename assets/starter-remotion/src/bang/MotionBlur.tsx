/* =========================================================
   MOTION BLUR BERARAH — feGaussianBlur dengan stdDeviation x/y terpisah
   (techniques.md §2). Kotak filter dilebarkan supaya ekor blur tidak terpotong.
   Filter dilepas saat blur = 0 (filter permanen = raster ulang tiap frame).
   ========================================================= */
import React, { useId } from 'react';

export const DirBlur: React.FC<{
  amount: number;          // kekuatan blur (px); 0 = tanpa filter
  ax?: number;             // porsi horizontal (1 = gerak horizontal)
  ay?: number;             // porsi vertikal
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ amount, ax = 1, ay = 0.08, style, children }) => {
  const id = 'mb' + useId().replace(/:/g, '');
  const on = amount > 0.05;
  return (
    <div style={{ ...style, filter: on ? `url(#${id})` : undefined }}>
      {on && (
        <svg width={0} height={0} style={{ position: 'absolute' }}>
          <filter id={id} x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation={`${(amount * ax).toFixed(2)} ${(amount * ay).toFixed(2)}`} />
          </filter>
        </svg>
      )}
      {children}
    </div>
  );
};

export const HORIZ = { ax: 1, ay: 0.08 };
export const VERT = { ax: 0.1, ay: 1 };
export const RADIAL = { ax: 1, ay: 1 };
