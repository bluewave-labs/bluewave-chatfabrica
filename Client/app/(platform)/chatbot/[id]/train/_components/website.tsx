"use client";

import { deleteCrawlWebsite } from "@/actions/delete-crawl-website";
import { deleteFile } from "@/actions/delete-files";
import { FormInput } from "@/components/form/form-input";
import FormSubmit from "@/components/form/form-submit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAction } from "@/hooks/use-action";
import { useCharactersStore } from "@/hooks/use-characters";
import { useDocsStore } from "@/hooks/use-docs";
import { useLinksStore } from "@/hooks/use-links";
import { Chatbot, Docs } from "@/lib/definitions";
import { Info, Plus, Trash2 } from "lucide-react";
import { Session } from "next-auth";
import React, { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

export default function WebsiteForm({
  session,
  chatbot,
}: {
  session: Session | null;
  chatbot: Chatbot | null;
}) {
  const { execute } = useAction(deleteCrawlWebsite, {
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: deleteAction, isLoading: deleteIsLoading } = useAction(
    deleteFile,
    {
      onSuccess: () => {
        toast.success("Link deleted successfully.");
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const formRef = useRef<HTMLFormElement>(null);
  const { addLinks, removeLink, clearLinks } = useLinksStore();
  const { addCharacters, deleteCharacters } = useCharactersStore();
  const { docs, addDocs, removeDoc, clearDocs } = useDocsStore();
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState<React.ReactElement[]>([]);
  const [firstClickDelete, setFirstClickDelete] = useState(false);
  const [isLoadingMap, setIsLoadingMap] = useState<{ [key: string]: boolean }>(
    {}
  );

  const [inputValues, setInputValues] = useState<{
    [key: string]: string;
  }>({});
  const [inputValuesResult, setInputValuesResult] = useState<{
    [key: string]: string;
  }>({});
  const [customUrls, setCustomUrls] = useState<string[]>([]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const websiteUrl = event.currentTarget.websiteUrl.value;
    const urls: string[] = [];

    if (!Object.values(inputValues).length && !websiteUrl) {
      setIsLoading(false);
      return toast.error("Please enter a URL to crawl.");
    }

    if (websiteUrl && !/^https?:\/\//i.test(websiteUrl)) {
      setIsLoading(false);
      return toast.error("Please include 'http://' or 'https://' in the URL.");
    }

    if (Object.values(inputValues).length) {
      for await (const [key, value] of Object.entries(inputValues)) {
        if (!/^https?:\/\//i.test(value)) {
          setIsLoading(false);
          return toast.error(
            "Please include 'http://' or 'https://' in the URL."
          );
        }
      }
    }

    if (!chatbot) {
      return toast.error("Chatbot not found.");
    }

    Object.values(inputValues)
      .concat(Object.values(inputValuesResult))
      .forEach((input) => {
        if (!customUrls.includes(input)) {
          setCustomUrls([...customUrls, input]);
          urls.push(input);
        }
      });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/crawl-website`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
          body: JSON.stringify({
            url: websiteUrl,
            chatbotId: chatbot!.id,
            singleUrls: urls,
          }),
        }
      );

      const result = await response.json();

      addLinks(
        result.links.map(
          (file: {
            id: string;
            name: string;
            url: string;
            characterCount: number;
            body: string;
          }) => ({
            id: file.id,
            name: file.name,
            url: file.url,
            characterCount: file.characterCount,
            body: file.body,
          })
        )
      );

      const totalCount = result.links.reduce(
        (total: number, doc: { characterCount: number }) =>
          total + doc.characterCount,
        0
      );

      addCharacters(totalCount, "link");
      addDocs([
        ...docs,
        ...result.links.filter(
          (doc: { url: string }) =>
            !docs.filter((d) => d.url === doc.url).length
        ),
      ]);
      setInputValuesResult(inputValues);
      setInputValues({});
      setInputs([]);
    } catch (error) {
      toast.error("An error occurred while crawling the website.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitSitemap = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    let sitemapUrl = event.currentTarget.sitemapUrl.value.trim();

    if (!sitemapUrl) {
      setIsLoading(false);
      return toast.error("Please enter a sitemap URL.");
    }

    if (
      !sitemapUrl.startsWith("http://") &&
      !sitemapUrl.startsWith("https://")
    ) {
      setIsLoading(false);
      return toast.error(
        "Please include 'http://' or 'https://' in the sitemap URL."
      );
    }

    if (!chatbot) {
      return toast.error("Chatbot not found.");
    }

    try {
      const sitemapUrl = event.currentTarget.sitemapUrl.value;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/crawl-website/sitemap`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
          body: JSON.stringify({
            url: sitemapUrl,
            chatbotId: chatbot!.id,
          }),
        }
      );

      if (!response.ok) {
        return toast.error("An error occurred while crawling the website.");
      }

      const result = await response.json();

      addLinks(
        result.links.map(
          (link: {
            id: string;
            name: string;
            url: string;
            characterCount: number;
          }) => ({
            id: link.id,
            name: link.name,
            url: link.url,
            characterCount: link.characterCount,
          })
        )
      );

      const totalCount = result.links.reduce(
        (total: number, doc: { characterCount: number }) =>
          total + doc.characterCount,
        0
      );

      addCharacters(totalCount, "link");
      addDocs(result.links);
    } catch (error) {
      toast.error("An error occurred while crawling the website.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (formData: FormData) => {
    const fileId = formData.get("fileId") as string;

    execute({ chatbotId: chatbot!.id, fileId });

    deleteCharacters(docs.find((d) => d.id === fileId)!.characterCount, "link");
    removeLink(fileId);
    removeDoc(fileId);
  };

  const deleteAllTrainingData = (fileIds: string[]) => {
    if (!fileIds.length) return;
    deleteAction({ chatbotId: chatbot!.id, fileIds });
  };

  const handleDeleteFile = (formData: FormData) => {
    const fileId = formData.get("fileId") as string;
    setIsLoadingMap((prev) => ({ ...prev, [fileId]: true }));

    deleteCharacters(
      chatbot?.trainingDatas.find((d) => d.fileId === fileId)!.charactersCount!,
      "link"
    );
    removeLink(fileId);
    deleteAction({ chatbotId: chatbot!.id, fileIds: [fileId] }).finally(() => {
      setIsLoadingMap((prev) => ({ ...prev, [fileId]: false }));
    });
  };

  const totalCharacterLink = useMemo(() => {
    if (!chatbot?.trainingDatas) return 0;

    return chatbot.trainingDatas.reduce(
      (total, trainingData) => total + trainingData.charactersCount,
      0
    );
  }, [chatbot?.trainingDatas]);

  return (
    <div className="w-full mt-4">
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col w-full gap-y-1">
          <form
            ref={formRef}
            onSubmit={onSubmit}
            className="flex flex-col md:flex-row items-center justify-between w-full h-full gap-2"
          >
            <FormInput
              id="websiteUrl"
              label="Crawl"
              containerClassName="w-full"
            />
            <FormSubmit
              disabled={isLoading}
              isLoading={isLoading}
              className="self-end w-full md:w-auto"
            >
              Fetch links
            </FormSubmit>
          </form>
          <p className="text-start text-stone-400 text-xs sm:text-sm w-full">
            This will crawl all the links starting with the URL (not including
            files on the website).
          </p>

          <div className="flex items-center my-4">
            <hr className="grow" />
            <span className="mx-2">OR</span>
            <hr className="grow" />
          </div>

          <form
            ref={formRef}
            onSubmit={onSubmitSitemap}
            className="flex flex-col md:flex-row items-center justify-between w-full h-full gap-2"
          >
            <FormInput
              id="sitemapUrl"
              label="Submit Sitemap"
              containerClassName="w-full"
            />
            <FormSubmit
              disabled={isLoading}
              isLoading={isLoading}
              className="self-end w-full md:w-auto"
            >
              Load sitemap
            </FormSubmit>
          </form>
        </div>

        <h3 className="w-full text-center text-base">Included Links</h3>
        <hr className="w-full" />
        <div className="flex w-full justify-end items-center gap-x-2">
          <Button
            onClick={() => {
              clearDocs();
              clearLinks();
              deleteAllTrainingData(
                chatbot?.trainingDatas.map((d) => d.fileId) || []
              );
              const totalCharacters =
                docs.reduce((total, doc) => total + doc.characterCount, 0) +
                (chatbot?.trainingDatas.reduce(
                  (total, doc) => total + doc.charactersCount,
                  0
                ) || 0);

              deleteCharacters(totalCharacters, "link");
              setFirstClickDelete(true);

              setTimeout(() => {
                setFirstClickDelete(false);
              }, 5000);
            }}
            disabled={
              (!docs?.length && !chatbot?.trainingDatas.length) ||
              firstClickDelete
            }
            variant="destructive"
          >
            Delete All
          </Button>
          <Button
            variant="default"
            onClick={() =>
              setInputs([
                ...inputs,
                <Input
                  key={inputs.length}
                  className="text-xs"
                  name={`input-${inputs.length}`}
                  // @ts-ignore
                  onChange={(event) => {
                    const { name, value } = event.target;
                    setInputValues((prev) => ({
                      ...prev,
                      [name]: value,
                    }));
                  }}
                />,
              ])
            }
          >
            Add <Plus size={16} className="ml-2" />
          </Button>
        </div>

        <ul className="w-full  md:space-y-4">
          {chatbot?.trainingDatas.map((trainingData, index) => (
            <li
              key={index}
              className="flex   sm:flex-row   justify-between  md:items-center gap-x-2"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="mr-2 flex   sm:justify-normal items-center md:w-[110px]">
                    <Badge
                      variant="success"
                      className="rounded-md  mt-2 md:mt-0"
                    >
                      Trained
                      <Info size={16} className="ml-2" />
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-900 border-zinc-700 text-white text-sm">
                    <p>Your chatbot has been trained on this source.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex mt-2 justify-center sm:justify-normal md:mt-0  ">
                <div className="border w-[100px]  md:w-[600px] h-10 flex items-center justify-normal md:justify-between pl-4 rounded-lg">
                  <span className="text-xs o sm:w-full break-all overflow-hidden text-ellipsis whitespace-nowrap ">
                    {trainingData.url}
                  </span>
                </div>
                <div className="md:ml-10 ml-1 md:w-[110px]  sm:justify-between flex items-center">
                  <span className="text-sm  w-5 sm:w-[100px] text-stone-400">
                    {trainingData.charactersCount}
                  </span>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      const formData = new FormData(event.currentTarget);
                      handleDeleteFile(formData);
                    }}
                    action={handleDeleteFile}
                  >
                    <input
                      type="hidden"
                      name="fileId"
                      value={trainingData.fileId}
                    />
                    <FormSubmit
                      variant="ghost"
                      isLoading={isLoadingMap[trainingData.fileId]}
                    >
                      <Trash2 size={20} className="text-red-400 ml-2 sm:ml-0" />
                    </FormSubmit>
                  </form>
                </div>
              </div>
            </li>
          ))}

          {docs?.length
            ? docs.map((doc, index) => (
                <li key={index} className="flex items-center gap-x-2">
                  <div className="pl-0 w-[800px]  lg:w-[800px] h-10 flex items-center justify-between  rounded-lg">
                    <span className="border text-xs w-[200px] break-all overflow-hidden text-ellipsis whitespace-nowrap  md:w-[715px] h-10 flex items-center justify-normal md:justify-between  sm:pl-4 rounded-lg">
                      {doc.url}
                    </span>
                  </div>
                  <div className="flex ml-5 justify-between  mt-2 sm:mt-0 sm:ml-4 md:ml-10 w-full sm:w-[150px] md:w-[110px] items-center space-x-4">
                    <span className="text-xs text-slate-900">
                      {doc.characterCount}
                    </span>
                    <form action={handleDelete} className="flex items-center">
                      <input type="hidden" name="fileId" value={doc.id} />
                      <Button type="submit" variant="ghost">
                        <Trash2 size={20} className="text-red-400" />
                      </Button>
                    </form>
                  </div>
                </li>
              ))
            : null}

          {inputs?.length
            ? inputs.map((input, index) => (
                <li key={index} className="flex items-center gap-x-2">
                  {input}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setInputs(inputs.filter((_, i) => i !== index));
                    }}
                  >
                    <Trash2 size={20} className="text-red-400" />
                  </Button>
                </li>
              ))
            : null}
        </ul>
      </div>
    </div>
  );
}
