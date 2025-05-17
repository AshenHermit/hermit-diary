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
          "mt-8 relative w-full text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"
        )}
      >
        <span className="relative z-10 px-2 bg-muted rounded-lg text-muted-foreground w-full">
          {children}
        </span>
      </div>
    </div>
  );
});

export { HorizontalDivider };
