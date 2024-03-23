"use strict";

import Editor from '../editor.js';
import { HandlerFactory } from '../handlers.js';

const factory: HandlerFactory = ({ editor: Editor }) => ({
  keyName: 'backspace',
  do(key: string) {
    if (!editor.back()) {
      return false;
    }
    const undo = {
      action: 'backspace',
      row: editor.row,
      col: editor.col,
      char: editor.peek()
    };
    const result = editor.erase();
    if (result) {
      return {
        undo
      };
    } else {
      return false;
    }
  },
  undo(undo) {
    editor.moveTo(undo.row, undo.col);
    editor.insert([ undo.char ]);
  },
  redo(undo) {
    editor.moveTo(undo.row, undo.col);
    editor.erase();
  }
});

export default factory;
