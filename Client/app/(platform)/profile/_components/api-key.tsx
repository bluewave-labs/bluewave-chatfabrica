import { deleteCrawlWebsite } from "@/actions/delete-crawl-website";
import { deleteFile } from "@/actions/delete-files";
import { saveApiKey } from "@/actions/save-api-key";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAction } from "@/hooks/use-action";
import React, { useState } from "react";
import { toast } from "sonner";

export default function ApiKey() {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { execute } = useAction(saveApiKey, {
    onSuccess: () => {
      toast.success("API Key saved successfully.");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      execute({ apiKey: apiKey });
    } catch (error) {
      console.error("Error while sending API key:", error);
      toast.error("An error occurred while sending the API key.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading && (
        <svg
          className="mr-2 h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      )}
      <Card className="shadow-secondary">
        <CardHeader>
          <CardTitle className="text-slate-700">OpenAI API Key</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-500">
          <p>
            {" "}
            To use ChatFabrica without limits, you must enter the OpenAI API
            Key. It is stored encrypted in our database and sent to OpenAI only
            for your messages.
          </p>{" "}
          <Input
            type="password"
            placeholder="OpenAI API Anahtarınızı girin"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="mt-4"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full">
            Save API Key
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
