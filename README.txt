DocketMint live API recovery package

Chosen deployment model
- Immediate recovery: split-origin with explicit Vercel rewrites to the live Render FastAPI service.
- Long-term preferred model: same-origin on the Render web service, with docketmint.app and www.docketmint.app attached directly to that service.

Why this package fixes the live failure
- The live shell is reachable on docketmint.app, but the backend is live on https://docetmint.onrender.com.
- api.docketmint.app is not serving the backend right now.
- The workspace therefore needs:
  1. explicit /api and /files proxying on Vercel
  2. a direct Render fallback candidate in the browser runtime
  3. consistent backend public URL / allowed-origin settings

Deployment steps
1. Deploy this project to the existing Render web service.
2. In Vercel, redeploy the frontend with vercel.json included.
3. Confirm the Vercel project still owns:
   - docketmint.app
   - docetmint.vercel.app
4. Confirm the Render service is the live FastAPI app at:
   - https://docetmint.onrender.com
5. After deploy, verify:
   - https://docketmint.app/api/health
   - https://docketmint.app/api/system-status
   - https://docketmint.app/api/cases?limit=1
   - https://docketmint.app/app/new-case/

Long-term cleanup
- Attach api.docketmint.app to the Render web service if you want a dedicated backend domain.
- Or move docketmint.app and www.docketmint.app directly onto the Render service for full same-origin hosting and retire the Vercel dependency for the workspace.

Files that matter most
- vercel.json
- render.yaml
- backend/main.py
- backend/core/config.py
- assets/js/runtime-config.js
- assets/js/config.js
- assets/js/api-client.js
