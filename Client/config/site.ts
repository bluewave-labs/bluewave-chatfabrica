export const siteConfig = {
  title: "ChatFabrica | Custom ChatGPT for your data",
  description:
    "Build an AI chatbot from your knowledge base and add it to your website or interact with it through our API.",
  keywords:
    "chatbot,chatbot api,chatbot platform,chatbot builder,chatbot maker,chatbot software,chatbot development,chatbot developer,chatbot development company,chatbot development services,chatbot development tools,chatGPT,chatGPT api,chatGPT platform",
  metadataBase: new URL("https://app.chatfabrica.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://app.chatfabrica.com",
    siteName: "ChatFabrica | Custom ChatGPT for your data",
    images: [
      {
        url: `/og-image.png`,
        width: 1200,
        height: 630,
        alt: "ChatFabrica | Custom ChatGPT for your data",
      },
    ],
  },
  icons: [
    {
      url: "/favicon.ico",
      rel: "icon",
      type: "image/x-icon",
    },
  ],
};
