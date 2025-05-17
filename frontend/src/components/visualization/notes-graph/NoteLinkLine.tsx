"use client";

import { NoteCirlceApi } from "@/components/visualization/notes-graph/NoteCircle";
import { normalizeVector } from "@/lib/math-utils";
import { DiaryNote } from "@/services/types/notes";
import Konva from "konva";
import React, { forwardRef } from "react";
import { Circle, Group, Line, Text } from "react-konva";

export type NoteLinkProps = {
  from: NoteCirlceApi;
  to: NoteCirlceApi;
};
export type NoteLinkApi = Konva.Line & {};

export const NoteLinkLine = ({ from, to }: NoteLinkProps) => {
  const lineRef = React.useRef<Konva.Line>(null);
  const maxOpacity = 0.2;

  React.useEffect(() => {
    let animatingState = { animating: true };
    const animate = () => {
      if (lineRef.current) {
        let dir = normalizeVector([to.x() - from.x(), to.y() - from.y()]);
        lineRef.current.points([
          from.x() + dir[0] * from.radius,
          from.y() + dir[1] * from.radius,
          to.x() - dir[0] * to.radius,
          to.y() - dir[1] * to.radius,
        ]);
        let opacity = (from.opacity() + to.opacity()) / 2;
        if (from.disabled || to.disabled) opacity = 0;
        lineRef.current.opacity(opacity * maxOpacity);
      }
      if (animatingState.animating) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    return () => {
      animatingState.animating = false;
    };
  }, [from, to]);

  return (
    <Line ref={lineRef} strokeWidth={3} stroke={"#fff"} opacity={maxOpacity} />
  );
};
