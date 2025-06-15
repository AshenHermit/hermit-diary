import classNames from "classnames";

export function ContentBlockLayout({
  className,
  classesNames,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  classesNames?: { base?: string; wrapper?: string };
}) {
  return (
    <div
      className={classNames(
        "flex h-full flex-col items-center justify-center",
        className,
        classesNames?.base,
      )}
    >
      <div
        className={classNames(
          "rounded-2xl bg-background p-8 max-md:min-h-[100vh] max-md:w-full max-md:px-4 md:min-h-[80vh] md:min-w-[1200px]",
          classesNames?.wrapper,
        )}
      >
        {children}
      </div>
    </div>
  );
}
