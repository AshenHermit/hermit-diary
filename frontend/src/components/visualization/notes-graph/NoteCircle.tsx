"use client";

import { clamp, mod } from "@/lib/math-utils";
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
  titleType?: "default" | "vertical";
  isExternal?: boolean;
};
export type NoteCirlceApi = Konva.Group & {
  vx: number;
  vy: number;
  radius: number;
  disabled: boolean;
  note: DiaryNote;
  setCircleSize: (size: number) => void;
  setCircleRotation: (rotation: number) => void;
};

export const NoteCircle = forwardRef<NoteCirlceApi, NoteCircleProps>(
  (
    {
      note,
      active,
      onSelected,
      accentColor,
      draggable = true,
      titleType = "default",
      isExternal = false,
    }: NoteCircleProps,
    ref,
  ) => {
    const noteProps = getNoteProps(note);
    const groupRef = React.useRef<NoteCirlceApi>(null);
    const circleRef = React.useRef<Konva.Circle>(null);
    const textRef = React.useRef<Konva.Text>(null);
    const [textReverse, setTextReverse] = React.useState(false);

    const updateText = React.useCallback((textReverse: boolean) => {
      if (groupRef.current) {
        const size = groupRef.current.radius;
        if (textRef.current && titleType == "default")
          textRef.current.y(-500 - size - 5);
        if (textRef.current && titleType == "vertical") {
          textRef.current.x(size + 10);
          if (textReverse) {
            textRef.current.x(-500 - 10 - size);
          }
        }
      }
    }, []);

    const setSize = React.useCallback(
      (size: number) => {
        if (groupRef.current) groupRef.current.radius = size;
        if (circleRef.current) circleRef.current.radius(size);
        updateText(textReverse);
      },
      [textReverse],
    );

    const setRotation = React.useCallback((rotation: number) => {
      if (groupRef.current) {
        if (rotation >= 90 || rotation <= -90) {
          groupRef.current.rotation(rotation - 180);
          setTextReverse(true);
          updateText(true);
        } else if (rotation < 90 && rotation > -90) {
          groupRef.current.rotation(rotation);
          setTextReverse(false);
          updateText(false);
        }
      }
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
        groupRef.current.setCircleRotation = setRotation;
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

    let noteTitle = note.name;
    if (!note.isPublic) noteTitle = "⭕ " + noteTitle;

    return (
      <Group
        ref={groupRef}
        draggable={draggable}
        x={0}
        y={0}
        opacity={isExternal ? 0.5 : 1}
      >
        {titleType == "default" ? (
          <Text
            ref={textRef}
            x={-50}
            y={-500 - noteProps.size - 5}
            width={100}
            height={500}
            align={"center"}
            verticalAlign={"bottom"}
            text={noteTitle}
            fill={"white"}
            hitFunc={() => false}
          />
        ) : null}
        {titleType == "vertical" ? (
          <Text
            ref={textRef}
            x={noteProps.size + 10}
            y={-6}
            width={500}
            height={100}
            rotation={0}
            align={textReverse ? "right" : "left"}
            verticalAlign={"center"}
            text={noteTitle}
            fill={color}
            fontSize={15}
            fontFamily="monospace"
            fontStyle="bold"
            hitFunc={() => false}
          />
        ) : null}
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
