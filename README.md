# @openhint/hintbook-technical-writer

The official [HINT](https://github.com/open-hint-dev/hint) vocabulary for technical writers. The assistant writes inside the declared doc set; it never invents flags, fields, defaults, or product behavior.

Measured performance and retrieval results live in the core [benchmark report](https://github.com/open-hint-dev/hint/blob/main/docs/09-benchmarks.md).

```
hint.yml
_.hint
tutorials/
├── _.hint
└── artifact.md.hint
reference/
└── _.hint
shared/policy.hint
```

## Installation

```bash
hint add @openhint/hintbook-technical-writer
hint apply
```

## Vocabulary

| Doc set | `docset`, `audience`, `doctype`, `version`, `applies`, `nav` |
| Page | `page`, `section`, `prerequisite`, `procedure`, `admonition`, `snippet`, `link` |
| Language | `banned`, `locale` |
| Governance | `owner`, `review`, `deprecate` |
| Shared core | `never`, `source`, `term`, `assumption`, `risk`, `decision`, `openquestion`, `checklist`, `style`, `example`, `good`, `bad`, `read`, `res`, `notes` |

Natural plurals and long forms are included as keyword synonyms; profession search synonyms are declared in `keywords/hintbook.json`. Full reference: [docs/keywords.md](docs/keywords.md).

## Output and framing

| Command | Result |
| --- | --- |
| `hint <path>` | Scoped profession knowledge only. |
| `hint --prompt <path>` | Role header, scoped knowledge, verification footer. |
| `hint --standalone <path>` | Prompt plus the complete tag glossary. |

Verifiable surfaces: `page`. These names are stable artifact identifiers and must appear verbatim.

## Deterministic emit

The markdown pack emits reviewable documentation page structure without a model. Run `hint emit <path>` and gate CI with `hint emit --check`. Prose that templates cannot derive remains a marked hole.

## Example

```markdown
# docset tutorials

Declared context for the documentation page.

# never Invented details

The assistant writes inside the declared doc set; it never invents flags, fields, defaults, or product behavior.
```

## License

MIT
