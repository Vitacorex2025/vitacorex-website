# VitaCoreX Deployment And Rollback

Preferred runtime:
- `main_vitacorex.py`
- `backend.vitacorex_runtime:app`

Pre-release checklist:
- Run `python scripts/build_vitacorex_public_release.py`
- Run `python scripts/vitacorex_release_check.py`
- Run `python -m pytest backend/tests/test_vitacorex_public_release.py -q`

Deployment notes:
- Ensure `VITACOREX_PUBLIC_BASE_URL` matches the production domain.
- Configure `VITACOREX_CRM_WEBHOOK_URL` before expecting external CRM sync.
- If no CRM webhook is configured, structured lead storage still works and forms no longer depend on inbox-only routing.

Rollback:
- Revert the modified public files and `backend/vitacorex_runtime.py`
- Redeploy the previous ZIP or previous git state
- Keep the lead storage directory intact so submissions are not lost during rollback
