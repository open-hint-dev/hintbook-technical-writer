import * as Fs from 'node:fs';
import * as Path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = Path.resolve(import.meta.dirname, '..');
const KEYWORDS = Path.join(ROOT, 'keywords');
const CORE = {
    never: 'strict_prohibition', source: 'evidence_source', term: 'defined_term',
    assumption: 'stated_assumption', risk: 'identified_risk', decision: 'settled_decision',
    openquestion: 'open_question', checklist: 'verification_checklist', style: 'style_requirements',
    example: 'few_shot_example', good: 'enforced_patterns', bad: 'prohibited_anti_patterns',
    read: 'read_it', res: 'static_asset',
};
const RUNNING = ['__system__','__header__','__footer__','__authoring__','__config__','__file__','__folder__'];
const problems = [];
const files = Fs.readdirSync(KEYWORDS).filter((name) => name.endsWith('.md'));

for (const required of [...Object.keys(CORE), 'notes', ...RUNNING]) {
    if (!files.includes(`${required}.md`)) problems.push(`keywords/${required}.md is missing`);
}

for (const file of files.filter((name) => !name.startsWith('__'))) {
    const content = Fs.readFileSync(Path.join(KEYWORDS, file), 'utf8');
    if (!/^description:\s*(?:\||>)/m.test(content)) problems.push(`${file}: description must be a paragraph block`);
    if (!/Example:/m.test(content)) problems.push(`${file}: description needs a worked Example`);
    if (!/^synonyms:/m.test(content)) problems.push(`${file}: synonyms are missing`);
    for (const key of ['surface','exclude']) {
        const match = content.match(new RegExp(`^${key}:\\s*(\\S+)`, 'm'));
        if (match && !['true','false'].includes(match[1])) problems.push(`${file}: ${key} must be boolean`);
    }
}

for (const [name, tag] of Object.entries(CORE)) {
    const content = Fs.readFileSync(Path.join(KEYWORDS, `${name}.md`), 'utf8');
    if (!content.includes(`<${tag}`)) problems.push(`${name}: canonical tag must be <${tag}>`);
}
if (!/^exclude:\s*true$/m.test(Fs.readFileSync(Path.join(KEYWORDS, 'notes.md'), 'utf8'))) problems.push('notes must be excluded');

const manifest = JSON.parse(Fs.readFileSync(Path.join(KEYWORDS, 'hintbook.json'), 'utf8'));
if (!Array.isArray(manifest.synonyms) || manifest.synonyms.length === 0) problems.push('manifest search synonyms are missing');

const se = Path.resolve(ROOT, '../hintbook-software-engineer/keywords');
const alignedReferences = new Set(['hintbook-software-engineer','hintbook-lawyer','hintbook-librarian']);
if (Fs.existsSync(se) && !alignedReferences.has(manifest.id)) {
    const seNames = new Set(Fs.readdirSync(se).filter((name) => name.endsWith('.md') && !name.startsWith('__')).map((name) => name.slice(0,-3)));
    const allowed = new Set([...Object.keys(CORE), 'notes', 'table', 'column', 'row']);
    for (const file of files.filter((name) => !name.startsWith('__'))) {
        const name = file.slice(0,-3);
        if (seNames.has(name) && !allowed.has(name)) {
            const own = Fs.readFileSync(Path.join(KEYWORDS, file), 'utf8');
            const reference = Fs.readFileSync(Path.join(se, file), 'utf8');
            if (own !== reference) problems.push(`${name}: shadows hintbook-software-engineer with a different instruction`);
        }
    }
}

if (Fs.existsSync(Path.join(ROOT, 'testdata/example/hint.yml'))) {
    const result = spawnSync('npx', ['-y','@openhint/cli@1.5.1','artifact.md'], {cwd:Path.join(ROOT,'testdata/example'), encoding:'utf8'});
    if (result.status !== 0) problems.push(`fixture compile failed (${result.status}): ${(result.stderr || result.stdout).trim()}`);
    if (/unknown[_ -]keyword|passthrough/i.test(`${result.stdout}\n${result.stderr}`)) problems.push('fixture compile contains an unknown-keyword passthrough');
    if (Fs.existsSync(Path.join(ROOT, 'emit'))) {
        const fixtureRoot = Path.join(ROOT,'testdata/example');
        const targets = Fs.readdirSync(fixtureRoot,{recursive:true}).filter((name) => name.endsWith('.hint') && !name.endsWith('_.hint')).map((name) => name.slice(0,-5));
        const emit = spawnSync('npx', ['-y','@openhint/cli@1.5.1','emit','--check',...targets], {cwd:fixtureRoot, encoding:'utf8'});
        if (emit.status !== 0) problems.push(`fixture emit --check failed (${emit.status}): ${(emit.stderr || emit.stdout).trim()}`);
    }
}

if (problems.length) {
    for (const problem of problems) console.error(`::error::${problem}`);
    process.exit(1);
}
console.log(`${files.length - RUNNING.length} keyword instructions, ${RUNNING.length} running instructions, common core, composition, metadata, and fixture compile are consistent.`);
