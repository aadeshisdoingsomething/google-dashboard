import React, { useRef, useEffect } from 'react';
import { InputBase } from '@mui/material';

const TextBlock = ({ block, updateBlock }) => {
  const textAreaRef = useRef(null);

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
      placeholder="Type here..."
      sx={{ 
        fontSize: '1.1rem', 
        fontFamily: '"Google Sans", sans-serif',
        color: 'text.primary',
        lineHeight: 1.6,
        p: 0.5, 
        // Removed borders and background focus for a clean "Doc" feel
        '& textarea': { padding: 0 }
      }}
    />
  );
};

export default TextBlock;