"use strict";

import fs from 'fs';
import properLockFile from 'proper-lockfile';

export default ({
  stateFolder,
  lock = function lock(filename) {
    return properLockFile(filename, {
      retries: {
        retries: 30,
        factor: 1,
        minTimeout: 1000,
        maxTimeout: 1000
      },
      // Avoid chicken and egg problem when the file does not exist yet
      realpath: false
    });
  }
}) => {
  const clipboardFile = `${stateFolder}/clipboard.json`;
  const clipboardLockFile = `${clipboardFile}.lock`;
  return {
    async set(chars) {
      const release = await lock(clipboardLockFile);
      try {
        fs.writeFileSync(clipboardFile, JSON.stringify(chars));
      } finally {
        await release();
      }
    },
    async get(chars) {
      const release = await lock(clipboardLockFile);
      try {
        const clipboard = JSON.parse(fs.readFileSync(clipboardFile));
        return clipboard;
      } catch (e) {
        if (e.code === 'ENOENT') {
          // No clipboard exists right now
          return false;
        }
        throw e;
      } finally {
        await release();
      }
    }
  };
};
