import sqlalchemy as sa
from datasets import load_dataset, Dataset, concatenate_datasets

from app import config as C


def prepare_midi_review(dataset_name: str) -> Dataset:
    engine = sa.create_engine(C.PG_DSN)

    query = sa.text("SELECT EXISTS(SELECT 1 FROM records WHERE dataset_name = :name)")
    with engine.connect() as c:
        res = c.execute(query, {"name": dataset_name})
        dataset_present = res.scalar()

    dataset = load_dataset(dataset_name, split="train", use_auth_token=C.HF_TOKEN)
    if dataset_present:
        print("Dataset already ingested", dataset_name)
    else:
        print("Ingesting dataset", dataset_name)
        # This is the fastest way I now to add a column to hf dataset
        # It's not pretty
        metadata = [{
            "record_id": idx,
            "dataset_name": dataset_name,
            "metadata": {
                "midi_filename": record["midi_filename"],
            }
        } for idx, record in enumerate(dataset)]

        meta_dataset = Dataset.from_list(metadata)
        types = {"metadata": sa.types.JSON}
        meta_dataset.to_sql("records", con=engine, index=False, if_exists="append", dtype=types)

    return dataset


def prepare_ecg_classification(dataset_name: str) -> Dataset:
    dataset = load_dataset(dataset_name, split="train", use_auth_token=C.HF_TOKEN)
    dataset = dataset.filter(lambda e: e['to_review'])
    engine = sa.create_engine(C.PG_DSN)

    query = sa.text("SELECT EXISTS(SELECT 1 FROM records WHERE dataset_name = :name)")
    with engine.connect() as c:
        res = c.execute(query, {"name": dataset_name})
        dataset_present = res.scalar()

    if dataset_present:
        print("Dataset already ingested", dataset_name)
    else:
        # This is the fastest way I now to add a column to hf dataset
        # It's not pretty
        metadata = [{
            "record_id": idx,
            "dataset_name": dataset_name,
            "metadata": {
                "time": record["time"].isoformat(),
                "label": record["label"],
                "position": record["position"],
                "exam_uid": record["exam_uid"],
            }
        } for idx, record in enumerate(dataset)]

        meta_dataset = Dataset.from_list(metadata)
        types = {"metadata": sa.types.JSON}
        meta_dataset.to_sql("records", con=engine, index=False, if_exists="append", dtype=types)

    return dataset
