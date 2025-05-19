"use client";

import classNames from "classnames";
import React from "react";

const HorizontalDivider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div>
      <div
        {...props}
        className={classNames(
          className,
          "relative mt-8 w-full text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border",
        )}
      >
        <span className="relative z-10 w-full rounded-lg bg-muted px-2 text-muted-foreground">
          {children}
        </span>
      </div>
    </div>
  );
});

export { HorizontalDivider };
