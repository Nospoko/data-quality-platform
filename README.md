```
docker-compose build
docker-compose up
```

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