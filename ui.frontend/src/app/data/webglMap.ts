import Color from 'mediamonks-webgl/renderer/math/Color';

export enum WebglType {
  PURPLE = 'purple',
  PINK_PURPLE = 'pink-purple',
  BLACK_GREEN = 'black-green',
  WHITE_GREEN = 'white-green',
  WHITE_PURPLE = 'white-purple',
}

export const WebglOptions = [
  {
    type: WebglType.PURPLE,
    gradientColors: [
      new Color().setHex('#774582'),
      new Color().setHex('#420950'),
      new Color().setHex('#531361'),
    ],
    asset: './image-purple.webp',
  },
  {
    type: WebglType.PINK_PURPLE,
    gradientColors: [
      new Color().setHex('#feedf5'),
      new Color().setHex('#ef58a5'),
      new Color().setHex('#936299'),
    ],
    asset: './image-pink-purple.webp',
  },
  {
    type: WebglType.BLACK_GREEN,
    gradientColors: [
      new Color().setHex('#054927'),
      new Color().setHex('#000000'),
      new Color().setHex('#363434'),
    ],
    asset: './image-black-green.webp',
  },
  {
    type: WebglType.WHITE_GREEN,
    gradientColors: [
      new Color().setHex('#a5f4cc'),
      new Color().setHex('#d7d7d7'),
      new Color().setHex('#fcfcfc'),
    ],
    asset: './image-white-green.webp',
  },
  {
    type: WebglType.WHITE_PURPLE,
    gradientColors: [
      new Color().setHex('#e0d6e1'),
      new Color().setHex('#ebe1ea'),
      new Color().setHex('#c59bc7'),
    ],
    asset: './image-white-purple.webp',
  },
];
