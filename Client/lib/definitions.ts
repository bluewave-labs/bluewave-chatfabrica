export type User = {
  id: string;
  email: string;
  isActive: boolean;
  customMessageCredits: number;
  customCharactersPerChatbot: number;
  planId: string;
  chatBots: any[];
  userPlans: any[];
};

export type Chatbot = {
  id: string;
  name: string;
  assistantId: string;
  files: Record<string, string>[];
  visibility: "Public" | "Private";
  lastTrainAt: Date;
  instructions: string;
  charactersCount: number;
  status: "Active" | "Failed";
  model: string;
  user: User | null;
  userId: string | null;
  displayName: string | null;
  initialMessage: string;
  messagePlaceholder: string | null;
  footer: string | null;
  chatIcon: string | null;
  profileImage: string | null;
  messageColor: string | null;
  alignButton: "Left" | "Right";
  chatBubbleButtonColor: string | null;
  initialMessageShowTime: number;
  temperature: number;
  theme: "Light" | "Dark";
  createdAt: Date;
  updatedAt: Date;
  chatLogs: ChatLog[];
  iconMessage: string | null;
  crawlUrls: string[];
  trainingDatas: {
    fileId: string;
    name: string;
    url: string;
    charactersCount: number;
    body: string;
  }[];
  crawlDetails: {
    fileId: string;
    name: string;
    url: string;
    charactersCount: number;
  }[];
  chatSuggestions: string[];
  includeChatFabricaAttribution: boolean;
};

export type ChatLog = {
  id: string;
  chatbotId: string;
  messages: {
    role: string;
    content: string;
  }[];
  response: string;
  session: string;
  user: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserPlan = {
  id: string;
  userId: string;
  planId: string;
  status: boolean;
  plan: Plan;
  createdAt: Date;
  subscriptionId: string;
  initialChatbotCount: number;
  initialMessageCredits: number;
  initialCharactersPerChatbot: number;
  currentChatbotCount: number;
  currentMessageCredits: number;
  price: number;
  expiresAt: Date;
};

export type Plan = {
  id: string;
  name: string;
  messageCredits: number;
  chatbots: number;
  charactersPerChatbot: number;
  linksToTrainOn: string;
  embedOnWebsites: boolean;
  uploadFiles: boolean;
  viewConversationHistory: boolean;
  isExtraPacket: boolean;
  captureLeads?: boolean;
  variantId: string;
  isFree: boolean;
  integrations: {
    zapier?: boolean;
    slack?: boolean;
    wordpress?: boolean;
    whatsapp?: boolean;
    messenger?: boolean;
    gpt4Option?: boolean;
  };
  type: "Monthly" | "Yearly";
  price: number;
};

export type Docs = {
  id: string;
  name: string;
  characterCount: number;
  url: string;
};

export type Metadata = {
  source: string;
  title: string;
  language: string | null;
};

export type Crawl = {
  data: Docs[];
  fileId: string;
  status: "success" | "error";
};

export type MessageResponse = {
  data: {
    thread_id: string;
    assistant_id: string;
    content: {
      type: string;
      text: {
        value: string;
      };
    }[];
    run_id: string;
    role: string;
  }[];
};
