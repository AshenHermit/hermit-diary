"use client";

import { useLayerAnimation } from "@/hooks/use-animation-frame";
import { useCheckMobileScreen } from "@/lib/use-is-mobile";
import Konva from "konva";
import React from "react";
import { Stage } from "react-konva";

export type StageViewProps = React.PropsWithChildren & {
  onScroll?: (x: number, y: number) => void;
  onDrag?: (x: number, y: number) => void;
  canMoveStage?: boolean;
  dragMouseButton?: number;
  zoom?: boolean;
};

export function StageView({
  children,
  onDrag,
  onScroll: onScrollExternal,
  canMoveStage = true,
  dragMouseButton = 1,
  zoom = true,
}: StageViewProps) {
  const isMobile = useCheckMobileScreen();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<Konva.Stage>(null);

  const stageTransformTarget = React.useRef({
    x: 0,
    y: 0,
    scale: isMobile ? 0.5 : 1,
  });

  React.useEffect(() => {
    if (!stageRef.current) return;
    stageTransformTarget.current.x = stageRef.current.width() / 2;
    stageTransformTarget.current.y = stageRef.current.height() / 2;
  }, []);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current) return;
      if (!stageRef.current) return;
      if (stageTransformTarget.current) {
        stageTransformTarget.current.x +=
          (containerRef.current.clientWidth - stageRef.current.width()) / 2;
        stageTransformTarget.current.y +=
          (containerRef.current.clientHeight - stageRef.current.height()) / 2;
      }
      stageRef.current.width(containerRef.current.clientWidth);
      stageRef.current.height(containerRef.current.clientHeight);
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect(); // clean up
  }, []);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const state = { dragButtonPressed: false, lastXPos: 0, lastYPos: 0 };
    const onDown = (e: MouseEvent) => {
      if (e.button == dragMouseButton) {
        state.dragButtonPressed = true;
      }
    };
    const onUp = (e: MouseEvent) => {
      if (e.button == dragMouseButton) {
        state.dragButtonPressed = false;
      }
    };
    const drag = (movementX: number, movementY: number) => {
      if (onDrag) onDrag(movementX, movementY);
      if (canMoveStage) {
        stageTransformTarget.current.x += movementX;
        stageTransformTarget.current.y += movementY;
      }
    };
    const onMove = (e: MouseEvent) => {
      if (state.dragButtonPressed) {
        drag(e.movementX, e.movementY);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length == 0) return;
      state.dragButtonPressed = true;
      const touch = e.touches[0];
      state.lastXPos = touch.clientX;
      state.lastYPos = touch.clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      state.dragButtonPressed = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length == 0) return;
      const touch = e.touches[0];
      if (state.dragButtonPressed) {
        drag(touch.clientX - state.lastXPos, touch.clientY - state.lastYPos);
        state.lastXPos = touch.clientX;
        state.lastYPos = touch.clientY;
      }
    };

    containerRef.current.addEventListener("mousedown", onDown);
    containerRef.current.addEventListener("touchstart", onTouchStart);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);
    window.addEventListener("touchmove", onTouchMove);

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("mousedown", onDown);
        containerRef.current.removeEventListener("touchstart", onTouchStart);
      }
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  const onScroll = React.useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      const stage = e.target.getStage();
      if (onScrollExternal) onScrollExternal(e.evt.deltaX, e.evt.deltaY);

      if (!stage) return;
      if (!zoom) return;
      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();
      const scaleBy = 1.5;
      if (pointer) {
        const mousePointTo = {
          x: (pointer.x - stage.x()) / oldScale,
          y: (pointer.y - stage.y()) / oldScale,
        };

        let direction = e.evt.deltaY > 0 ? 1 : -1;
        let newScale = direction > 0 ? oldScale / scaleBy : oldScale * scaleBy;

        stageTransformTarget.current.scale = newScale;

        const newPos = {
          x: pointer.x - mousePointTo.x * newScale,
          y: pointer.y - mousePointTo.y * newScale,
        };
        stageTransformTarget.current.x = newPos.x;
        stageTransformTarget.current.y = newPos.y;
      }
    },
    [],
  );

  useLayerAnimation((frame) => {
    if (!stageRef.current) return;
    let newScale =
      stageRef.current.scale().x +
      (stageTransformTarget.current.scale - stageRef.current.scale().x) / 5;
    stageRef.current.scale({ x: newScale, y: newScale });
    let newPos = {
      x:
        stageRef.current.position().x +
        (stageTransformTarget.current.x - stageRef.current.position().x) / 5,
      y:
        stageRef.current.position().y +
        (stageTransformTarget.current.y - stageRef.current.position().y) / 5,
    };
    stageRef.current.x(0);
    stageRef.current.position(newPos);
  }, []);

  return (
    <div className="absolute left-0 top-0 h-full w-full" ref={containerRef}>
      <Stage ref={stageRef} width={500} height={500} onWheel={onScroll}>
        {children}
      </Stage>
    </div>
  );
}
