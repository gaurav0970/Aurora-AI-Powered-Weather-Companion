import { useState, useRef, useEffect } from "react";
import { CloudSun } from "lucide-react";
import AuroraBackground from "./AuroraBackground";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Aurora = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("weather-chat", {
        body: { message: content },
      });

      if (error) {
        console.error("Edge function error:", error);
        if (error.message?.includes("429")) {
          toast.error("Rate limit exceeded. Please try again in a moment.");
        } else if (error.message?.includes("402")) {
          toast.error("Usage limit reached. Please check your account.");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
        return;
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "I couldn't get the weather information right now.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to connect. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <AuroraBackground />

      {/* Header */}
      <header className="relative z-10 pt-8 pb-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="p-3 rounded-2xl bg-primary/20 border border-primary/30">
            <CloudSun className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient">
            Aurora
          </h1>
        </div>
        <p className="text-muted-foreground text-sm md:text-base">
          Your AI-powered weather companion
        </p>
      </header>

      {/* Chat area - centered */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-6">
        <div className="w-full max-w-2xl flex flex-col h-full max-h-[calc(100vh-240px)]">
          {/* Messages container */}
          {messages.length > 0 ? (
            <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} role={msg.role} content={msg.content} />
              ))}
              {isLoading && (
                <ChatMessage role="assistant" content="" isLoading />
              )}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center mb-6">
              <div className="text-center space-y-4 animate-fade-in-up">
                <div className="inline-flex p-6 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <CloudSun className="w-16 h-16 text-primary animate-float" />
                </div>
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  Welcome to Aurora
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Ask me about the weather in any city around the world. 
                  Try something like "What's the weather in Pune?" or "Is it raining in Nashik?"
                </p>
              </div>
            </div>
          )}

          {/* Chat input - always centered */}
          <div className="w-full">
            <ChatInput onSend={handleSendMessage} disabled={isLoading} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center">
        <p className="text-muted-foreground/60 text-xs">
          Powered by AI • Real-time weather data
        </p>
      </footer>
    </div>
  );
};

export default Aurora;
