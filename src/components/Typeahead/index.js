import React, { useState, } from 'react';

export default function Typeahead({
  placeholder,
})
{
  const [value, setValue] = useState('');

  return (
    <input
      placeholder={placeholder}
      type="text"
      value={value} />
  );
}
