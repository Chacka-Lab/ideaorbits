import ts from 'typescript';
import prettier from 'prettier';
import { writeFileSync } from 'fs';

const FILE = process.argv[2] ?? '_type-debug.ts';
const TYPE = process.argv[3] ?? 'DebugType';
const OUT = process.argv[4] ?? `_type-output.d.ts`;

const program = ts.createProgram([FILE], { strict: true, noEmit: true });
const checker = program.getTypeChecker();
const src = program.getSourceFile(FILE);
if (!src) {
  console.error('file not found:', FILE);
  process.exit(1);
}

let raw;
ts.forEachChild(src, (node) => {
  if (ts.isTypeAliasDeclaration(node) && node.name.text === TYPE) {
    const type = checker.getTypeAtLocation(node.name);
    raw = `type ${TYPE} = ${checker.typeToString(type, undefined, ts.TypeFormatFlags.NoTruncation)}`;
  }
});

if (!raw) {
  console.error('type not found:', TYPE);
  process.exit(1);
}
const formatted = await prettier.format(raw, { parser: 'typescript' });
writeFileSync(OUT, formatted);
console.log('written to', OUT);
