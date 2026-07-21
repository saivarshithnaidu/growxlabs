'use client';

import React from 'react';
import { Stars as DreiStars } from '@react-three/drei';

interface StarsProps {
  count?: number;
}

export const Stars: React.FC<StarsProps> = ({ count = 2500 }) => {
  return (
    <DreiStars
      radius={100}
      depth={50}
      count={count}
      factor={3}
      saturation={0} // Pure white stars, no colored galaxy tint
      fade
      speed={0.5}
    />
  );
};
