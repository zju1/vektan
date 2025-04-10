import { useUploadMultipleFileMutation } from "@/app/store/services/settings.api";
import { useCallback } from "react";

export function useFiles() {
  const [upload, { isLoading }] = useUploadMultipleFileMutation();

  const handleUpload = useCallback(
    async (files: File[]) => {
      const data = new FormData();
      files.forEach((file) => {
        data.append("files", file);
      });
      const response = await upload(data).unwrap();
      return response.files.map((file) => ({
        name: file.originalname,
        fileUrl: file.url,
      }));
    },
    [upload]
  );

  return {
    isLoading,
    handleUpload,
  };
}
