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
            "idx": idx,
            "dataset_name": dataset_name,
            "metadata": {
                "midi_filename": record["midi_filename"],
            }
        } for idx, record in enumerate(dataset)]

        meta_dataset = Dataset.from_list(metadata)
        types = {"metadata": sa.types.JSON}
        meta_dataset.to_sql("records", con=engine, index=True, if_exists="append", dtype=types)

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
        dataset_names = [{"dataset_name": dataset_name}] * dataset.num_rows
        name_dataset = Dataset.from_list(dataset_names)
        dataset = concatenate_datasets([dataset, name_dataset], axis=1)

        print("Populating records table")
        columns = ["time", "label", "position", "exam_uid", "dataset_name"]
        dataset.select_columns(columns).to_sql("records", con=engine, index=True, if_exists="append")

    return dataset
