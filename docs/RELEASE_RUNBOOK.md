# DocketMint Release Runbook

## Required Environment Variables

The following values must be set before staging or production startup:

- `DOCKETMINT_ENV`
- `DOCKETMINT_API_PREFIX`
- `DOCKETMINT_FRONTEND_URL`
- `DOCKETMINT_PUBLIC_APP_URL`
- `DOCKETMINT_PUBLIC_APP_WWW_URL`
- `DOCKETMINT_RENDER_SERVICE_URL`
- `DOCKETMINT_ALLOWED_ORIGINS`
- `DOCKETMINT_STORAGE_PATH` or `DOCKETMINT_RENDER_DISK_MOUNT_PATH`
- `DOCKETMINT_BOOTSTRAP_ADMIN_EMAIL`
- `DOCKETMINT_BOOTSTRAP_ADMIN_PASSWORD`
- `DOCKETMINT_ENFORCE_ADMIN_ONLY_CASE_CREATION`
- `DOCKETMINT_ENFORCE_ADMIN_ONLY_PACKET_GENERATION`
- `DOCKETMINT_DEFAULT_PLAN`
- `DOCKETMINT_SESSION_COOKIE_NAME`
- `DOCKETMINT_LOG_LEVEL`

Secrets must come from the deployment secret manager only. Do not commit real credentials into source control.

## Startup Order

1. Mount persistent storage before service start.
2. Inject environment variables and secrets.
3. Start the FastAPI web service.
4. Confirm startup log includes the resolved storage path and environment.
5. Confirm bootstrap admin is created only when bootstrap env vars are present.

## Staging Verification Steps

1. Open `/api/system-status` and confirm:
   - `status=ok`
   - `storage_path_source` is expected for the environment
   - `storage_persistence_risk` is not `high`
2. Open `/api/auth/diagnostics` and confirm:
   - sqlite storage is reachable
   - default plan is expected
   - bootstrap admin email is not exposed as a secret value
3. Verify public root:
   - `/`
   - `/index.html`
   - CTA shows `Start Recovery Diagnostic`
4. Verify auth:
   - sign-up
   - sign-in
   - logout
   - session restore after page refresh
5. Verify RBAC:
   - non-admin can start upload-first intake
   - non-admin cannot create formal matter when enforcement is on
   - non-admin cannot generate packets when enforcement is on
   - admin can create/promote/generate
6. Verify ingestion:
   - PDF contract
   - PDF invoice
   - PDF guaranty
   - XLSX aging
   - CSV aging
   - mixed-debtor conflict
7. Verify routing:
   - blocked and ready statuses surface reason codes
   - court draft remains admin-only and draft-only

## Production Smoke Checks

### Fast auth/platform smoke

```powershell
python -m pytest backend/tests/test_auth_isolation.py backend/tests/test_admin_rbac.py backend/tests/test_platform_services.py backend/tests/test_release_gate.py -q
```

### Ingestion smoke

```powershell
python -m pytest backend/tests/test_ingestion_hardening.py backend/tests/test_processing.py -q
```

### Workflow/UI shell

```powershell
python -m pytest backend/tests/test_workflow_rebuild.py backend/tests/test_shell_architecture.py backend/tests/test_dashboard_history.py -q
```

### Full backend

```powershell
python -m pytest backend/tests -q
```

### End-to-end smoke

```powershell
python scripts/smoke_acceptance.py
```

## Rollback Conditions

Rollback or halt release if any of the following is true:

- auth/session persistence fails after restart
- `storage_persistence_risk` is `high` in the deployed environment
- public root and authenticated app tell different product stories
- upload-first flow dead-ends for non-admin users
- mixed-debtor ingestion is silently merged
- packet generation skips review-gated states
- hidden/internal workflows leak into the public funnel
- full backend regression fails

## Ready Now vs Still Risky

### Ready now

- recovery-first public funnel
- upload-first intake
- admin-gated formal matter and packet generation
- deterministic routing
- monetization/entitlement payload layer
- review-gated packet workflow

### Still risky

- deployment-specific secret misconfiguration
- storage persistence misconfiguration
- unverified physical iPhone device behavior if release depends on on-device QA
- any live environment still serving stale static or backend artifacts after deploy
