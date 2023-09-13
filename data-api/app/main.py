import io
import fortepyan as ff
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
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


if C.DATA_PROBLEM == "ecg_classification":
    dataset = app_utils.prepare_ecg_classification(C.DATASET_NAME)
elif C.DATA_PROBLEM == "ecg_segmentation":
    dataset = app_utils.prepare_ecg_classification(C.DATASET_NAME)
elif C.DATA_PROBLEM == "midi_review":
    dataset = app_utils.prepare_midi_review(C.DATASET_NAME)
else:
    raise NotImplementedError("Incorrect data problem")


@app.get("/ping")
async def ping():
    return {"message": "pong"}


@app.get("/record/{record_id}")
async def record(record_id: int):
    r = dataset[record_id]
    return r


@app.get("/midi_file/{record_id}")
async def download_midi(record_id: int):
    piece = ff.MidiPiece.from_huggingface(dataset[record_id])
    piece.time_shift(-piece.df.start.min())

    midi = piece.to_midi()
    # Write the MIDI data to a BytesIO buffer
    buffer = io.BytesIO()
    midi.write(buffer)
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="audio/midi", headers={"Content-Disposition": "attachment;filename=output.midi"})


@app.get("/data")
async def get_record(exam_uid: str, position: int, dataset_name: str):
    # This is guaranteed to be unique
    r = dataset.filter(lambda r: r["position"] == position and r["exam_uid"] == exam_uid)
    r = r[0]

    return r
