"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var factory = function (_a) {
    var Editor = _a.editor;
    return ({
        keyName: 'backspace',
        do: function () {
            if (!editor.back()) {
                return false;
            }
            var undo = {
                action: 'backspace',
                row: editor.row,
                col: editor.col,
                char: editor.peek()
            };
            var result = editor.erase();
            if (result) {
                return {
                    undo: undo
                };
            }
            else {
                return false;
            }
        },
        undo: function (undo) {
            editor.moveTo(undo.row, undo.col);
            editor.insert([undo.char]);
        },
        redo: function (undo) {
            editor.moveTo(undo.row, undo.col);
            editor.erase();
        }
    });
};
exports.default = factory;
