from fastapi import FastAPI
from datasets import load_dataset


app = FastAPI()
dataset = load_dataset("roszcz/maestro-v1-sustain", split="train")


@app.get("/ping")
async def ping():
    return {"message": "pong"}


@app.get("/record")
async def record():
    r = dataset[0]
    return r
