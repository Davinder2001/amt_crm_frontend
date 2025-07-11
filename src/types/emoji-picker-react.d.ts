declare module 'emoji-picker-react' {
  export interface EmojiClickData {
    emoji: string;
    unified: string;
    originalUnified: string;
    names: string[];
    activeSkinTone: string;
    emoji: string;
  }

  export interface EmojiPickerProps {
    onEmojiClick?: (emojiData: EmojiClickData) => void;
    autoFocusSearch?: boolean;
    searchDisabled?: boolean;
    skinTonesDisabled?: boolean;
    emojiStyle?: 'native' | 'apple' | 'google' | 'twitter' | 'facebook';
    defaultSkinTone?: string;
    lazyLoadEmojis?: boolean;
    previewConfig?: {
      showPreview?: boolean;
      showEmoji?: boolean;
      showSkinTones?: boolean;
      emojiSize?: number;
    };
    suggestedEmojisMode?: 'recent' | 'frequent' | 'top';
    skinTonePickerLocation?: 'preview' | 'search' | 'none';
    theme?: 'light' | 'dark' | 'auto';
    width?: number | string;
    height?: number | string;
    className?: string;
    style?: React.CSSProperties;
  }

  const EmojiPicker: React.FC<EmojiPickerProps>;
  export default EmojiPicker;
} 