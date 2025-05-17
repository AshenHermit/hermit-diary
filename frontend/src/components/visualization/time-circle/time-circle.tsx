"use client";

import {
  NoteCircle,
  NoteCirlceApi,
} from "@/components/visualization/notes-graph/NoteCircle";
import {
  defaultWorldSettings,
  NotesGraphWorld,
} from "@/components/visualization/notes-graph/NotesGraphWorld";
import { StageView } from "@/components/visualization/stage-view";
import { useLayerAnimation } from "@/hooks/use-animation-frame";
import { clamp } from "@/lib/math-utils";
import { DiaryNote } from "@/services/types/notes";
import Konva from "konva";
import { Context } from "konva/lib/Context";
import React, { forwardRef } from "react";
import { Layer, Shape, Stage } from "react-konva";
import { default as Simplex } from "@/lib/perlin-simple";

export type NoteCircleState = {
  viewPosition: number;
  slowViewPosition: number;
  slowViewPositionWalk: number;
  lastSelectedPosition: number;
  time: number;
  loaded: boolean;
};
export type NoteCircleStateRef = React.MutableRefObject<NoteCircleState>;
export type TimeCircleApi = {
  state: NoteCircleStateRef;
};

export type NotesCircleProps = {
  notes: DiaryNote[];
  onNoteSelected: (note: DiaryNote) => void;
  activeNoteId?: number | null;
  accentColor?: string;
  state: NoteCircleStateRef;
};

export function useTimeCircleState(notes: DiaryNote[]) {
  const dataRef = React.useRef<NoteCircleState>({
    slowViewPosition: 0,
    viewPosition: 0,
    time: 0,
    slowViewPositionWalk: 0,
    lastSelectedPosition: 0,
    loaded: false,
  });

  React.useEffect(() => {
    if (!dataRef.current.loaded) {
      let lastNotePosition = null;
      for (const note of notes) {
        if (note.properties.timePosition !== undefined) {
          if (lastNotePosition === null) {
            lastNotePosition = note.properties.timePosition;
          } else {
            if (note.properties.timePosition > lastNotePosition)
              lastNotePosition = note.properties.timePosition;
          }
        }
      }
      if (lastNotePosition !== null) {
        dataRef.current.viewPosition = lastNotePosition;
      }
    }
    if (notes.length > 0) {
      dataRef.current.loaded = true;
    }
  }, [notes]);

  return dataRef;
}
export const TimeCircle = forwardRef<TimeCircleApi, NotesCircleProps>(
  ({ notes, onNoteSelected, activeNoteId, accentColor, state }, ref) => {
    const api = React.useRef<TimeCircleApi>({
      state: state,
    });
    React.useImperativeHandle(ref, () => {
      return api.current;
    });

    const noise = React.useMemo(() => new Simplex(), []);

    const showNotes = React.useMemo(() => {
      let notesCollection = notes.filter((x) => {
        return x.properties.timePosition !== undefined;
      });
      return notesCollection;
    }, [notes]);

    React.useEffect(() => {
      state.current.time = 0;
    }, []);

    useLayerAnimation((frame) => {
      let oldViewPosition = state.current.slowViewPosition;
      state.current.slowViewPosition +=
        (state.current.viewPosition - state.current.slowViewPosition) / 10;
      state.current.slowViewPositionWalk += Math.abs(
        state.current.slowViewPosition - oldViewPosition,
      );
      state.current.time += 1;
    }, []);

    const onDrag = React.useCallback((x: number, y: number) => {
      state.current.viewPosition += x * 0.02;
    }, []);

    const nodesById = React.useRef<Record<number, NoteCirlceApi>>({});
    const getNodeById = (id: number) => {
      if (!(id in nodesById.current)) {
        return null;
      }
      return nodesById.current[id];
    };

    const processNode = React.useCallback(
      (node: NoteCirlceApi) => {
        if (!(node.note.id in nodesById.current)) {
          nodesById.current[node.note.id] = node;
        }

        let connected = false;
        let opacity = 0;
        let opacityCount = 0;
        let linked = [node.note.outcomingLinks, node.note.incomingLinks].flat();
        for (var note of linked) {
          let connectedNode = getNodeById(note.id);
          if (connectedNode && !connectedNode.disabled) {
            if (connectedNode.note.properties.timePosition !== undefined) {
              connected = true;
              opacityCount += 1;
              opacity += connectedNode.opacity();
            }
          }
        }
        if (
          connected &&
          node.note.properties.timePosition === undefined &&
          opacityCount > 0
        ) {
          opacity = opacity / opacityCount;
          node.opacity(opacity);
          if (opacity == 0) {
            node.disabled = true;
            node.hide();
          } else {
            node.disabled = false;
            node.show();
          }
        }
        if (!connected) {
          let opacity = 0;
          node.opacity(opacity);
          node.disabled = true;
          node.hide();
        }

        if (node.note.properties.timePosition === undefined) return;
        if (!state.current) return;
        const stage = node.getStage();
        if (!stage) return;
        const radius = stage.height() * 0.3;

        const viewPosition = state.current.slowViewPosition;
        const position = node.note.properties.timePosition;

        if (node.note.id == activeNoteId) {
          if (state.current.lastSelectedPosition != position) {
            state.current.viewPosition = position;
            state.current.lastSelectedPosition = position;
          }
        }

        let angle = postPositionToAngle(position);
        var positionDifference = viewPosition - position;
        if (Math.abs(positionDifference) > 5) {
          node.disabled = true;
          node.opacity(0);
          node.hide();
          return;
        }

        positionDifference = Math.pow(viewPosition - position, 2);
        let alpha = clamp(1 - Math.abs(positionDifference) / 10, 0, 1);
        node.opacity(alpha);
        if (alpha <= 0) {
          node.disabled = true;
          node.opacity(0);
          node.hide();
        }
        node.disabled = false;
        node.visible(true);
        node.listening(true);
        node.show();

        var centerDistanceOffset = 1 + positionDifference / 40;
        var noise1 = noise.noise(
          position / 3,
          state.current.time / 500 + state.current.slowViewPositionWalk / 5,
        );
        noise1 *= 0.06 * (positionDifference / 5 + 0.2);
        var noise2 = noise.noise(
          position / 3,
          -state.current.time / 500 - state.current.slowViewPositionWalk / 5,
        );
        noise2 *= 0.1 * (positionDifference / 5 + 0.2);
        centerDistanceOffset = centerDistanceOffset + noise1;

        var x = Math.cos(angle + noise2) * radius * centerDistanceOffset;
        var y = Math.sin(angle + noise2) * radius * centerDistanceOffset;

        node.x(x);
        node.y(y);
      },
      [activeNoteId],
    );

    const handleNoteSelection = (note: DiaryNote) => {
      onNoteSelected(note);
      if (note.properties.timePosition !== undefined) {
        state.current.viewPosition = note.properties.timePosition;
      }
    };

    React.useEffect(() => {
      let noteSearch = showNotes.filter((x) => x.id == activeNoteId);
      if (noteSearch.length > 0) {
        let note = noteSearch[0];
        if (note.properties.timePosition !== undefined) {
          state.current.viewPosition = note.properties.timePosition;
        }
      }
    }, [activeNoteId, showNotes]);

    return (
      <StageView
        canMoveStage={false}
        dragMouseButton={0}
        onDrag={onDrag}
        zoom={false}
      >
        <Layer>
          <MonthsArc data={state} />
          <CursorLine data={state} />
          <NotesGraphWorld
            worldSettings={{
              ...defaultWorldSettings,
              attractionStrength: -0.2,
              linkStrength: 0.02,
              linkDistance: 10,
            }}
            processNote={processNode}
            updateDeps={notes}
          >
            {notes
              .map((note) => {
                return [
                  <NoteCircle
                    key={note.id}
                    note={note}
                    accentColor={accentColor}
                    active={note.id == activeNoteId}
                    onSelected={handleNoteSelection}
                    draggable={false}
                  />,
                ];
              })
              .flat(1)}
          </NotesGraphWorld>
        </Layer>
      </StageView>
    );
  },
);

