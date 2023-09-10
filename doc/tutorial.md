# Adding a New Data Problem to the Platform

Welcome to this tutorial on how to seamlessly integrate a new data problem into the platform. We assume you possess a fundamental grasp of programming concepts.

---

## Step 1: Installing the Project

Ensure you've accomplished the project installation as guided in the `README.md` file. This setup is pivotal in creating the necessary environment for your work.

## Step 2: Introducing the New Data Problem

1. Open your chosen code editor and navigate to the root directory of the project.

2. Within the `next` directory, locate and open the `src/pages/_app.tsx` file.

3. Inside this file, a key array named `ALLOWED_DATA_PROBLEMS` is present, encapsulating the list of currently permitted data problems:

   ```tsx
   const ALLOWED_DATA_PROBLEMS = ['data_problem_1', 'data_problem_2'];
   ```

4. To elegantly incorporate your new data problem, add its identifier within this array:

   ```tsx
   const ALLOWED_DATA_PROBLEMS = [
     'data_problem_1',
     'data_problem_2',
     'new_data_problem',
   ];
   ```

## Step 3: Defining the Data Problem in Environment Files

Given your reliance on Docker within the project, supplementary steps are indispensable to ensure your new data problem is recognized accurately:

1. Commence by building the Docker containers via the following command:

   ```shell
   docker-compose build
   ```

   This pivotal step guarantees that all amendments, including your fresh data problem, are seamlessly integrated into the project.

2. Once container building concludes, launch the project while specifying the data problem identifier:

   ```shell
   DATA_PROBLEM=new_data_problem docker-compose up
   ```

   Please ensure that `new_data_problem` is accurately replaced with the actual identifier of your recently added data problem.

3. It's imperative to verify that the `DATA_PROBLEM` value matches an entry within the `ALLOWED_DATA_PROBLEMS` array you defined earlier. This ensures accurate recognition and integration of your new data problem within the platform.

By diligently adhering to these steps, you'll be able to build and run the project, with your new data problem seamlessly incorporated within the Docker environment. This meticulous process guarantees accurate reflections of your changes, ensuring the platform functions optimally.

## Step 4: Further Guidelines and Recommendations

At this point, you've effectively integrated the new data problem into the platform. Depending on the intricacy of your project, additional steps might be necessary. These could encompass defining the data problem's structure, crafting suitable UI components, configuring data pipelines, and interacting with API endpoints.

---

# New Data Problem Workflow

## Developing New Visualization Components

1. Navigate to `next/src/modules`. Here you can see folders containing different components for pages. As you want to create a new data visualization component, navigate to the `dashboard` directory.
2. In the `dashboard` directory, you can create a folder for your data problem components. **Adopt a lucid naming convention and organize everything in folders!**
3. Also, in the `dashboard` directory, you can view the `common` folder. This folder contains universal components for data visualization, and if you think you've created one that can be shared between several data problems, please add it here.

After you've created a data visualization component, you need to add it to the pages. We have `history` and `dashboard` pages that require data visualization.

4. Navigate to `next/src/modules/dashboard/pages`. Here you can see two page components you need: `DashboardPage.tsx` and `HistoryPage.tsx`.
5. You want to conditionally render your component depending on the `DATA_PROBLEM` environmental variable. You can achieve it by doing something like this:

   ```tsx
   <WrapperComponent>
     {/* Conditionally render the list of visualized data records */}
     {DATA_PROBLEM === 'new_data_problem' &&
       data.map((record) => (
         <MyVisualizationComponent key={record.id} data={record.data} />
       ))}
   </WrapperComponent>
   ```

**Do not forget to type the data you are working with!**

## Working with API Endpoints

Data for your data problem must be fetched from some place. For fetching it, you can call different API endpoints that already exist (view `next/pages/api` and `next/services/reactQueryFn.ts`) or you can create a new one:

