# Instructions to Set Up the Application
```
# Right now there are no additional secrets required
cp .env.example .env
docker-compose build
docker-compose up
```

1. Run the command `docker-compose build`.
2. Run the command `docker-compose up`.
3. Open `http://localhost:3000/` in your browser
4. Register a new user.
5.  Use pgAdmin or another similar tool, and in the 'users' table, set the value of the 'role' field to 'admin'. Raw query: `UPDATE users SET role='admin'::users_role_enum WHERE email='user@email.com';`
6. Refresh the page.
7. Navigate to the admin page.

   7.1.1. Go to the 'datasets' tab.

   7.1.2. Add a new dataset.
   
   7.1.3. Change the status of at least one dataset to 'active'.

   7.2.1. Go to the 'organizations' tab.

   7.2.2. Create a new organization and add users (including yourself) and one of the active datasets (IMPORTANT: only datasets marked as active are available for selection).

8. Navigate to the dashboard page.
9. Select one of the available datasets (IMPORTANT: only datasets marked as active are available for selection).
10. The application is ready to use.


# Next.js Project Structure

This structure has been developed to support various data structures, and MIDI data support is planned to be added soon.

## Structure

### `app`
Contains global settings for the project, such as styles, themes, contexts, etc.

### `components`
Contains common reusable components like buttons, layouts, etc.

### `modules`
Contains modules that the application is divided into, such as admin, dashboard, etc. Each module might include:

- `components`: Folder with components
  - `common`: Common components used for all data structures (e.g., ECG, MIDI)
  - `ecg`: Components specific to ECG data structure
  - `midi`: Components specific to MIDI data structure
- `models`: Contains types, interfaces, and constants
- `utils`: Useful utilities
- `pages`: Contains the main code for the pages used in this module

### `pages`
Standard folder for a Next.js project with routes.


# Python app

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

# Tests
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

2. In this file, you will find two constants: LEGEND_DATA_LIGHT and LEGEND_DATA_DARK. Each constant is an array of objects representing lines on the chart with customizable colors and labels.

3. To change the color of a line, locate the corresponding object in the LEGEND_DATA_LIGHT or LEGEND_DATA_DARK array and modify the color property. You can use CSS-compatible color values such as 'red', '#00ff00', or 'rgba(0, 0, 255, 0.5)'.

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

## Configuration maximum number of active datasets

To manage the number of active datasets, we've defined a maximum limit using the environment variable `NEXT_PUBLIC_MAX_ACTIVE_DATASETS`. This variable is used to ensure that the system does not exceed the specified number of active datasets at any given time.
