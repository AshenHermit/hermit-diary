import { uploadFile } from "@/services/methods/files/upload-file";
import React from "react";

export enum FileType {
  Image = "image",
}

export const FileExtensions = {
  [FileType.Image]: ["png", "jpg", "jpeg", "webp", "gif"],
};

export type UploadedFile = {
  url: string;
  type: FileType;
};

export function FileUploader({
  children,
  types,
  onUpload,
  onLoadingStateChange,
  areaRef,
}: React.PropsWithChildren<{
  types: FileType[];
  onUpload: (files: UploadedFile[]) => void;
  onLoadingStateChange: (state: boolean) => void;
  areaRef: React.MutableRefObject<HTMLDivElement | null>;
}>) {
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList) return;

    const files = Array.from(fileList);
    const filteredFiles = files.filter((file) =>
      types.some((type) =>
        FileExtensions[type]?.includes(
          file.name.split(".").pop()?.toLowerCase() || ""
        )
      )
    );

    if (filteredFiles.length === 0) return;

    onLoadingStateChange(true);
    for (let i = 0; i < filteredFiles.length; i++) {
      const file = filteredFiles[i];
      const res = await uploadFile(file);
      if (res) {
        let uploadedFile: UploadedFile = { url: res.url, type: FileType.Image };
        onUpload([uploadedFile]);
      }
    }
    onLoadingStateChange(false);
  };

  React.useEffect(() => {
    const onDragEnter = (e: DragEvent) => {
      if (!e.dataTransfer?.items.length) return;

      const hasValidFiles = Array.from(e.dataTransfer.items).some((item) => {
        if (item.kind !== "file") return false;
        const fileExt = item.type.split("/").pop()?.toLowerCase();
        return types.some((type) =>
          FileExtensions[type]?.includes(fileExt || "")
        );
      });

      if (hasValidFiles) {
        setIsDragging(true);
      }
    };

    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const onDragLeave = (e: DragEvent) => {
      if (
        e.relatedTarget === null ||
        !areaRef.current?.contains(e.relatedTarget as Node)
      ) {
        setIsDragging(false);
      }
    };

    const onDrop = async (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer ? e.dataTransfer?.files : null);
    };

    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);

    return () => {
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, [types, onUpload, areaRef]);

  return (
    <>
      <div
        className="cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        {children}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        accept={types
          .map((type) => FileExtensions[type].map((ext) => `.${ext}`))
          .flat()
          .join(",")}
        onChange={(e) => handleFiles(e.target.files)}
      />
      {isDragging && areaRef.current && (
        <div
          className="absolute flex items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-lg"
          style={{
            top: areaRef.current.offsetTop,
            left: areaRef.current.offsetLeft,
            width: areaRef.current.offsetWidth,
            height: areaRef.current.offsetHeight,
          }}
        >
          Отпустите файлы для загрузки
        </div>
      )}
    </>
  );
}