1. Navigate to `next/src/pages/api` and create a new folder for your API endpoint. See [Next.js API routing docs](https://nextjs.org/docs/pages/building-your-application/routing/api-routes).
2. Since our platform uses `next-connect`, you can easily create a router for your API endpoint for simplifying the development process.

**API endpoint example:**

```ts
// next/src/pages/api/ping/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  res.status(200).json({ message: 'pong' });
});

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({ error: err.message });
  },
});
```

3. After creating an API endpoint, consider creating a query function in `next/services/reactQueryFn.ts`.

**Query function example:**

```ts
export const getPong = async (): Promise<{ message: 'pong' }> => {
  const { data } = await axiosApi.get<{ message: 'pong' }>(`/api/ping`);
  return data;
};
```

## Documenting Your Progress

As you advance, remember to document your modifications utilizing markdown formatting. This practice ensures lucidity and comprehension, benefiting both yourself and collaborators engaged in the project.

**Following this workflow will ensure a harmonious integration of your new data problem into the platform.**

---

# Implementation of Real Data Problem: MIDI Review

In this section, we'll delve into the implementation details of addressing a real data problem through the context of MIDI review. We'll outline the steps taken to enhance our Next.js app and adapt the platform to our specific requirements.

## Data Visualization Component

To facilitate our MIDI review functionality, we've created a set of components within the `next/src/modules/dashboard/components` directory. These components collectively empower us to gather user feedback, visualize MIDI files, and present data insights on various app pages.

Begin by navigating to the `next/src/modules/dashboard/components` directory and establishing a new folder named `midi`. Within this folder, we're crafting three crucial components:

### Feedback.tsx

This component is pivotal in soliciting user feedback for individual data records, specifically MIDI samples.

1. React Component

Create a React component that forms the foundation of our feedback collection.

```tsx
export default function Feedback() {
  return <div>Feedback</div>;
}
```

2. Component Props Typing

Define the component's props and establish their types. We require a `handleFeedback` function for managing feedback on both the `Dashboard` and `History` pages, alongside a `historyData` parameter for displaying user feedback on the latter.

```tsx
type Props = {
  handleFeedback: (midiFeedback: MidiFeedback) => void;
  historyData?: HistoryData;
};

export default function Feedback({ handleFeedback, historyData }: Props) {
  return <div>Feedback</div>;
}
```

3. Component State

Construct a state mechanism to store user feedback before transmitting it to the database on the `Dashboard` page. Furthermore, this state is populated with existing `historyData` on the `History` page.

```tsx
const [rate, setRate] = React.useState<{
  rhythm: number;
  quality: number;
}>({
  rhythm: historyData ? historyData.score1 : 0,
  quality: historyData ? historyData.score2 : 0,
});
const [commentValue, setCommentValue] = React.useState(
  historyData ? historyData.comment : ''
);
```

4. JSX Structure

Implement the JSX structure that defines the component's visual elements. To streamline development, we can leverage libraries such as `antd` and `styled-components`. The refined component appears as follows.

```tsx
const desc = ['Terrible', 'Bad', 'Average', 'Good', 'Wonderful'];

type Props = {
  handleFeedback: (midiFeedback: MidiFeedback) => void;
  historyData?: HistoryData;
};

export default function Feedback({ handleFeedback, historyData }: Props) {
  const [rate, setRate] = React.useState<{
    rhythm: number;
    quality: number;
  }>({
    rhythm: historyData ? historyData.score1 : 0,
    quality: historyData ? historyData.score2 : 0,
  });
  const [commentValue, setCommentValue] = React.useState(
    historyData ? historyData.comment : ''
  );

  return (
    <RateContainer>
      {/* Comment Input */}
      <label style={{ flexGrow: 1 }}>
        <Typography.Text>Comment</Typography.Text>
        <Input
          style={{ width: 'full' }}
          placeholder="Enter your comment here..."
          value={commentValue}
          onChange={(e) => setCommentValue(e.target.value)}
        />
      </label>
      {/* Rhythm Rating */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Typography.Text>Rhythm</Typography.Text>
        <Rate
          tooltips={desc}
          onChange={(n) => setRate({ ...rate, rhythm: n })}
          value={rate?.rhythm}
        />
      </div>
      {/* Quality Rating */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Typography.Text>Quality</Typography.Text>
        <Rate
          tooltips={desc}
          onChange={(n) => setRate({ ...rate, quality: n })}
          value={rate?.quality}
        />
      </div>
      {/* Submission Button */}
      <Button
        onClick={() => {
          const midiFeedback: MidiFeedback = {
            comment: commentValue ? commentValue : undefined,
            rhythm: rate?.rhythm,
            quality: rate?.quality,
          };
          handleFeedback(midiFeedback);
        }}
        disabled={!rate?.quality || !rate?.rhythm}
        type="primary"
      >
        {historyData ? 'Update' : 'Submit'}
      </Button>
    </RateContainer>
  );
}

const RateContainer = styled.div`
  display: flex;
  margin-top: 4px;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
`;
```

### MidiPlayer.tsx

Component responsible for playing and visualizing MIDI records. Uses `html-midi-player` library, that has no native React support so this component seems to be more complicated than it is.

1. JSX Intrinsic Elements

We declare JSX intrinsic elements for MIDI visualization, allowing seamless integration of HTML tags like `<midi-player>` and `<midi-visualizer>`.

```tsx
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'midi-player': any;
      'midi-visualizer': any;
    }
  }
}
```

2. Importing Dependencies and Theme

Conditional imports ensure that the necessary libraries are included in the browser environment. We also fetch the current theme using the `useTheme()` hook.

```tsx
export default function MidiPlayer() {
  // Import necessary libraries only in the browser environment
  if (typeof window !== 'undefined') {
    require('tone/build/Tone.js');
    require('@magenta/music/es6/core.js');
    require('html-midi-player');
  }

  // Fetch the current theme from our app's styling
  const { theme } = useTheme();

  // ...
}
```

3. Initializing Refs and State

We initialize `useRef` hooks to create references to the player and visualizer components. The `finished` state is used to track the completion of MIDI playback.

```tsx
export default function MidiPlayer() {
  const playerRef = useRef(null);
  const visualizerRef = useRef(null);
  const [finished, setFinished] = React.useState(false);

  // ...
}
```

4. Handling Finished Playback

We use a `useEffect` hook to reset the player and visualizer when playback finishes.

```tsx
useEffect(() => {
  const player: any = playerRef.current;
  const visualizer: any = visualizerRef.current;

  if (finished && player && visualizer) {
    player.currentTime = 0;
    visualizer.childNodes[0].scrollTo(0, 0);
    setFinished(false);
  }
}, [finished]);
```

5. Setting Up Player and Visualizer

Another `useEffect` hook is employed to set up the player and its associated visualizer upon component mounting. It also includes event listeners for playback events.

```tsx
useEffect(() => {
  const player: any = playerRef.current;
  const visualizer: any = visualizerRef.current;

  const detectFinish = (e: { detail: { finished: boolean } }) => {
    setFinished(e.detail.finished);
  };

  if (player && visualizer) {
    player.addEventListener('stop', detectFinish);

    const blockWidth = visualizer.getBoundingClientRect().width - 4 * 2;
    const x = blockWidth / 16;
    visualizer.config = { pixelsPerTimeStep: x < 20 ? 40 : x * 2 };

    player.addVisualizer(visualizer);
  }

  return () => {
    player.removeVisualizer(visualizer);
    player.removeEventListener('stop', detectFinish);
  };
}, []);
```

6. JSX Structure

The JSX structure incorporates the MIDI player and visualizer components. URLs for MIDI sources and sound fonts are hardcoded for now.

```tsx
export default function MidiPlayer() {
  return (
    <section>
      {/* Midi Player */}
      <PlayerWrapper color={theme}>
        <midi-player
          src="https://cdn.jsdelivr.net/gh/cifkao/html-midi-player@2b12128/jazz.mid"
          sound-font="https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus"
          ref={playerRef}
        />
      </PlayerWrapper>
      {/* Midi Visualizer */}
      <VisualizerWrapper color={theme}>
        <midi-visualizer
          ref={visualizerRef}
          type="piano-roll"
          src="https://cdn.jsdelivr.net/gh/cifkao/html-midi-player@2b12128/jazz.mid"
        />
      </VisualizerWrapper>
    </section>
  );
}
```

7. Styled Components

Styled components `PlayerWrapper` and `VisualizerWrapper` handle the visual presentation of the player and visualizer, including theme-dependent styling.

```tsx
const VisualizerWrapper = styled.div`
  /* ... (styling details) */
`;

const PlayerWrapper = styled.div`
  /* ... (styling details) */
`;
```

Final component looks like this:

```tsx
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'midi-player': any;
      'midi-visualizer': any;
    }
  }
}

export default function MidiPlayer() {
  if (typeof window !== 'undefined') {
    require('tone/build/Tone.js');
    require('@magenta/music/es6/core.js');
    require('html-midi-player');
  }

  const { theme } = useTheme();

  const playerRef = useRef(null);
  const visualizerRef = useRef(null);

  const [finished, setFinished] = React.useState(false);

  useEffect(() => {
    const player: any = playerRef.current;
    const visualizer: any = visualizerRef.current;
    if (finished && player && visualizer) {
      player.currentTime = 0;
      visualizer.childNodes[0].scrollTo(0, 0);

      setFinished(false);
    }
  }, [finished]);

  useEffect(() => {
    const player: any = playerRef.current;
    const visualizer: any = visualizerRef.current;
    const detectFinish = (e: { detail: { finished: boolean } }) => {
      setFinished(e.detail.finished);
    };

    if (player && visualizer) {
      player.addEventListener('stop', detectFinish);

      const blockWidth = visualizer.getBoundingClientRect().width - 4 * 2;
      const x = blockWidth / 16;
      visualizer.config = { pixelsPerTimeStep: x < 20 ? 40 : x * 2 };

      player.addVisualizer(visualizer);
    }

    return () => {
      player.removeVisualizer(visualizer);
      player.removeEventListener('stop', detectFinish);
    };
  }, []);

  return (
    <section>
      <PlayerWrapper color={theme}>
        <midi-player
          src="https://cdn.jsdelivr.net/gh/cifkao/html-midi-player@2b12128/jazz.mid"
          sound-font="https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus"
          ref={playerRef}
        />
      </PlayerWrapper>
      <VisualizerWrapper color={theme}>
        <midi-visualizer
          ref={visualizerRef}
          type="piano-roll"
          src="https://cdn.jsdelivr.net/gh/cifkao/html-midi-player@2b12128/jazz.mid"
        />
      </VisualizerWrapper>
    </section>
  );
}

const VisualizerWrapper = styled.div`
  overflow-x: auto;
  & > midi-visualizer .piano-roll-visualizer {
    background-color: ${(props) =>
      props.color === ThemeType.DARK ? '#282828' : '#fff'};
    padding: 4px;
    border: 1px solid ${(props) =>
        props.color === ThemeType.DARK ? '#565656' : '#d9d9d9'};
    border-radius: 10px;
    overflow: auto;
  }
  & > midi-visualizer svg rect.note {
    opacity: ${(props) => (props.color === ThemeType.DARK ? 0.4 : 0.7)};
    stroke-width: 0;
  }
  & > midi-visualizer svg rect.note[data-instrument='0'] {
    fill: ${(props) =>
      props.color === ThemeType.DARK ? '#2699ff' : '#074192'};
    /* stroke: #1677ff; */
  }
  & > midi-visualizer svg rect.note[data-instrument='2'] {
    fill: ${(props) =>
      props.color === ThemeType.DARK ? '#e430cc' : '#7e106f'};
    /* stroke: #055; */
  }
  & > midi-visualizer svg rect.note[data-is-drum='true'] {
    fill: ${(props) => (props.color === ThemeType.DARK ? '#888' : '#535353')};
    /* stroke: #888; */
  }
  & > midi-visualizer svg rect.note.active {
    opacity: 1;
  }
`;

const PlayerWrapper = styled.div`
  & > midi-player {
    display: block;
    width: inherit;
    margin-bottom: 8px;
  }
  & > midi-player::part(control-panel) {
    border: 1px solid ${(props) =>
        props.color === ThemeType.DARK ? '#565656' : '#d9d9d9'};
    background-color: ${(props) =>
      props.color === ThemeType.DARK ? '#282828' : '#fff'};
    border-radius: 10px;
  }
  & > midi-player::part(play-button) {
    color: #fff;
    background-color: #1677ff;
    border-radius: 20px;
    transition: all 0.2s;
    content: '';
  }
  & > midi-player::part(play-button):hover {
    background-color: #2699ff;
  }
  & > midi-player::part(time) {
    color: ${(props) => (props.color === ThemeType.DARK ? '#fff' : '#000')};
  }
`;
```

### MidiChart.tsx

Main data visualization component that will be displayed on `History` and `Dashboard` pages.

1. Component Props

The `MidiChart` component accepts several props that provide essential information and functions for its functionality.

```tsx
type Props = {
  record: Record;
  addFeedbackMidi: (midiFeedback: MidiFeedback & { id: string }) => void;
  historyData?: HistoryData;
};

export default function MidiChart({
  record,
  addFeedbackMidi,
  historyData,
}: Props) {
  // ...
}
```

2. Fetching Theme

We fetch the current theme using the `useTheme()` hook to ensure visual consistency within the component.

```tsx
export default function MidiChart({
  record,
  addFeedbackMidi,
  historyData,
}: Props) {
  const { theme } = useTheme();

  // ...
}
```

3. Handling Feedback

The `handleFeedback` function is defined to manage the submission of user feedback. Depending on whether there's existing `historyData`, appropriate feedback handling is performed.

```tsx
export default function MidiChart({
  record,
  addFeedbackMidi,
  historyData,
}: Props) {
  const handleFeedback = (midiFeedback: MidiFeedback) => {
    if (historyData) {
      addFeedbackMidi({
        ...midiFeedback,
        id: historyData.id,
      });

      return;
    }
    addFeedbackMidi({ id: record.id, ...midiFeedback });
  };

  // ...
}
```

4. JSX Structure

The JSX structure of the `MidiChart` component incorporates the `MidiPlayer` component for playback and the `Feedback` component for collecting user feedback.

```tsx
export default function MidiChart({
  record,
  addFeedbackMidi,
  historyData,
}: Props) {
  return (
    <Wrapper color={theme}>
      <MidiPlayer />
      <Feedback historyData={historyData} handleFeedback={handleFeedback} />
    </Wrapper>
  );
}
```

5. Styling Wrapper

The `Wrapper` styled component defines the outer appearance of the `MidiChart` component, including borders, padding, and margin.

```tsx
const Wrapper = styled.div`
  border: 1px solid ${(props) =>
      props.color === ThemeType.DARK ? '#fff' : '#000'};
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 40px;
`;
```

Final component looks like this:

```tsx
type Props = {
  record: Record;
  addFeedbackMidi: (midiFeedback: MidiFeedback & { id: string }) => void;
  historyData?: HistoryData;
};

export default function MidiChart({
  record,
  addFeedbackMidi,
  historyData,
}: Props) {
  const { theme } = useTheme();

  const handleFeedback = (midiFeedback: MidiFeedback) => {
    if (historyData) {
      addFeedbackMidi({
        ...midiFeedback,
        id: historyData.id,
      });

      return;
    }
    addFeedbackMidi({ id: record.id, ...midiFeedback });
  };

  return (
    <Wrapper color={theme}>
      <MidiPlayer />
      <Feedback historyData={historyData} handleFeedback={handleFeedback} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  border: 1px solid ${(props) =>
      props.color === ThemeType.DARK ? '#fff' : '#000'};
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 40px;
`;
```

## Fetching the Required Data

All endpoints already exist, so we only need to create query functions for solving our data problem (if you need to create a new API endpoint, refer to [this](#working-with-api-endpoints)).

Navigate to `next/src/services` and open the `reactQueryFn.ts` file.

Here, we have created a function to send feedback to an API endpoint, which validates it and saves it to the database:

```ts
export const sendFeedback = async ({
  id,
  comment,
  rhythm,
  quality,
}: {
  id: string;
} & MidiFeedback): Promise<RecordsResponse> => {
  const response = await axios.post('/api/data-check', {
    id,
    comment,
    rhythm,
    quality,
  });

  return response.data;
};
```

Note: The `axios` library is installed on the platform to simplify working with the API.

We have also created a function to allow the user to change feedback on the `History` page:

```ts
export const changeMidiFeedback = async ({
  dataCheckId,
  comment,
  rhythm,
  quality,
}: {
  dataCheckId: string;
  comment: string;
  rhythm: number;
  quality: number;
}): Promise<RecordsResponse> => {
  const response = await axios.patch('/api/data-check', {
    dataCheckId,
    rhythm,
    quality,
    comment,
  });

  return response.data;
};
```

The queries for fetching data from the database already exist, so we do not need to add them.

## Rendering the Created Data Visualization Component

To render the component, navigate to `next/src/modules/dashboard/pages`. Here you'll find two necessary files: `DashboardPage.tsx` and `HistoryPage.tsx`.

### Adding the Component to the Dashboard Page

In the `DashboardPage.tsx` file, we have created functions to pass to the `MidiChart` component based on our query functions.

To conditionally render our component based on the `DATA_PROBLEM` environment variable:

```tsx
{
  DATA_PROBLEM === 'midi_review' &&
    recordsToDisplay &&
    recordsToDisplay.map((record) => (
      <MidiChart
        key={record.index}
        record={record}
        addFeedbackMidi={addFeedbackMidi}
      />
    ));
}
```

It's as simple as that!

Adding the component to the `History` page follows a similar approach, except we need to pass history data to it:

```tsx
{
  DATA_PROBLEM === 'midi_review' &&
    recordsToDisplay &&
    recordsToDisplay.map((history) => (
      <MidiChart
        key={history.record.id}
        record={history.record}
        addFeedbackMidi={changeFeedbackForMidi}
        historyData={history}
      />
    ));
}
```

**And now we have a fully functional MIDI review data problem implementation!**
