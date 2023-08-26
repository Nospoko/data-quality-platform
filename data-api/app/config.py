import os

RECORDS_TABLE = "records"

HF_TOKEN = os.getenv("HF_TOKEN")
PG_DSN = os.getenv("DATABASE_URL")
DATASET_NAME = os.getenv("DATASET_NAME", "roszcz/qrs-swipe-demo")
DATA_PROBLEM = os.getenv("DATA_PROBLEM", "ecg_classification")
