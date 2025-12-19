import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Languages, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"chat" | "translate">("chat");
  const [targetLang, setTargetLang] = useState<"en" | "ur">("ur");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, userMessage].map(m => ({
              role: m.role,
              content: m.content,
            })),
            type: mode,
            targetLanguage: mode === "translate" ? targetLang : undefined,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let buffer = "";

      const updateAssistant = (content: string) => {
        assistantContent = content;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content: assistantContent } : m
            );
          }
          return [...prev, { role: "assistant", content: assistantContent }];
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              updateAssistant(assistantContent);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("AI Assistant error:", error);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
          "bg-gradient-to-r from-primary to-primary/80 hover:scale-110",
          isOpen && "rotate-90"
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-primary-foreground" />
        ) : (
          <MessageCircle className="w-6 h-6 text-primary-foreground" />
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[500px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              {t("aiAssistant")}
            </h3>
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant={mode === "chat" ? "secondary" : "ghost"}
                onClick={() => setMode("chat")}
                className="text-xs"
              >
                Chat
              </Button>
              <Button
                size="sm"
                variant={mode === "translate" ? "secondary" : "ghost"}
                onClick={() => setMode("translate")}
                className="text-xs flex items-center gap-1"
              >
                <Languages className="w-3 h-3" />
                {t("translate")}
              </Button>
              {mode === "translate" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setTargetLang(targetLang === "en" ? "ur" : "en")}
                  className="text-xs ml-auto"
                >
                  → {targetLang === "en" ? "English" : "اردو"}
                </Button>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-8">
                {mode === "chat" ? (
                  <p>
                    {language === "en"
                      ? "Hello! I'm your BijliTrack assistant. How can I help you today?"
                      : "السلام علیکم! میں آپ کا بجلی ٹریک اسسٹنٹ ہوں۔ میں آج آپ کی کیسے مدد کر سکتا ہوں؟"}
                  </p>
                ) : (
                  <p>
                    {language === "en"
                      ? `Type text to translate to ${targetLang === "en" ? "English" : "Urdu"}`
                      : `${targetLang === "en" ? "انگریزی" : "اردو"} میں ترجمہ کرنے کے لیے ٹائپ کریں`}
                  </p>
                )}
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] p-3 rounded-2xl text-sm",
                  msg.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted rounded-bl-md"
                )}
                dir={msg.content.match(/[\u0600-\u06FF]/) ? "rtl" : "ltr"}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                {language === "en" ? "Thinking..." : "سوچ رہا ہوں..."}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <form
              onSubmit={e => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={t("askQuestion")}
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
