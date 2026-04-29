import { TextStyle } from 'react-native';

type FontWeight = TextStyle['fontWeight'];

const weight = {
  regular: '400' as FontWeight,
  semibold: '600' as FontWeight,
  bold: '700' as FontWeight,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: weight.bold, lineHeight: 36 } as TextStyle,
  h2: { fontSize: 22, fontWeight: weight.semibold, lineHeight: 28 } as TextStyle,
  h3: { fontSize: 18, fontWeight: weight.semibold, lineHeight: 24 } as TextStyle,
  body: { fontSize: 16, fontWeight: weight.regular, lineHeight: 22 } as TextStyle,
  bodySmall: { fontSize: 14, fontWeight: weight.regular, lineHeight: 20 } as TextStyle,
  caption: { fontSize: 12, fontWeight: weight.regular, lineHeight: 16 } as TextStyle,
  arabic: { fontSize: 24, fontWeight: weight.regular, lineHeight: 40, writingDirection: 'rtl' } as TextStyle,
} as const;
