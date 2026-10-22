import type { SvgProps } from 'react-native-svg';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export function Shop({ color = '#000', ...props }: SvgProps) {
  return (
    <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
      <Path
        d="M4 4h16l1.2 4.2A2.4 2.4 0 0 1 18.9 11a2.4 2.4 0 0 1-2.3-1.8A2.4 2.4 0 0 1 14.3 11 2.4 2.4 0 0 1 12 9.2 2.4 2.4 0 0 1 9.7 11 2.4 2.4 0 0 1 7.4 9.2 2.4 2.4 0 0 1 5.1 11 2.4 2.4 0 0 1 2.8 8.2L4 4Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <Path
        d="M5 11.5V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7.5M10 20v-5h4v5"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
