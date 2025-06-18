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
  const propertiesToCss: Record<keyof DiaryProperties, string | null> = {
    accentColor: "--accent-color",
    backgroundImage: "--bg-image",
    coverImage: null,
    showUserAge: null,
  };

  React.useEffect(() => {
    (Object.keys(propertiesToCss) as Array<keyof DiaryProperties>).forEach(
      (key) => {
        const value = properties[key];
        if (typeof value === "string" && propertiesToCss[key]) {
          const varName = propertiesToCss[key];
          document.body.style.setProperty(varName, value);
          if (value.indexOf(".") != -1)
            document.body.style.setProperty(varName, `url(${value})`);
        } else if (propertiesToCss[key]) {
          const varName = propertiesToCss[key];
          document.body.style.removeProperty(varName);
        }
      },
    );
    return () => {
      for (const [key, varName] of Object.entries(propertiesToCss)) {
        if (varName) document.body.style.removeProperty(varName);
      }
    };
  }, [properties]);

  return null;
}
