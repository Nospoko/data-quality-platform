import os
import sqlalchemy as sa
from datasets import load_dataset, Dataset, concatenate_datasets

from app import config as C


def prepare_database(dataset_name: str) -> Dataset:
    token = os.getenv("HF_TOKEN")
    dataset = load_dataset(dataset_name, split="train[:200]", use_auth_token=token)
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
