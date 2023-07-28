from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import utils as app_utils


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


dataset = app_utils.prepare_database("roszcz/qrs-swipe-demo")
# dataset = app_utils.prepare_database("roszcz/qrs-review-v0")


@app.get("/ping")
async def ping():
    return {"message": "pong"}


@app.get("/record/{record_id}")
async def record(record_id: int):
    r = dataset[record_id]
    return r


@app.get("/data")
async def get_record(exam_uid: str, position: int):
    # This is guaranteed to be unique
    r = dataset.filter(lambda r: r["position"] == position and r["exam_uid"] == exam_uid)
    r = r[0]

    return r
