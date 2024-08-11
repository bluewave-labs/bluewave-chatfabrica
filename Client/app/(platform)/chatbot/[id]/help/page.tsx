import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import HelpForm from "./_components/form";

export default function HelpPage() {
  return (
    <div className="w-full lg:w-[1000px] mx-auto space-y-7 px-5">
      {/* <div className="space-y-7">
        <h2 className="text-[32px] text-[#334155] font-semibold">FAQs</h2>
        <Accordion type="single" collapsible className="w-full space-y-3">
          <AccordionItem
            value="item-1"
            className="bg-white rounded-lg px-[16px] border border-[#CBD5E1] shadow-accordion"
          >
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-2"
            className="bg-white rounded-lg px-[16px] border border-[#CBD5E1] shadow-accordion"
          >
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-3"
            className="bg-white rounded-lg px-[16px] border border-[#CBD5E1] shadow-accordion"
          >
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-4"
            className="bg-white rounded-lg px-[16px] border border-[#CBD5E1] shadow-accordion"
          >
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div> */}
      <div className="space-y-7">
        <div className="flex flex-col gap-y-5">
          <h2 className="text-[32px] text-[#334155] font-semibold">Contact</h2>
          <span className="text-[#94A3B8] text-sm">
            Your further questions: info@chatfabrica.com
          </span>
        </div>
        <HelpForm />
      </div>
    </div>
  );
}
