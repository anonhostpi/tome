"use strict";

import startsWith from '../starts-with.js';
import { inspect } from 'util';

export default ({ editor }) => ({
  keyName: 'c',
  selectionRequired: true,
  async do() {
    if (!editor.getSelection()) {
      throw new Error('toggle-comment invoked without a selection, should be impossible');
    }
    const {
      selRow1,
      selCol1,
      selRow2,
      selCol2
    } = editor.getSelection();
    editor.moveTo(selRow1, 0);
    editor.selRow = selRow2;
    editor.selCol = editor.doc[selRow2].length;
    if (selCol2 === 0) {
      selRow2--;
      editor.selCol = 0;
    }
    const undo = {
      action: 'toggleComment',
      row: editor.row,
      col: editor.col,
      selRow: editor.selRow,
      selCol: editor.selCol,
      chars: []
    };
    const isComment = editor.language.isComment(editor.doc[selRow1]);
    const commentLine = [ ...editor.language.commentLine, ' ' ];
    for (let row = selRow1; (row <= selRow2); row++) {
      const chars = editor.doc[row];
      if (isComment) {
        for (let col = 0; (col < chars.length); col++) {
          if (startsWith(chars, col, commentLine)) {
            undo.chars[row] = [...chars];
            editor.doc[row] = [ ...chars.slice(0, col), ...chars.slice(col + commentLine.length) ];
          }
        }
      } else {
        for (let col = 0; (col < chars.length); col++) {
          if (chars[col] !== ' ') {
            undo.chars[row] = [...chars];
            editor.doc[row] = [ ...chars.slice(0, col), ...commentLine, ...chars.slice(col) ];
            break;
          }
        }
      }
    }
    return {
      selecting: true,
      undo
    };
  },
  async undo(undo) {
    editor.setSelection(undo);
    for (const [ row, chars ] of Object.entries(undo.chars)) {
      editor.doc[row] = [...chars];
    }
  },
  async redo(redo) {
    editor.setSelection(redo);
    editor.handlers.toggleComment.do();
  }
});
