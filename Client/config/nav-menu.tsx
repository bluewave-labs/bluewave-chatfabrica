import {
  AlignCenter,
  Archive,
  ComponentIcon,
  File,
  Globe,
  Network,
  SeparatorVertical,
  Settings,
  Subtitles,
} from "lucide-react";

export default [
  {
    title: "Chatbot",
    icon: <Subtitles />,
    href: "/chatbot/{{id}}",
  },
  {
    title: "Chat Logs",
    icon: <Archive />,
    href: "/chatbot/{{id}}/logs",
  },
  {
    title: "Train",
    icon: <Network />,
    href: "/chatbot/{{id}}/train",
    children: [
      {
        title: "Files",
        href: "/chatbot/{{id}}/train?data-source=files",
        icon: <File />,
      },
      {
        title: "Text",
        href: "/chatbot/{{id}}/train?data-source=text",
        icon: <AlignCenter />,
      },
      {
        title: "Website",
        href: "/chatbot/{{id}}/train?data-source=website",
        icon: <Globe />,
      },
    ],
  },
  {
    title: "Add To Your Website",
    icon: <SeparatorVertical />,
    href: "/chatbot/{{id}}/add-website",
  },
  {
    title: "Settings",
    icon: <Settings />,
    href: "/settings/model",
    children: [
      {
        title: "Model",
        href: "/chatbot/{{id}}/settings/model",
        icon: <ComponentIcon />,
      },
      {
        title: "Chat Interface",
        href: "/chatbot/{{id}}/settings/chat-interface",
        icon: <ComponentIcon />,
      },
    ],
  },
];
