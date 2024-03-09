import * as util from '../util.js';

export default function configure() {
  const config = {
    ...util.readIni('.editorconfig'),
    root: true,
    '*': {
      charset: 'utf-8',
      insert_final_newlint: true,
      end_of_line: 'lf',
      indent_style: 'space',
      indent_size: '2',
      max_line_length: '180',
      trim_trailing_whitespace: true,
    },
  };
  util.writeIni('.editorconfig', config);
}
