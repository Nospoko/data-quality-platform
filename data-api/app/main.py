from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datasets import load_dataset

from app import utils as app_utils


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

dataset = load_dataset("roszcz/qrs-swipe-demo", split="train[:200]")

app_utils.prepare_database(dataset)


@app.get("/ping")
async def ping():
    return {"message": "pong"}


@app.get("/record/{record_id}")
async def record(record_id: int):
    r = dataset[record_id]
    return r
