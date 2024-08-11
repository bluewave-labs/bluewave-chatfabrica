"use client";

import { updateChatbot } from "@/actions/update-chatbot";
import FormSubmit from "@/components/form/form-submit";
import FormTextArea from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAction } from "@/hooks/use-action";
import { Chatbot } from "@/lib/definitions";
import React, { useState } from "react";
import { toast } from "sonner";

export default function ModelForm({ chatbot }: { chatbot: Chatbot }) {
  const { execute } = useAction(updateChatbot, {
    onSuccess: () => {
      toast.success(`Chatbot updated successfully.`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const [temperature, setTemperature] = useState<number>(chatbot.temperature);

  const onSubmit = (formData: FormData) => {
    const instructions = formData.get("instructions") as string;
    const model = formData.get("model") as string;
    const visibility = formData.get("visibility") as "Public" | "Private";
    const temperature = Number(formData.get("temperature"));

    execute({
      assistantId: chatbot.assistantId,
      description: instructions,
      model,
      visibility,
      temperature,
    });
  };

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="flex flex-col gap-y-2">
        <FormTextArea
          id="instructions"
          label="Instructions"
          className="h-44 bg-white"
          defaultValue={chatbot.instructions}
        />
        <p className="text-stone-400 text-sm">
          Customize your chatbot's personality and style by adapting the
          instructions to your data and use case.
        </p>
      </div>
      <div className="flex items-center justify-end">
        <Button variant="secondary">Reset</Button>
      </div>

      <div className="space-y-2 mb-2">
        <Label>Visibility</Label>
        <Select defaultValue={chatbot.visibility} name="visibility">
          <SelectTrigger className="bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Public">Public</SelectItem>
            <SelectItem value="Private">Private</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-stone-400 text-sm">
          Private chatbots are only visible to you.
        </p>
      </div>

      <div className="space-y-2 mb-2">
        <Label>Model</Label>
        <Select defaultValue={chatbot.model} name="model">
          <SelectTrigger className="bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4o-mini	">GPT-4o-mini </SelectItem>
            <SelectItem value="gpt-4o">GPT-4o</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-stone-400 text-sm">
          GPT-4o excels in accuracy but is slower and more expensive than
          GPT-4o-mini (1 message in GPT-4o costs 10 credits, compared to 1
          credit in GPT-4o-mini ).
        </p>
      </div>
      <div>
        <Label htmlFor="temperature">Temperature</Label>
        <p className="text-sm">{temperature}</p>
        <input
          id="temperature"
          name="temperature"
          min="0"
          max="2"
          step="0.1"
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 accent-[#5046E5] dark:bg-zinc-700"
          type="range"
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
        />
        <div className="flex justify-between">
          <p className="text-stone-400 text-sm mt-1">
            Controls randomness: Lowering results in less random completions. As
            the temperature approaches zero, the model will become deterministic
            and repetitive.
          </p>
        </div>
      </div>

      <FormSubmit className="w-full">Save</FormSubmit>
    </form>
  );
}
