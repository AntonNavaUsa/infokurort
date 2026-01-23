import { useRef, useEffect, useState } from "react";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAIChat } from "@/hooks/useAIChat";

const quickSuggestions = [
  "Ищу инструктора для ребёнка 7 лет",
  "Хочу попробовать фрирайд впервые",
  "Групповые занятия для начинающих",
  "Нужен гид на целый день",
];

export function ChatInterface() {
  const { messages, isLoading, sendMessage } = useAIChat();
  const [input, setInput] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Добавляем приветственное сообщение при загрузке
  useEffect(() => {
    if (messages.length === 0) {
      // Имитируем начальное сообщение от AI
      const welcomeMsg = {
        role: 'assistant' as const,
        content: "Привет! Я Ski Concierge, ваш помощник по бронированию инструкторов на горнолыжных курортах Сочи. Опишите, что вы ищете — я задам пару уточняющих вопросов и помогу выбрать лучший вариант! 🎿",
        timestamp: new Date(),
      };
      // Временно используем прямую установку в состояние
      setHasInteracted(false);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (hasInteracted) {
      scrollToBottom();
    }
  }, [messages, hasInteracted]);

  const handleSubmit = async (text: string) => {
    if (!text.trim()) return;
    
    setHasInteracted(true);
    setInput("");
    
    await sendMessage(text);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Chat Container */}
      <div className="bg-card rounded-2xl shadow-elevated border border-border/50 overflow-hidden">
        {/* Messages */}
        <div className="h-[400px] overflow-y-auto p-4 space-y-4">
          {/* Welcome message if no messages yet */}
          {messages.length === 0 && (
            <div className="flex gap-3 animate-fade-in">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-frost rounded-2xl rounded-bl-md px-4 py-3 text-sm text-foreground">
                Привет! Я Ski Concierge, ваш помощник по бронированию инструкторов на горнолыжных курортах Сочи. Опишите, что вы ищете — я задам пару уточняющих вопросов и помогу выбрать лучший вариант! 🎿
              </div>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}-${message.timestamp.getTime()}`}
              className={cn(
                "flex gap-3 animate-fade-in",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-frost text-foreground rounded-bl-md"
                )}
              >
                {message.content}
              </div>
              {message.role === "user" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-frost rounded-2xl rounded-bl-md px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border/50 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(input);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Опишите ваш запрос..."
              className="flex-1 bg-frost border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              disabled={isLoading}
            />
            <Button
              type="submit"
              variant="hero"
              size="icon"
              className="h-12 w-12 rounded-xl"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>

      {/* Quick Suggestions */}
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {quickSuggestions.map((suggestion) => (
          <Button
            key={suggestion}
            variant="suggestion"
            size="sm"
            onClick={() => handleSubmit(suggestion)}
            disabled={isLoading}
            className="text-xs"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}
