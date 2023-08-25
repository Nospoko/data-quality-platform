**To switch between feedback modes,** simply change the value of the `DATA_PROBLEM` variable from `ecg_classification` to `midi_review`.


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

## Player

- I have added the commits with the player to this PR since it uses the developments from this branch and is a logical continuation.
-  At the current stage, a mocked melody is being used; to change it, you need to modify 2 "src" attributes in the MidiPlayer file. [src1](https://github.com/Nospoko/data-quality-platform/blob/qrs-34/add-score/next/src/modules/dashboard/components/midi/MidiPlayer.tsx#L51), [src2](https://github.com/Nospoko/data-quality-platform/blob/qrs-34/add-score/next/src/modules/dashboard/components/midi/MidiPlayer.tsx#L60)
- There are also some minor issues still present that I continue to work on. For example, after the playback of a long melody ends, the visualizer does not return to the beginning. If the user starts playback again, I am working on this and plan to fix it in the near future.

**To run app in midi mode** you should run command `DATA_PROBLEM=midi_review docker compose up`

