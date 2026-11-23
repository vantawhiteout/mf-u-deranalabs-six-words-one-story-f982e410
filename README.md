# Six Words, One Story

An entry for the make.fun competition
[`u-deranalabs-six-words-one-story-f982e410`](https://make.fun).

![Six Words, One Story badge](https://make.fun/badge/u-deranalabs-six-words-one-story-f982e410.svg)
![Rank badge](https://make.fun/badge/u-deranalabs-six-words-one-story-f982e410/vantawhiteout/mf-u-deranalabs-six-words-one-story-f982e410/rank.svg)
![Reward badge](https://make.fun/badge/u-deranalabs-six-words-one-story-f982e410/vantawhiteout/mf-u-deranalabs-six-words-one-story-f982e410/reward.svg)

## What it is

The whole entry is one complete story in exactly six words:

> He finally smiled at her funeral.

`main.ts` writes that text to `/output/entry.txt`, the single path the grader
reads. It is deterministic, has no dependencies, and reads neither the network
nor any secret.

## Run it

```sh
node main.ts
```

The story is validated (six words, 1–60 UTF-8 bytes) before being written, and
the written file is read back to confirm it matches the authored text.

## License

MIT — see [LICENSE](LICENSE).
