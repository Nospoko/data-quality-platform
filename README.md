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

### Tests
To run tests for your Next.js application, you first need to start the application inside a Docker container. To do this, use the following command:

```sh
$ docker-compose up
```
After your application is up and running, you can start the tests by using the following command:
```sh
$ docker exec $(docker ps -qf "ancestor=web-image:latest") yarn test
```
If you want to run your tests in watch mode, you can do it by using the following command:
```sh
$ docker exec $(docker ps -qf "ancestor=web-image:latest") yarn test:dev
```

## Customizing Signal Processing
To customize the signal processing settings, you can follow these steps:

- Open the file `next\src\modules\homeChart\models\index.ts`
- In this file, you will find the `CONVERSION_FACTOR`, `SEGMENT_START`, and `SEGMENT_END` constants.
- Modify the values of these constants according to your requirements. For example, you can change the conversion factor or adjust the segment range.
- Additionally, if you want to customize the signal processing logic itself, you can open the file `next\src\modules\homeChart\utils\processSignal.ts`. In this file, you can find the implementation of the `processSignal` function.

## Customizing Chart Colors

You can easily customize the colors of Lines and labels on the charts. Additionally, you can manage the colors of the charts on both the main page and the zoom view by modifying the constants defined in the `index.ts` file.

### Changing Lines and Labels Colors

To change the colors of Lines and labels on the charts, follow these steps:

1. Open the `index.ts` file located at `data-quality-platform\next\src\modules\homeChart\models\index.ts`.

2. Look for the `LEGEND_DATA` constant in the file. It is an array of objects, where each object represents a Line on the chart.

3. To change the color of a Line, simply modify the `color` property of the corresponding object in the `LEGEND_DATA` array. You can use CSS-compatible color values such as 'red', '#00ff00', or 'rgba(0, 0, 255, 0.5)'.

4. Save the changes to the `index.ts` file.

### Managing Chart Colors on Main Page and Zoom View

To manage the colors of the charts on both the main page and the zoom view, you can customize the themes for both light mode and dark mode. The themes are defined in the same `index.ts` file.

#### Light Theme or Dark Theme

The light theme is defined under the `lightTheme` constant. The dark theme is defined under the `darkTheme` constant. It contains customizable color properties that affect the appearance of the charts in light or dark mode.

To modify the light or dark theme colors, follow these steps:

1. Open the `index.ts` file located at `data-quality-platform\next\src\modules\homeChart\models\index.ts`.

2. Locate the `lightTheme` or `darkTheme` object in the file.

3. Update the color values of the properties within the `lightTheme` or `darkTheme` object. You can change the following properties:

   - `primaryScaleColor`: The color of the primary scale on the charts.
   - `secondaryScaleColor`: The color of the secondary (in the middle) scale on the charts.
   - `gridColor`: The color of the grid lines on the charts.
   - `backgroundColorMain`: The main background color of the charts on the main page.
   - `backgroundColorZoom`: The background color of the charts on the zoom view.

4. Save the changes to the `index.ts` file.
