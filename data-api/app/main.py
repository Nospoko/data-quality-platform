from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import config as C
from app import utils as app_utils


app = FastAPI()

# TODO Learn more about CORS
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


dataset = app_utils.prepare_database(C.DATASET_NAME)


@app.get("/ping")
async def ping():
    return {"message": "pong"}


@app.get("/record/{record_id}")
async def record(record_id: int):
    r = dataset[record_id]
    return r


@app.get("/data")
async def get_record(exam_uid: str, position: int, dataset_name: str):
    # This is guaranteed to be unique
    r = dataset.filter(lambda r: r["position"] == position and r["exam_uid"] == exam_uid)
    r = r[0]

    return r
