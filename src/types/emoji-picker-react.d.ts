declare module 'emoji-picker-react' {
  import { Component } from 'react';

  export interface EmojiClickData {
    emoji: string;
    unified: string;
    originalUnified: string;
    names: string[];
    activeSkinTone: string;
    unifiedWithoutSkinTone: string;
  }

  export interface EmojiPickerProps {
    onEmojiClick?: (emojiData: EmojiClickData) => void;
    autoFocusSearch?: boolean;
    searchDisabled?: boolean;
    skinTonesDisabled?: boolean;
    emojiStyle?: 'native' | 'apple' | 'google' | 'twitter' | 'facebook';
    defaultSkinTone?: string;
    categories?: string[];
    lazyLoadEmojis?: boolean;
    searchPlaceHolder?: string;
    width?: number | string;
    height?: number | string;
    className?: string;
    style?: React.CSSProperties;
  }

  export default class EmojiPicker extends Component<EmojiPickerProps> {}
} 