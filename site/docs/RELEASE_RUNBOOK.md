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
On Render, do not leave a stale `DOCKETMINT_STORAGE_PATH` override pointing at `/opt/render/project/src/storage` unless that exact path is the mounted persistent disk.

## Startup Order

1. Mount persistent storage before service start.
2. Inject environment variables and secrets.
3. On Render, set:
   - `DOCKETMINT_RENDER_DISK_MOUNT_PATH=/var/data`
   - `DOCKETMINT_STORAGE_PATH=/var/data/docketmint-storage`
4. Start the FastAPI web service.
5. Confirm startup log includes the resolved storage path and environment.
6. Confirm bootstrap admin is created only when bootstrap env vars are present.
7. If startup aborts with a storage guard error, remove any stale `DOCKETMINT_STORAGE_PATH` override that points outside the Render disk mount and restart only after `/var/data` is correctly mounted.
8. Treat any auth DB or auth directory initialization before the storage guard as a release-blocking regression.

## Staging Verification Steps

1. Open `/api/system-status` and confirm:
   - `status=ok`
   - `storage_path_source` is expected for the environment
   - `storage_persistence_risk` is not `high`
   - `render_disk_mount_path` is `/var/data` on Render
   - `storage_mount_verified=true`
   - `storage_path_within_render_disk_mount=true`
   - if Render is in use, the resolved storage path is not an unmounted repo path under `/opt/render/project/src`
   - `auth_db_path` and `auth_db_exists` are both present and sane
2. Open `/api/auth/diagnostics` and confirm:
   - sqlite storage is reachable
   - `storage_mount_verified=true`
   - `startup_guard_enabled=true` in production on Render
   - cookie diagnostics reflect the public host and HTTPS request
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
- startup is blocked because Render storage is outside the verified disk mount
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
