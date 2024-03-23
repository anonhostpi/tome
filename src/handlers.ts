import * as url from 'url';
import fs from 'fs';
import camelize from './camelize.js';
import Editor from './editor.js';
import Log from './log.js';
import Clip from './clipboard.js';

export interface Undo {
  action: string,
  chars?: string[],
  doc?: string[][]
}
export type HandlerResult = true | false | {
  appending: boolean | undefined,
  undo: Undo | undefined,
  selecting: boolean | undefined
}
export type Handler = {
  keyName?: string,
  keyNames?: Array<string>,
  selectionRequired?: boolean,
  do: (key: string) => HandlerResult,
  undo?: (undo: Undo) => void,
  redo?: (undo: Undo) => void
};
export type Handlers = Record<string,Handler>;
type GreetFunction = (a: string) => void;

export type HandlerFactoryOptions = {
  editor : Editor,
  clipboard ?: Clip,
  log ?: Log,
  selectorsByName ?: Record<string,string>  
};
export type HandlerFactory = (options: HandlerFactoryOptions) => Handler;
export type HandlerFactories = Record<string,HandlerFactory>;

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
export async function loadHandlerFactories() : Promise<HandlerFactories> {
  const handlerFactories : HandlerFactories = {};
  const names = fs.readdirSync(`${__dirname}/handlers`);
  for (let name of names) {
    const handlerFactory : HandlerFactory = (await import(`${__dirname}/handlers/${name}`)).default;
    name = camelize(name.replace('.js', ''));
    handlerFactories[name] = handlerFactory;
  }
  return handlerFactories;
};
