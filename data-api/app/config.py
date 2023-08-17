import os

RECORDS_TABLE = "records"

PG_DSN = os.getenv("DATABASE_URL")
DATASET_NAME = os.getenv("DATASET_NAME", "roszcz/qrs-swipe-demo")
