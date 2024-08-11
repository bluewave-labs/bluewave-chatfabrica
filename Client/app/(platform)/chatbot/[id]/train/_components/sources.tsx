/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { trainChatbot } from "@/actions/train-chatbot";
import FormSubmit from "@/components/form/form-submit";
import { useAction } from "@/hooks/use-action";
import { useCharactersStore } from "@/hooks/use-characters";
import { useDocsStore } from "@/hooks/use-docs";
import { useFilesStore } from "@/hooks/use-files";
import { useLinksStore } from "@/hooks/use-links";
import { useTextArea } from "@/hooks/use-textarea";
import { Chatbot, User, UserPlan } from "@/lib/definitions";
import { useParams } from "next/navigation";
import { useRouter } from "next13-progressbar";
import React, { useEffect, useMemo } from "react";
import { toast } from "sonner";

export default function Sources({
  user,
  activeUserPlan,
  chatbot,
}: {
  user: User;
  activeUserPlan: UserPlan[] | null;
  chatbot: Chatbot | null;
}) {
  const router = useRouter();
  const { id } = useParams();
  const { files, clearFiles, addFiles } = useFilesStore();
  const { links, clearLinks, addLinks } = useLinksStore();
  const { text, setText, clearText } = useTextArea();
  const { clearDocs } = useDocsStore();

  const {
    addCharacters,
    clearCharacters,
    totalCharacters: { file, link, text: textCount },
  } = useCharactersStore();

  const totalCharacterCount = useMemo(() => {
    const count = file + link + (text.length || textCount);
    return count;
  }, [file, link, text]);

  const { execute } = useAction(trainChatbot, {
    onSuccess: () => {
      toast.success("Chatbot retrained successfully.");
      clearDocs();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const userPlanActiveStatus = activeUserPlan?.filter(
    (userPlan) => !userPlan.plan.isExtraPacket && userPlan.status
  )?.[0];

  const onSubmit = (formData: FormData) => {
    execute({
      assistantId: chatbot!.assistantId,
      text,
      files,
      links,
      chatbotId: id as string,
    });
  };

  useEffect(() => {
    if (chatbot) {
      if (chatbot.files) {
        const filesCharacterCount = chatbot.files.reduce(
          (acc, file) => acc + +file.characterCount,
          0
        );
        const textCharacterCount = chatbot.files.reduce(
          (acc, file) =>
            file.type === "text" ? acc + +file.characterCount : acc,
          0
        );
        const textBody = chatbot.files.find(
          (file) => file.type === "text"
        )?.body;

        if (chatbot.files.find((file) => file.type === "text")) {
          setText(
            chatbot.files.find((file) => file.type === "text")?.body || ""
          );
        }

        addFiles(
          chatbot.files.map((file) => ({
            id: file.id,
            name: file.name,
            characterCount: +file.characterCount,
          }))
        );

        if (filesCharacterCount > file) {
          addCharacters(filesCharacterCount, "file");
        }

        if (textCharacterCount > (textBody?.length || textCount)) {
          addCharacters(textCharacterCount, "text");
        }
      }

      if (chatbot.trainingDatas) {
        const linksCharacterCount = chatbot.trainingDatas.reduce(
          (acc, link) => acc + +link.charactersCount,
          0
        );

        addLinks(
          chatbot.trainingDatas.map((link) => ({
            id: link.fileId,
            name: link.name,
            url: link.url,
            characterCount: +link.charactersCount,
            body: link.body,
          }))
        );

        if (linksCharacterCount > link) {
          addCharacters(linksCharacterCount, "link");
        }
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      clearFiles();
      clearLinks();
      clearText();
      clearCharacters("file");
      clearCharacters("link");
      clearCharacters("text");
    };
  }, []);

  return (
    <div className="border border-slate-300 w-full rounded-md p-[25px] space-y-[25px]">
      <h3 className="text-sm font-semibold text-center">Sources</h3>
      <div className="text-sm space-y-2">
        <p>
          {files.length} File ({file} chars)
        </p>
        <p>{text.length + textCount} text input chars</p>
        <p>
          {links.length} website links ({link} chars)
        </p>
      </div>
      <div className="flex flex-col items-end text-sm">
        <p className="font-bold">Total detected characters</p>
        <p>
          <span className="font-bold">
            {Intl.NumberFormat("en-US").format(totalCharacterCount)}
          </span>
          /{" "}
          {Intl.NumberFormat("en-US").format(
            userPlanActiveStatus?.plan?.charactersPerChatbot || 400000
          )}{" "}
          limit
        </p>
      </div>
      <form action={onSubmit}>
        <FormSubmit className="w-full">
          {chatbot?.updatedAt !== chatbot?.createdAt
            ? "Retrain Chatbot"
            : "Train Chatbot"}
        </FormSubmit>
      </form>
    </div>
  );
}
