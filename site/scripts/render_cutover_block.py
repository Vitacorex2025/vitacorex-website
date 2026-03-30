from __future__ import annotations

import sys


MESSAGE = """This repo-root Procfile no longer serves the public DocketMint web app.
canonical_public_target=render.yaml -> runtime=node -> rootDir=tmp_deadline_v10_validation
why_blocked=The root Python/static stack is retained only for archive and forensic comparison.
fix_render=Create or retarget the Render public web service from render.yaml and move the custom domain to the Node service.
legacy_python=Only run backend/main.py intentionally for non-public internal archive work.
"""


def main() -> int:
    sys.stderr.write(MESSAGE)
    if not MESSAGE.endswith("\n"):
        sys.stderr.write("\n")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
