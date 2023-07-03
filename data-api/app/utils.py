import sqlalchemy as sa
from datasets import Dataset

from app import config as C


def prepare_database(dataset: Dataset):
    engine = sa.create_engine(C.PG_DSN)

    if C.RECORDS_TABLE in sa.inspect(engine).get_table_names():
        print("Records table already exists!")
        return

    print("Creating records table")
    columns = ["time", "label", "position", "exam_uid"]
    dataset.select_columns(columns).to_sql("records", con=engine)
