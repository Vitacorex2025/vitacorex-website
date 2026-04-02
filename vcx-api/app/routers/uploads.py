"""POST /api/uploads — Upload additional documents to an existing matter."""

import os
import uuid
from pathlib import Path

from fastapi import APIRouter, File, Header, HTTPException, UploadFile

from ..db import get_conn
from ..models.intake import UploadResponse
from ..services.magic_link import validate_token

router = APIRouter()

UPLOADS_DIR = Path(os.getenv("VCX_UPLOADS_DIR", "uploads"))


@router.post("/api/uploads/{matter_id}", status_code=201, response_model=UploadResponse)
async def upload_documents(
    matter_id: str,
    files: list[UploadFile] = File(...),
    authorization: str = Header(...),
):
    token = authorization.replace("Bearer ", "").strip()

    with get_conn() as conn:
        if not validate_token(matter_id, token, conn):
            raise HTTPException(status_code=403, detail="Invalid or expired token")

        matter_dir = UPLOADS_DIR / matter_id
        matter_dir.mkdir(parents=True, exist_ok=True)

        docs = []
        for f in files:
            file_id = str(uuid.uuid4())
            safe_name = f"{file_id}_{f.filename}"
            file_path = matter_dir / safe_name
            content = await f.read()
            file_path.write_bytes(content)

            conn.execute(
                """INSERT INTO documents
                   (id, matter_id, filename, original_name, content_type,
                    size_bytes, storage_path)
                   VALUES (?,?,?,?,?,?,?)""",
                (file_id, matter_id, safe_name, f.filename,
                 f.content_type, len(content), str(file_path)),
            )
            docs.append({
                "id": file_id,
                "original_name": f.filename,
                "size_bytes": len(content),
            })

    return UploadResponse(ok=True, matter_id=matter_id, documents=docs)
