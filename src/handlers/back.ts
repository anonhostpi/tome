"use strict";

import { HandlerFactory } from '../handlers.js';
import Editor from '../editor.js';
import select from '../select.js';

const factory: HandlerFactory = ({ editor }) => ({
  keyName: 'left',
  do(key: string) {
    return select({
      editor,
      move() {
        return editor.back();
      }
    });
  }
});

export default factory;
