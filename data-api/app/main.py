from fastapi import FastAPI
from datasets import load_dataset

from app import utils as app_utils


app = FastAPI()
dataset = load_dataset("roszcz/qrs-swipe-demo", split="train")

app_utils.prepare_database(dataset)


@app.get("/ping")
async def ping():
    return {"message": "pong"}


@app.get("/record/{record_id}")
async def record(record_id: int):
    r = dataset[record_id]
    return r
