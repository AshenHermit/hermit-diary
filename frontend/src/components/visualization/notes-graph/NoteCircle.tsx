"use client";

import { DiaryNote, getNoteProps } from "@/services/types/notes";
import Konva from "konva";
import React, { forwardRef } from "react";
import { Circle, Group, Text } from "react-konva";

export type NoteCircleProps = {
  note: DiaryNote;
  active?: boolean;
  onSelected?: (note: DiaryNote) => void;
  accentColor?: string;
  draggable?: boolean;
};
export type NoteCirlceApi = Konva.Group & {
  vx: number;
  vy: number;
  radius: number;
  disabled: boolean;
  note: DiaryNote;
  setCircleSize: (size: number) => void;
};

export const NoteCircle = forwardRef<NoteCirlceApi, NoteCircleProps>(
  (
    {
      note,
      active,
      onSelected,
      accentColor,
      draggable = true,
    }: NoteCircleProps,
    ref,
  ) => {
    const noteProps = getNoteProps(note);
    const groupRef = React.useRef<NoteCirlceApi>(null);
    const circleRef = React.useRef<Konva.Circle>(null);
    const textRef = React.useRef<Konva.Text>(null);

    const setSize = React.useCallback((size: number) => {
      if (groupRef.current) groupRef.current.radius = size;
      if (circleRef.current) circleRef.current.radius(size);
      if (textRef.current) textRef.current.y(-500 - size - 5);
    }, []);

    React.useImperativeHandle(ref, () => {
      return groupRef.current!;
    }, []);

    React.useLayoutEffect(() => {
      if (groupRef.current) {
        groupRef.current.vx = Math.random() * 2 - 1;
        groupRef.current.vy = Math.random() * 2 - 1;
        groupRef.current.radius = 1;
        groupRef.current.note = note;
        groupRef.current.disabled = false;
        groupRef.current.setCircleSize = setSize;
      }
    }, [note.id]);

    React.useEffect(() => {
      if (groupRef.current) {
        groupRef.current.note = note;
      }
    }, [note]);

    const [isHovered, setIsHovered] = React.useState(false);
    const [isPressed, setIsPressed] = React.useState(false);

    const onEnter = React.useCallback(
      (e: Konva.KonvaEventObject<PointerEvent>) => {
        const stage = e.target.getStage();
        if (stage) stage.container().style.cursor = "pointer";
        setIsHovered(true);
      },
      [],
    );
    const onLeave = React.useCallback(
      (e: Konva.KonvaEventObject<PointerEvent>) => {
        const stage = e.target.getStage();
        if (stage) stage.container().style.cursor = "default";
        setIsHovered(false);
      },
      [],
    );

    const onDown = React.useCallback(
      (e: Konva.KonvaEventObject<PointerEvent>) => {
        setIsPressed(true);
      },
      [],
    );
    React.useEffect(() => {
      function onMouseUp() {
        if (isPressed) {
          setIsPressed(false);
        }
      }
      window.addEventListener("mouseup", onMouseUp);

      return () => {
        window.removeEventListener("mouseup", onMouseUp);
      };
    });

    const onClick = React.useCallback(
      (e: Konva.KonvaEventObject<PointerEvent>) => {
        if (onSelected) onSelected(note);
      },
      [note, onSelected],
    );

    const radius = noteProps.size + (isPressed ? -3 : 0);
    if (groupRef.current) groupRef.current.radius = radius;

    const color = active
      ? accentColor
      : isHovered
        ? "#989898"
        : noteProps.color;

    return (
      <Group ref={groupRef} draggable={draggable} x={0} y={0}>
        <Text
          ref={textRef}
          x={-50}
          y={-500 - noteProps.size - 5}
          width={100}
          height={500}
          align="center"
          verticalAlign="bottom"
          text={note.name}
          fill={"white"}
          hitFunc={() => false}
        />
        <Circle
          ref={circleRef}
          x={0}
          y={0}
          radius={radius}
          fill={noteProps.circleType == "fill" ? color : undefined}
          stroke={noteProps.circleType != "fill" ? color : undefined}
          strokeWidth={noteProps.circleType != "fill" ? 6 : 0}
          dashEnabled={noteProps.circleType == "dashed"}
          dash={[10]}
          onPointerEnter={onEnter}
          onPointerLeave={onLeave}
          onPointerDown={onDown}
          onPointerClick={onClick}
        />
      </Group>
    );
  },
);
