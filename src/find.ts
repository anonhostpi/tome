import Editor from './editor.js';
import { Undo } from './handlers.js';

interface UndoFind extends Undo {
  row: number,
  col: number,
  target: string[],
  replacement: string[],
  direction: 1 | -1
}

function find(editor: Editor, {
  target,
  replacement = false,
  fromRow = 0,
  fromCol = 0,
  caseSensitive = false,
  regExp = false,
  direction = 1
} : {
  target: string[],
  replacement: false | string[],
  fromRow: number,
  fromCol: number,
  caseSensitive: boolean,
  regExp: boolean,
  direction: 1 | -1
}, repeat = true) {
  const normalizeChar = caseSensitive ? caseSensitiveNormalizeChar : caseInsensitiveNormalizeChar;
  if ((fromRow === 0) && (fromCol === 0)) {
    repeat = false;
  }
  if (direction === 1) {
    for (let row = fromRow; (row < editor.doc.length); row++) {
      const editorChars = editor.doc[row];
      if (regExp) {
        const expression = regExp && new RegExp(target.join(''), caseSensitive ? '' : 'i');
        const s = editorChars.slice(fromCol).join('');
        const indexOf = s.search(expression);
        if (indexOf >= 0) {
          return replaceAndOrMove(editorChars, row, indexOf);
        }
      } else {
        for (let col = fromCol; (col < editorChars.length); col++) {
          let j;
          for (j = 0; (j < target.length); j++) {
            if (normalizeChar(editorChars[col + j]) !== normalizeChar(target[j])) {
              break;
            }
          }
          if (j === target.length) {
            return replaceAndOrMove(editorChars, row, col);
          }
        }
      }
      fromCol = 0;
    }
    if (repeat) {
      return find(editor, {
        target,
        replacement,
        fromRow: 0,
        fromCol: 0,
        caseSensitive,
        regExp,
        direction
      }, false);
    }
  } else {
    let row: number;
    for (row = fromRow; (row >= 0); row--) {
      const editorChars = editor.doc[row];
      if (regExp) {
        const expression = regExp && new RegExp(target.join(''), 'g' + (caseSensitive ? '' : 'i'));
        const s = editorChars.slice(0, fromCol).join('');
        const matches = s.matchAll(expression);
        const [match] = matches;
        if (match) {
          // TypeScript bug: https://github.com/microsoft/TypeScript/issues/36788
          const indexOf = <number>match.index;
          return replaceAndOrMove(editorChars, row, indexOf);
        }
      } else {
        for (let col = fromCol; (col >= 0); col--) {
          let j;
          for (j = 0; (j < target.length); j++) {
            if (col - j < 0) {
              break;
            }
            if (normalizeChar(editorChars[col - j]) !== normalizeChar(target[target.length - j - 1])) {
              break;
            }
          }
          if (j === target.length) {
            return replaceAndOrMove(editorChars, row, col - target.length + 1);
          }
        }
      }
      fromCol = editorChars.length - 1;
    }
    if (repeat) {
      return find(editor, {
        target,
        replacement,
        fromRow: editor.doc.length - 1,
        fromCol: editor.doc[editor.doc.length - 1].length - 1,
        caseSensitive,
        regExp,
        direction
      }, false);
    }
  }
  return false;
  function replaceAndOrMove(chars: string[], row: number, col: number) {
    if (replacement) {
      editor.undos.push({
        action: 'find',
        row,
        col,
        target,
        replacement,
        direction
      } as UndoFind);
    }
    if (replacement !== false) {  
      chars.splice(col, target.length, ...replacement);
    }
    let newCol = (direction === 1) ? ((replacement === false) ? col : col + replacement.length)
      : col;
    editor.moveTo(row, newCol);
    return true;
  }
}
  
export default find;

function caseSensitiveNormalizeChar(ch: string): string {
  return ch;
}

function caseInsensitiveNormalizeChar(ch: string): string {
    return ch.toLowerCase();
}