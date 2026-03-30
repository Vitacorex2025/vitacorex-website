# QA Report

## Summary

The public audited site surfaces passed runtime, translation, placeholder-proof, link/asset, HTML, JS, phone, tracker, and backend regression checks.

## Passed checks

- Browser/device matrix
- WebKit spot check
- Link and asset integrity
- HTML sanity
- JS sanity
- Visible translation gate
- Placeholder-proof scan
- Phone consistency scan
- Tracker/attribution presence scan
- Backend regression tests

## Failed / blocked checks

- Deploy-readiness check failed because the active deploy files still point at the stale Node/DocketMint runtime.

## Final QA outcome

- Public-page QA: pass
- Deploy-safe release candidate: fail
- See `reports/SHIP_DECISION.md`
