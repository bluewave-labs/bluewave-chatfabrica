"use client";

import FormSubmit from "@/components/form/form-submit";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { toast } from "sonner";

export default function HelpForm() {
  const [email, setEmail] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const formRef = React.useRef<HTMLFormElement>(null);

  const onSubmit = (formData: FormData) => {
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    if (!email || !subject || !message) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    })
      .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
          toast.success(json.message);
          setEmail("");
          setSubject("");
          setMessage("");
        } else {
          toast.error(json.message);
        }
      })
      .catch((error) => {
        toast.error("An error occurred");
      })
      .finally(function () {
        formRef.current?.reset();
        setLoading(false);
      });
  };

  return (
    <form
      action={onSubmit}
      className="w-full bg-white rounded-lg p-7 flex flex-col gap-y-5"
    >
      <input
        type="hidden"
        name="access_key"
        value="99ab30cc-2d2e-4c4a-b8c7-44b5ea30db4f"
      />
      <div className="flex flex-col gap-y-1.5">
        <Label>Email</Label>
        <input
          id="email"
          name="email"
          placeholder="Email"
          className="flex h-10 w-full rounded-md border border-input  bg-white px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>
      <div className="flex flex-col gap-y-1.5">
        <Label>Subject</Label>
        <input
          id="subject"
          placeholder="Subject"
          name="subject"
          className="flex h-10 w-full rounded-md border border-input  bg-white px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          onChange={(e) => setSubject(e.target.value)}
          value={subject}
        />
      </div>

      <div className="flex flex-col gap-y-1.5">
        <label htmlFor="message">Your message</label>
        <Textarea
          id="message"
          name="message"
          placeholder="Type your message here"
          className="resize-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <FormSubmit isLoading={loading}>Send Message</FormSubmit>
    </form>
  );
}
