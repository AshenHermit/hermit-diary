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
      e.preventDefault();
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
      e.preventDefault();
      const touch = e.touches[0];
      if (state.dragButtonPressed) {
        if (onDrag)
          onDrag(
            touch.clientX - state.lastXPos,
            touch.clientY - state.lastYPos,
          );
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

  const [stagePos, setStagePos] = React.useState({ x: 0, y: 0 });
  const [stageScale, setStageScale] = React.useState({ x: 1, y: 1 });
  const [lastCenter, setLastCenter] = React.useState<Konva.Vector2d | null>(
    null,
  );
  const [lastDist, setLastDist] = React.useState(0);
  const [dragStopped, setDragStopped] = React.useState(false);

  const getDistance = (p1: Konva.Vector2d, p2: Konva.Vector2d) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  const getCenter = (
    p1: Konva.Vector2d,
    p2: Konva.Vector2d,
  ): Konva.Vector2d => {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    } as Konva.Vector2d;
  };

  const onKonvaTouchMove = React.useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      e.evt.preventDefault();
      const touch1 = e.evt.touches[0];
      const touch2 = e.evt.touches[1];
      const stage = e.target.getStage();

      if (!stage) return;
      if (!zoom) return;

      // we need to restore dragging, if it was cancelled by multi-touch
      if (touch1 && !touch2 && !stage.isDragging() && dragStopped) {
        stage.startDrag();
        setDragStopped(false);
      }

      if (touch1 && touch2) {
        // if the stage was under Konva's drag&drop
        // we need to stop it, and implement our own pan logic with two pointers
        if (stage.isDragging()) {
          stage.stopDrag();
          setDragStopped(true);
        }

        const p1 = {
          x: touch1.clientX,
          y: touch1.clientY,
        };
        const p2 = {
          x: touch2.clientX,
          y: touch2.clientY,
        };

        if (!lastCenter) {
          setLastCenter(getCenter(p1, p2) as any);
          return;
        }
        const newCenter = getCenter(p1, p2);

        const dist = getDistance(p1, p2);

        if (!lastDist) {
          setLastDist(dist);
          return;
        }

        // local coordinates of center point
        const pointTo = {
          x:
            (newCenter.x - stageTransformTarget.current.x) /
            stageTransformTarget.current.scale,
          y:
            (newCenter.y - stageTransformTarget.current.y) /
            stageTransformTarget.current.scale,
        };

        const scale = stageTransformTarget.current.scale * (dist / lastDist);
        stageTransformTarget.current.scale = scale;

        // calculate new position of the stage
        const dx = newCenter.x - lastCenter.x;
        const dy = newCenter.y - lastCenter.y;

        stageTransformTarget.current.x = newCenter.x - pointTo.x * scale + dx;
        stageTransformTarget.current.y = newCenter.y - pointTo.y * scale + dy;

        setLastDist(dist);
        setLastCenter(newCenter);
      }
    },
    [dragStopped, lastCenter, lastDist, stagePos, stageScale],
  );

  const handleTouchEnd = () => {
    setLastDist(0);
    setLastCenter(null);
  };

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
      <Stage
        ref={stageRef}
        width={500}
        height={500}
        onWheel={onScroll}
        onTouchMove={onKonvaTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </Stage>
    </div>
  );
}
