# Dual Engine Smoke Test Results

## 2026-03-21

Status: passed.

Smoke command:

`cmd /c ".venv\Scripts\activate.bat && python -m pytest backend/tests/test_auth_isolation.py backend/tests/test_release_gate.py -q"`

Smoke output:

`.........................                                                [100%]`

`25 passed in 91.67s (0:01:31)`
