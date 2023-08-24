import 'focus-visible/dist/focus-visible.min.js';

import React, { useEffect, useRef } from 'react';
import { styled } from 'styled-components';

import { useTheme } from '@/app/contexts/ThemeProvider';
import { ThemeType } from '@/types/common';

declare global {
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

  useEffect(() => {
    const player: any = playerRef.current;
    const visualizer = visualizerRef.current;

    if (player && visualizer) {
      player.addVisualizer(visualizer);
    }
  }, []);

  return (
    <section>
      <PlayerWrapper color={theme}>
        <midi-player
          src="https://cdn.jsdelivr.net/gh/cifkao/html-midi-player@2b12128/twinkle_twinkle.mid"
          sound-font="https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus"
          ref={playerRef}
        />
      </PlayerWrapper>
      <VisualizerWrapper
        color={theme}
        // dangerouslySetInnerHTML={{ __html: midiVisualizer }}
      >
        <midi-visualizer
          ref={visualizerRef}
          type="piano-roll"
          src="https://cdn.jsdelivr.net/gh/cifkao/html-midi-player@2b12128/twinkle_twinkle.mid"
        />
      </VisualizerWrapper>
    </section>
  );
}

const VisualizerWrapper = styled.div`
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
    opacity: 0.6;
    stroke-width: 2;
  }
  & > midi-visualizer svg rect.note[data-instrument='0'] {
    fill: #2699ff;
    stroke: #1677ff;
  }
  & > midi-visualizer svg rect.note[data-instrument='2'] {
    fill: #2ee;
    stroke: #055;
  }
  & > midi-visualizer svg rect.note[data-is-drum='true'] {
    fill: #888;
    stroke: #888;
  }
  & > midi-visualizer svg rect.note.active {
    opacity: 0.9;
    stroke: #000;
  }
`;

const PlayerWrapper = styled.div`
  & > midi-player {
    display: block;
    width: inherit;
    margin-top: 8px;
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
