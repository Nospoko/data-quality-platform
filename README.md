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

I've added `docker-compose-dev` - use this file if you need to make changes to the code. Next.js will compile into a dev build automatically after any changes are made to the JS (Type Script) code. This build is convenient for development, but it's about 30-40% slower than the "production" build. Therefore, if you want to get maximum performance, use:
```
$ docker-compose build 
$ docker-compose up
```
If you want the ability to change the code and see changes immediately, use:

```
$  docker-compose -f docker-compose-dev.yml  build
$  docker-compose -f docker-compose-dev.yml  up
```

For deployment, use only prod Dockerfile (not Dockerfile.dev). Note that it should receive `ARG EXTERNAL_API` to work correctly with the Python API.