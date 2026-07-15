"use client";

import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/features/uploads/api/uploads-api";

type FileUploadFieldProps = {
  accept?: string;
  folder: string;
  onUploaded: (path: string) => void;
};

export function FileUploadField({ accept = "image/*", folder, onUploaded }: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const mutation = useMutation({
    mutationFn: (file: File) => uploadFile(file, folder),
    onSuccess: (upload) => {
      onUploaded(upload.path);
      toast.success("Arquivo enviado.");
    },
    onError: () => toast.error("Nao foi possivel enviar o arquivo."),
  });

  return (
    <>
      <input
        ref={inputRef}
        accept={accept}
        className="sr-only"
        type="file"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) mutation.mutate(file);
          event.target.value = "";
        }}
      />
      <Button disabled={mutation.isPending} type="button" variant="outline" onClick={() => inputRef.current?.click()}>
        {mutation.isPending ? "Enviando..." : "Enviar arquivo"}
      </Button>
    </>
  );
}
