import * as path from 'path';
import * as fs from 'fs';
import Debug from 'debug';
import * as ini from 'ini';
import { diffString } from 'json-diff';

export function debug(namespace = '') {
  return Debug(`@joelbot/lint${namespace ? `:${namespace}` : ''}`);
}

const _debug = debug('util');

export function readJson(file, fallback = {}) {
  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } else {
    _debug(`file ${path.resolve(file)} does not exist, returning default value ${JSON.stringify(fallback)}`);
    return fallback;
  }
}

export function writeJson(file, data) {
  const dirname = path.dirname(file);
  if (!fs.existsSync(dirname)) {
    _debug('creating directory', dirname);
    fs.mkdirSync(dirname, { recursive: true });
  }
  const content = JSON.stringify(data, null, 2) + '\n';
  if (fs.existsSync(file)) {
    const oldData = JSON.parse(fs.readFileSync(file, 'utf-8'));
    const diff = diffString(oldData, data);
    if (diff === '') {
      _debug(`json diff of ${path.resolve(file)} old/new content has no changes.`);
      return;
    }
    _debug(`updating existing file ${path.resolve(file)}, diff:`, diff);
  } else {
    _debug('writing new file', path.resolve(file), content);
  }
  fs.writeFileSync(file, content);
}

export function readIni(file, fallback = {}) {
  if (fs.existsSync(file)) {
    return ini.parse(fs.readFileSync(file, 'utf-8'));
  } else {
    _debug(`file ${file} does not exist, returning default value ${JSON.stringify(fallback)}`);
    return fallback;
  }
}

export function writeIni(file, data) {
  const dirname = path.dirname(file);
  if (!fs.existsSync(dirname)) {
    _debug('creating directory', dirname);
    fs.mkdirSync(dirname, { recursive: true });
  }
  const content = ini.stringify(data);
  if (fs.existsSync(file)) {
    const oldData = ini.parse(fs.readFileSync(file, 'utf-8'));
    const diff = diffString(oldData, data);
    if (diff === '') {
      _debug(`ini diff of ${file} old/new content has no changes.`);
      return;
    }
    _debug(`updating existing file ${file}, diff:`, diff);
  } else {
    _debug('writing new file', file, content);
  }
  fs.writeFileSync(file, content);
}

export function readLines(file, fallback = []) {
  if (fs.existsSync(file)) {
    return fs.readFileSync(file, 'utf-8').split('\n');
  }
  _debug(`file ${file} does not exist, returning default value ${JSON.stringify(fallback)}`);
  return fallback;
}

export function writeLines(file, lines) {
  const dirname = path.dirname(file);
  if (!fs.existsSync(dirname)) {
    _debug('creating directory', dirname);
    fs.mkdirSync(dirname, { recursive: true });
  }
  const content = lines.join('\n');
  if (fs.existsSync(file)) {
    const oldData = fs.readFileSync(file, 'utf-8').split('\n');
    const diff = diffString(oldData, lines);
    if (diff === '') {
      _debug(`lines diff of ${file} old/new content has no changes.`);
      return;
    }
    _debug(`updating existing file ${file}, diff:`, diff);
  } else {
    _debug('writing new file', file, content);
  }
  fs.writeFileSync(file, content);
}

export function truthy(value) {
  return (typeof value === 'string' && value.toLowerCase() === 'true') || !!value;
}

export function sortKeys(data, order) {
  return Object.fromEntries(
    Object.entries(data).sort((a, b) => {
      const aIndex = order.indexOf(a[0]);
      const bIndex = order.indexOf(b[0]);
      if (aIndex === -1 && bIndex === -1) {
        return a[0].localeCompare(b[0]);
      }
      if (aIndex === -1) {
        return 1;
      }
      if (bIndex === -1) {
        return -1;
      }
      return aIndex - bIndex;
    }),
  );
}
