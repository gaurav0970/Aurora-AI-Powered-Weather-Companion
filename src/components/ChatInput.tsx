import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="glass-panel rounded-2xl p-2 aurora-glow animate-float">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the weather in any city..."
            disabled={disabled}
            className="flex-1 bg-transparent px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none text-base"
          />
          <Button
            type="submit"
            disabled={!input.trim() || disabled}
            size="icon"
            className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
