```
# Right now there are no additional secrets required
cp .env.example .env
docker-compose build
docker-compose up
```

Python application will populate a `records` table in the `POSTGRES_DB` database:

```sh
psql -U postgres -h db
postgres=# \c data_quality
You are now connected to database "data_quality" as user "postgres".
data_quality=# select count(*) from records;
 count
 -------
  10000
  (1 row)
```

Test the API:

```sh
$ curl http://0.0.0.0:8080/ping

{"message":"pong"}
```

```sh
$ curl http://0.0.0.0:8080/record/23

{
    "time": "2023-06-25T20:49:43.065460",
    "label": "X",
    "position": 3323843,
    "is_beat": false,
    "signal": [
        [
            40,
            39,
            59
        ],
        [
            139,
            135,
            204
        ],
        [
            229,
            222,
            337,
        ],
    ]
  ...
}
```

## Next.js app
When you run for the first time, you will need to copy the template .env.example file and add missed variables:

```sh
$ cp .env.example .env
```

For deployment, use only prod Dockerfile (not Dockerfile.dev). Note that it should receive `ARG EXTERNAL_API` to work correctly with the Python API.

## Customizing Signal Processing
To customize the signal processing settings, you can follow these steps:

- Open the file `next\src\modules\homeChart\models\index.ts`
- In this file, you will find the `CONVERSION_FACTOR`, `SEGMENT_START`, and `SEGMENT_END` constants.
- Modify the values of these constants according to your requirements. For example, you can change the conversion factor or adjust the segment range.
- Additionally, if you want to customize the signal processing logic itself, you can open the file `next\src\modules\homeChart\utils\processSignal.ts`. In this file, you can find the implementation of the `processSignal` function.
