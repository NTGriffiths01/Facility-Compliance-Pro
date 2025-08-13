import os, io, json, hashlib
from fastapi.responses import FileResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from PyPDF2 import PdfReader, PdfWriter

POLICY_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "policy"))
HASH_FILE = os.path.join(POLICY_DIR, "hashes.json")

def stream_policy(doc_id: str) -> FileResponse:
    mapping = {
        "103DOC730": "730 - Accessible.pdf",
        "103DOC750": "750 - Accessible.pdf",
    }
    filename = mapping.get(doc_id)
    if not filename:
        raise FileNotFoundError
    path = os.path.join(POLICY_DIR, filename)
    with open(HASH_FILE) as f:
        hashes = json.load(f)
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    if hashes.get(filename) != h.hexdigest():
        raise ValueError("hash mismatch")
    return FileResponse(path, media_type="application/pdf", filename=filename)

def stamp_summary_pdf(title: str, fields: dict) -> bytes:
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)
    width, height = letter
    c.setFont("Helvetica-Bold", 16)
    c.drawString(72, height - 72, title)
    c.setFont("Helvetica", 10)
    y = height - 100
    for k, v in fields.items():
        c.drawString(72, y, f"{k}: {v}")
        y -= 14
        if y < 72:
            c.showPage()
            y = height - 72
    c.showPage(); c.save()
    buf.seek(0)
    return buf.read()
