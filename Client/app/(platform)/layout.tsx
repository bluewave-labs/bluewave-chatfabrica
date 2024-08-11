import Script from "next/script";
import { Toaster } from "sonner";

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster />
      {children}
      <Script id="chatbot-config">
        {`window.embeddedChatbotConfig = {
          chatbotId: "6827349a-7747-45d3-a559-860d2f516ee7",
          domain: "app.chatfabrica.com",
          };
        `}
      </Script>
      <Script
        id="chatbot-script"
        src="https://app.chatfabrica.com/chatbot.min.js"
        defer
      />
    </>
  );
};

export default PlatformLayout;