function postPositionToAngle(position: number) {
  var angle_offset = ((2 * Math.PI) / 12) * 2.5;
  var angle = (position / 12) * 2 * Math.PI;
  angle += angle_offset;
  return angle;
}

function MonthsArc({ data }: { data: NoteCircleStateRef }) {
  const sceneFunc = React.useCallback((ctx: Context, shape: Konva.Shape) => {
    if (!data.current) return;
    const stage = shape.getStage();
    if (!stage) return;
    const radius = stage.height() * 0.3;

    for (let i = 0; i < 12; i++) {
      var month_angle = (2 * Math.PI) / 12;
      var angle_offset = (2 * Math.PI) / 12 / 2;
      var scale = 1;

      var viewPosFract = data.current.slowViewPosition / 12;
      viewPosFract = viewPosFract - Math.floor(viewPosFract);
      viewPosFract = viewPosFract * 2 * Math.PI - month_angle * 1.5;
      var sinRes = Math.sin(viewPosFract - i * month_angle);
      scale = 1 + (sinRes + 1) / 10;
      ctx.globalAlpha = 1 - (sinRes / 2 + 0.5);
      ctx.lineWidth = 8 * Math.pow(scale, 10);

      // this.ctx.strokeStyle = i%2 == 0 ? "#353535" : "#3f3f3f"
      ctx.strokeStyle = "#353535";
      ctx.beginPath();
      ctx.arc(
        0,
        0,
        radius * scale,
        angle_offset + i * month_angle,
        angle_offset + i * month_angle + month_angle * 0.95,
      );
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    }
  }, []);

  return <Shape sceneFunc={sceneFunc}></Shape>;
}

function CursorLine({ data }: { data: NoteCircleStateRef }) {
  const sceneFunc = React.useCallback((ctx: Context, shape: Konva.Shape) => {
    if (!data.current) return;
    const stage = shape.getStage();
    if (!stage) return;
    const radius = stage.height() * 0.3;

    var angle = postPositionToAngle(data.current.slowViewPosition);

    var x = Math.cos(angle);
    var y = Math.sin(angle);

    ctx.lineWidth = 5;
    ctx.strokeStyle = "#fff";
    ctx.globalAlpha = 0.1;
    ctx.beginPath();
    ctx.moveTo(x * (radius * 0.5), y * (radius * 0.5));
    ctx.lineTo(x * (radius * 0.8), y * (radius * 0.8));
    ctx.stroke();
    ctx.globalAlpha = 1;
  }, []);

  return <Shape sceneFunc={sceneFunc}></Shape>;
}
