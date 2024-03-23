"use strict";

export default ({ editor }) => ({
  keyName: 'control-right',
  do() {
    if (editor.col === editor.doc[editor.row].length) {
      return false;
    }
    editor.moveTo(editor.row, editor.doc[editor.row].length);
    return true;
  }
});
