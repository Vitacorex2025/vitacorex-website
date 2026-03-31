# VitaCoreX Tech Debt Log

Current debt that still remains:
- RU and ES public routes now exist, but several long-form secondary sections remain English-first.
- Public page generation is file-based rather than componentized SSR.
- The public site and app shell still live in the same repository and deployment surface.
- CRM webhook delivery is best-effort until a production endpoint is configured.
- The public runtime still relies on `backend.vitacorex_runtime.py` as the stable entrypoint because the legacy workspace has drift risk.
