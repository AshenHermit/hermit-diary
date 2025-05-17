"use client";

import { Input } from "@/components/ui/input";
import { clamp } from "@/lib/math-utils";
import classNames from "classnames";
import { RulerDimensionLineIcon } from "lucide-react";
import React from "react";

export type ValueScrollerProps = {
  min?: number;
  max?: number;
  value: number;
  onValueChange: (value: number) => void;
  factor?: number;
  noInput?: boolean;
};

export function ValueScroller({
  value,
  onValueChange,
  min,
  max,
  factor = 1,
  noInput = false,
}: ValueScrollerProps) {
  let clampedValue = clamp(value, min, max);
  const valueRef = React.useRef(clamp(value, min, max));
  React.useEffect(() => {
    valueRef.current = clamp(value, min, max);
  }, [value]);

  const onChange = React.useCallback(
    (value: number) => {
      onValueChange(clamp(value, min, max));
    },
    [onValueChange],
  );

  const [isScrolling, setIsScrolling] = React.useState(false);

  const onCursorDown = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setIsScrolling(true);
    },
    [setIsScrolling],
  );

  const onCursorUp = React.useCallback(
    (e: MouseEvent) => {
      setIsScrolling(false);
    },
    [setIsScrolling],
  );
  const onCursorMove = React.useCallback(
    (e: MouseEvent) => {
      if (isScrolling) {
        onChange(valueRef.current + e.movementX * factor);
      }
    },
    [isScrolling, factor],
  );

  React.useEffect(() => {
    window.addEventListener("mouseup", onCursorUp);
    window.addEventListener("mousemove", onCursorMove);
    return () => {
      window.removeEventListener("mouseup", onCursorUp);
      window.removeEventListener("mousemove", onCursorMove);
    };
  }, [onCursorUp, onCursorMove]);

  return (
    <div
      className={classNames(
        "grid items-center rounded-lg focus-visible:ring-1 focus-visible:ring-white",
        { "grid-cols-1": noInput, "grid-cols-2": !noInput },
      )}
    >
      {!noInput ? (
        <Input
          type="number"
          value={clampedValue}
          onChange={(e) => onChange(Number(e.target.value))}
          className="border-none !outline-none !ring-0"
        />
      ) : null}
      <div
        className="flex cursor-ew-resize select-none justify-center"
        onMouseDown={(e) => onCursorDown(e)}
      >
        <RulerDimensionLineIcon />
      </div>
    </div>
  );
}
