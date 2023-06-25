FROM python:3.9.10-buster

WORKDIR /code
COPY requirements.txt /code
RUN pip install -r requirements.txt

COPY app/ /code/app

ENV PATH=/code:$PATH

ENV PYTHONUNBUFFERED=1

CMD ["uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8080"]
