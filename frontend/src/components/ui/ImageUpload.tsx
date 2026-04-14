"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (dataUrl: string) => void;
  label?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, label = "Upload Image", className = "" }: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  if (value) {
    return (
      <div className={`relative group ${className}`}>
        <div className="relative h-48 w-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
          <Image
            src={value}
            alt={`${label} preview`}
            fill
            sizes="(max-width: 768px) 100vw, 640px"
            className="object-cover"
          />
        </div>
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={`Remove ${label}`}
          className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
        >
          <X size={14} />
        </button>
        <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-[10px] uppercase tracking-widest text-white/70 backdrop-blur-sm">
          {label}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        aria-label={label}
        tabIndex={-1}
        className="hidden"
      />
      <div
        role="button"
        aria-label={`Choose ${label}`}
        tabIndex={0}
        className={`drop-zone w-full rounded-lg p-6 text-center transition-all ${
          isDragOver ? "drag-over" : ""
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onClick={() => inputRef.current?.click()}
      >
      <div className="flex flex-col items-center gap-3">
        {isDragOver ? (
          <ImageIcon size={32} className="text-gold" />
        ) : (
          <Upload size={32} className="text-zinc-500" />
        )}
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
            {isDragOver ? "Drop image here" : label}
          </p>
          <p className="mt-1 text-[10px] text-zinc-600">
            Drag & drop or click to browse
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}

// ── Multi-image upload for gallery ──
interface MultiImageUploadProps {
  values: string[];
  onChange: (dataUrls: string[]) => void;
  label?: string;
  maxImages?: number;
}

export function MultiImageUpload({
  values,
  onChange,
  label = "Gallery Images",
  maxImages = 6
}: MultiImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const processFiles = useCallback(
    async (files: FileList) => {
      const newImages: string[] = [...values];
      const fileArray = Array.from(files).slice(0, maxImages - values.length);

      for (const file of fileArray) {
        if (!file.type.startsWith("image/")) continue;
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        newImages.push(dataUrl);
      }

      onChange(newImages);
    },
    [values, onChange, maxImages]
  );

  const removeImage = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">{label}</p>
        <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
          {values.length}/{maxImages}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {values.map((img, index) => (
          <div key={index} className="relative group aspect-square">
            <div className="relative h-full w-full overflow-hidden rounded-md border border-white/10 bg-white/[0.03]">
              <Image
                src={img}
                alt={`Gallery ${index + 1}`}
                fill
                sizes="(max-width: 768px) 33vw, 160px"
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => removeImage(index)}
              aria-label={`Remove gallery image ${index + 1}`}
              className="absolute top-1 right-1 rounded-full bg-black/70 p-1 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {values.length < maxImages && (
          <div className="relative aspect-square">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && processFiles(e.target.files)}
              aria-label={label}
              tabIndex={-1}
              className="hidden"
            />
            <div
              role="button"
              aria-label={`Add ${label}`}
              tabIndex={0}
              className={`drop-zone h-full w-full rounded-md flex items-center justify-center cursor-pointer ${
                isDragOver ? "drag-over" : ""
              }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              processFiles(e.dataTransfer.files);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                inputRef.current?.click();
              }
            }}
            onClick={() => inputRef.current?.click()}
            >
              <Upload size={20} className="text-zinc-500" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
