"use client";

import { deleteFile } from "@/actions/delete-files";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { useCharactersStore } from "@/hooks/use-characters";
import { useFilesStore } from "@/hooks/use-files";
import { Chatbot } from "@/lib/definitions";
import { X } from "lucide-react";
import { Session } from "next-auth";
import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { toast } from "sonner";

export default function TrainForm({
  session,
  chatbot,
}: {
  session: Session | null;
  chatbot: Chatbot | null;
}) {
  const { files, addFiles, removeFile } = useFilesStore();
  const { addCharacters, deleteCharacters } = useCharactersStore();
  const [uploadProgresses, setUploadProgresses] = useState<any>({});

  const { execute: deleteAction } = useAction(deleteFile, {
    onSuccess: () => {
      toast.success("File deleted successfully.");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleChange = async (newFiles: File[]) => {
    setUploadProgresses({});
    const formData = new FormData();

    Object.entries(newFiles).forEach(([_, file]) => {
      formData.append("files", file);
    });

    try {
      toast.promise(
        async () => {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${session?.user.accessToken}`,
              },
              body: formData,
              mode: "no-cors",
            }
          );

          const data = await response.json();

          if (data.status !== "success") {
            return Promise.reject(data.message);
          }

          for await (const file of data.files) {
            addCharacters(file.characterCount, "file");
            addFiles([
              {
                id: file.id,
                name: file.originalname,
                characterCount: file.characterCount,
              },
            ]);
          }
        },
        {
          success: "Files uploaded successfully.",
          loading: "Uploading files...",
          error: "An error occurred while uploading files. Please try again.",
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteFile = (formData: FormData) => {
    const fileId = formData.get("fileId") as string;

    deleteCharacters(
      files.find((file) => file.id === fileId)!.characterCount!,
      "file"
    );
    removeFile(fileId);
    deleteAction({ chatbotId: chatbot!.id, fileIds: [fileId] });
  };

  return (
    <div className="w-full mt-4 ">
      <FileUploader
        handleChange={handleChange}
        name="files"
        multiple
        label={`Supported File Types:`}
        types={["PDF"]}
        classes="bg-red-400 !bg-[#F8F8FF] !border-none !min-w-full !max-w-full !h-[380px] flex-col self-center"
      />
      <div className="relative text-center  sm:text-[10px] text-xs text-[#808082] -top-[320px]  ">
        <span>Articles, PDFs that appear as images cannot be trained</span>
      </div>

      <div>
        {files.length ? (
          <div className="mt-4">
            <h2 className="text-sm font-bold">
              Uploaded - {files.length}/{files.length} files
            </h2>
            <ul className="flex flex-col gap-2.5 mt-2.5">
              {Array.from(files).map((file, index) => (
                <li
                  className="w-full rounded h-9 border border-[#E3E3E3] flex items-center justify-between px-2.5"
                  key={index}
                >
                  <span className="text-xs">
                    {uploadProgresses[file.name]
                      ? `${uploadProgresses[file.name]}%`
                      : file.name}
                  </span>
                  <form action={handleDeleteFile}>
                    <input
                      type="hidden"
                      value={file.id}
                      name="fileId"
                      id="fileId"
                    />
                    <Button type="submit" className="p-0" variant="ghost">
                      <X size={24} />
                    </Button>
                  </form>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
