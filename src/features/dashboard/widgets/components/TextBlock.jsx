import React, { useRef, useEffect } from 'react';
import { InputBase } from '@mui/material';

const TextBlock = ({ block, updateBlock }) => {
  const textAreaRef = useRef(null);

  // Auto-grow
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
    }
  }, [block.content]);

  return (
    <InputBase
      inputRef={textAreaRef}
      multiline
      fullWidth
      value={block.content}
      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
      placeholder="Type something..."
      sx={{ 
        fontSize: '1.1rem', 
        fontFamily: '"Google Sans", sans-serif',
        color: 'text.primary',
        lineHeight: 1.6,
        p: 1,
        borderRadius: 2,
        border: '1px solid transparent',
        '&:focus-within': { bgcolor: 'action.hover', borderColor: 'divider' } 
      }}
    />
  );
};

export default TextBlock;