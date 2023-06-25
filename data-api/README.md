```
docker build -t qrs-tinder-api .
docker run -it -p 8080:8080 -v $PWD:/code qrs-tinder-api
curl http://0.0.0.0:8080/ping
```
