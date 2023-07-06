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
When you run for the first time, you will need to copy the template .env.local file and add missed variables:

   ```sh
   $ cp next/.env.template next/api/.env.local
   ```