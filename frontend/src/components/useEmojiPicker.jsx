import { useEffect, useRef, useState } from 'react';

const useEmojiPicker = (inputRef, setInput) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    if (!emojiPickerRef.current) {
      const picker = document.createElement('emoji-picker');
      picker.classList.add('dark:light-theme');
      picker.style.display = 'none';
      document.body.appendChild(picker);
      emojiPickerRef.current = picker;
      
      picker.addEventListener('emoji-click', (event) => {
        event.stopPropagation();
        const emoji = event.detail.unicode;
        setInput(prev => {
          const cursorPosition = inputRef.current?.selectionStart || prev.length;
          const textBeforeCursor = prev.slice(0, cursorPosition);
          const textAfterCursor = prev.slice(cursorPosition);
          return textBeforeCursor + emoji + textAfterCursor;
        });
        
        setTimeout(() => {
          inputRef.current?.focus();
          const newPosition = (inputRef.current?.selectionStart || 0) + 1;
          inputRef.current?.setSelectionRange(newPosition, newPosition);
        }, 0);
      });
    }

    return () => {
      if (emojiPickerRef.current && document.body.contains(emojiPickerRef.current)) {
        document.body.removeChild(emojiPickerRef.current);
      }
    };
  }, []);

  return { showEmoji, setShowEmoji, emojiPickerRef };
};

export default useEmojiPicker;