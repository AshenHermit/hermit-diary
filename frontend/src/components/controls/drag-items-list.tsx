"use client";

import { data } from "autoprefixer";
import { space } from "postcss/lib/list";
import React, {
  cloneElement,
  ForwardedRef,
  ReactElement,
  ReactHTMLElement,
} from "react";

type DragContextType = {
  startDrag: (args: {
    el: HTMLElement;
    offsetX: number;
    offsetY: number;
    width: number;
    data: any;
  }) => void;
  stopDrag: () => void;
  getDraggingElement: () => HTMLElement | null;
  getDraggingData: () => any;
};
const DragContext = React.createContext<DragContextType>({
  startDrag: () => {},
  stopDrag: () => {},
  getDraggingElement: () => null,
  getDraggingData: () => {},
});

export function DragItemsContainer({
  children,
}: {
  children: () => React.ReactElement | React.ReactElement[];
}) {
  const currentDraggingElement = React.useRef<HTMLElement | null>(null);
  const currentDraggingData = React.useRef<any>(null);
  const currentPointerOffset = React.useRef<number[]>([0, 0]);
  const spacer = React.useRef<HTMLElement>(null);

  const startDrag = React.useCallback<DragContextType["startDrag"]>(
    ({ el, offsetX, offsetY, width, data }) => {
      spacer.current = document.createElement("div");
      spacer.current.style.height = el.scrollHeight + "px";
      spacer.current.innerHTML = `<div style="height: ${el.scrollHeight + "px"}"></div>`;
      console.log(el.scrollHeight);
      spacer.current.style.display = "none";
      el.parentNode?.insertBefore(spacer.current, el);

      currentDraggingData.current = data;
      currentDraggingElement.current = el;
      currentDraggingElement.current.style.width = `${width}px`;
      currentPointerOffset.current[0] = offsetX;
      currentPointerOffset.current[1] = offsetY;
    },
    [],
  );

  const stopDrag = React.useCallback<DragContextType["stopDrag"]>(() => {
    if (currentDraggingElement.current) {
      currentDraggingElement.current.style.position = "";
      currentDraggingElement.current.style.opacity = "";
      currentDraggingElement.current.style.pointerEvents = "all";
      currentDraggingElement.current.style.width = ``;
      spacer.current?.remove();
    }
    currentDraggingElement.current = null;
    currentDraggingData.current = null;
  }, []);

  const ctx = React.useMemo<DragContextType>(
    () => ({
      startDrag,
      stopDrag,
      getDraggingElement: () => currentDraggingElement.current,
      getDraggingData: () => currentDraggingData.current,
    }),
    [startDrag, stopDrag, currentDraggingElement],
  );

  const onMove = React.useCallback((x: number, y: number) => {
    if (currentDraggingElement.current) {
      if (spacer.current) spacer.current.style.display = "";
      currentDraggingElement.current.style.position = "absolute";
      currentDraggingElement.current.style.pointerEvents = "none";
      currentDraggingElement.current.style.opacity = "0.5";
      currentDraggingElement.current.style.left = `${x - currentPointerOffset.current[0]}px`;
      currentDraggingElement.current.style.top = `${y - currentPointerOffset.current[1]}px`;
    }
  }, []);

  const mouseMove = React.useCallback(
    (e: MouseEvent) => {
      onMove(e.pageX, e.pageY);
    },
    [onMove],
  );

  const mouseUp = React.useCallback(
    (e: MouseEvent) => {
      stopDrag();
    },
    [stopDrag],
  );

  React.useEffect(() => {
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseUp);
    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);
    };
  }, []);

  return <DragContext.Provider value={ctx}>{children()}</DragContext.Provider>;
}

export type DragItemProps<T extends HTMLElement, D> = {
  children: ReactElement<any>;
  data: D;
  onDataDropped?: (data: any) => void;
  draggable?: boolean;
  itemRef?: React.RefObject<T | null>;
};

export function DragItem<T extends HTMLElement, D>({
  children,
  data,
  onDataDropped,
  draggable = true,
  itemRef,
}: DragItemProps<T, D>) {
  const triggerRef = React.useRef<T>(null);
  const context = React.useContext(DragContext);

  const onPressed = (offsetX: number, offsetY: number) => {
    if (itemRef && itemRef.current) {
      context.startDrag({
        el: itemRef.current,
        offsetX,
        offsetY,
        width: itemRef.current.clientWidth,
        data,
      });
    }
  };

  const onPointerUp = () => {
    const currentDragData = context.getDraggingData();
    if (currentDragData) {
      if (onDataDropped) onDataDropped(currentDragData);
    }
  };

  const onMousedown = (e: MouseEvent) => {
    const rect = itemRef?.current?.getBoundingClientRect();
    const left = rect?.left ?? 0;
    const top = rect?.top ?? 0;
    onPressed(e.pageX - left, e.pageY - top);
  };
  const onMouseUp = (e: MouseEvent) => {
    onPointerUp();
  };

  React.useEffect(() => {
    if (triggerRef && triggerRef.current) {
      if (draggable)
        triggerRef.current.addEventListener("mousedown", onMousedown);
      triggerRef.current.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      if (triggerRef && triggerRef.current) {
        if (draggable)
          triggerRef.current.removeEventListener("mousedown", onMousedown);
        triggerRef.current.removeEventListener("mouseup", onMouseUp);
      }
    };
  }, [draggable]);

  return cloneElement(children, { ref: triggerRef });
}
