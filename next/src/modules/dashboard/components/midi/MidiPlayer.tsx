import 'html-midi-player';

import React from 'react';
import { styled } from 'styled-components';

import { useTheme } from '@/app/contexts/ThemeProvider';
import { ThemeType } from '@/types/common';

export default function MidiPlayer() {
  const { theme } = useTheme();

  const midiVisualizer = `
    <midi-visualizer
      id="visualizer"
      type="piano-roll"
      src="https://cdn.jsdelivr.net/gh/cifkao/html-midi-player@2b12128/twinkle_twinkle.mid"
    />
  `;
  const midiPlayer = `
    <midi-player
      src="https://cdn.jsdelivr.net/gh/cifkao/html-midi-player@2b12128/twinkle_twinkle.mid"
      sound-font
      visualizer="#visualizer"
    />
  `;

  return (
    <section>
      <VisualizerWrapper
        color={theme}
        dangerouslySetInnerHTML={{ __html: midiVisualizer }}
      />
      <PlayerWrapper
        color={theme}
        dangerouslySetInnerHTML={{ __html: midiPlayer }}
      />
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
