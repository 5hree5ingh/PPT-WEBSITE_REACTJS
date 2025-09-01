import React from 'react';
import { useCustomCursor } from '../../hooks/useCustomCursor';
import './Cursor.css';

const Cursor = () => {
  useCustomCursor();

  return <div className="cursor" data-cursor></div>;
};

export default Cursor;