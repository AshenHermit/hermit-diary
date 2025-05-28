"use client";

import React from "react";

export const useCheckMobileScreen = () => {
  const [width, setWidth] = React.useState(
    global.window ? window.innerWidth : 1920,
  );
  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    handleWindowSizeChange();
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  return width <= 768;
};
