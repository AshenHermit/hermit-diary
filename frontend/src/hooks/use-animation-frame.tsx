"use client";

import Konva from "konva";
import { AnimationFn } from "konva/lib/types";
import React from "react";

export function useLayerAnimation(func: AnimationFn, deps: any[]) {
  React.useEffect(() => {
    const anim = new Konva.Animation(func);
    anim.start();

    return () => {
      anim.stop();
    };
  }, [func, ...deps]);
}
