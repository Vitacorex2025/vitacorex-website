"""Legacy archive entrypoint for the retired root Python service.

The canonical public DocketMint web target is the Next.js app under
`tmp_deadline_v10_validation`, published through `render.yaml`.
"""

from backend.main import app

__all__ = ["app"]
