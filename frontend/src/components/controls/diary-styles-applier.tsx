"use client";

import {
  defaultDiaryProperties,
  DiaryProperties,
} from "@/services/types/diary";
import React from "react";

export function DiaryStylesApplier({
  properties,
}: {
  properties: DiaryProperties;
}) {
  properties = { ...defaultDiaryProperties, ...properties };
  const propertiesToCss: Record<keyof DiaryProperties, string> = {
    accentColor: "--accent-color",
    backgroundImage: "--bg-image",
  };

  React.useEffect(() => {
    (Object.keys(propertiesToCss) as Array<keyof DiaryProperties>).forEach(
      (key) => {
        const value = properties[key];
        if (typeof value === "string") {
          document.body.style.setProperty(propertiesToCss[key], value);
          if (value.indexOf(".") != -1)
            document.body.style.setProperty(
              propertiesToCss[key],
              `url(${value})`,
            );
        }
      },
    );
  }, [properties]);

  return null;
}
