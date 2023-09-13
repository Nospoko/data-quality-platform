import 'focus-visible/dist/focus-visible.min.js';

import React, { memo, useEffect, useRef } from 'react';
import { styled } from 'styled-components';

import { useTheme } from '@/app/contexts/ThemeProvider';
import { ThemeType } from '@/types/common';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'midi-player': any;
      'midi-visualizer': any;
    }
  }
}

type Props = {
  recordId: string;
};

function MidiPlayer({ recordId }: Props) {
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

  console.log('RERENER', recordId);

  return (
    <section>
      <PlayerWrapper color={theme}>
        <midi-player
          src={`${process.env.NEXT_PUBLIC_API_URL}/midi_file/${recordId}`}
          sound-font="https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus"
          ref={playerRef}
        />
      </PlayerWrapper>
      <VisualizerWrapper color={theme}>
        <midi-visualizer
          ref={visualizerRef}
          type="piano-roll"
          src={`${process.env.NEXT_PUBLIC_API_URL}/midi_file/${recordId}`}
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
    border: 1px solid
      ${(props) => (props.color === ThemeType.DARK ? '#565656' : '#d9d9d9')};
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
    border: 1px solid
      ${(props) => (props.color === ThemeType.DARK ? '#565656' : '#d9d9d9')};
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

export default memo(MidiPlayer);
