import * as React from "react";
import { X, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import supportAgent from "@/assets/chat-support-agent.webp";

interface ChatMessage {
  id: number;
  from: "support" | "user";
  text: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    from: "support",
    text: "Olá! 👋 Sou do suporte do Ember.News. Como posso ajudar você hoje?",
  },
];

export function ChatSupport() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const userMessage: ChatMessage = { id: Date.now(), from: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setDraft("");

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: "support",
          text: "Obrigado pela mensagem! Nossa equipe vai te responder em breve por e-mail.",
        },
      ]);
    }, 900);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div
          role="dialog"
          aria-label="Chat de suporte"
          className="animate-in fade-in slide-in-from-bottom-4 flex h-[28rem] w-[20rem] flex-col overflow-hidden rounded-[10px] border border-border bg-card shadow-2xl duration-200 sm:w-[22rem]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-primary px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 ring-primary-foreground/40">
                <img
                  src={supportAgent}
                  alt="Atendente de suporte usando fone de ouvido"
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="flex h-2.5 w-2.5 rounded-full bg-breaking-strip" />
              <div>
                <p className="font-display text-sm font-bold text-primary-foreground">
                  Suporte Ember.News
                </p>
                <p className="text-[0.65rem] uppercase tracking-[0.1em] text-primary-foreground/80">
                  Online agora
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar chat"
              className="flex h-7 w-7 items-center justify-center rounded-[4px] text-primary-foreground transition-colors hover:bg-primary-foreground/15"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-background px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.from === "user" ? "justify-end" : "justify-start"
                )}
              >
                <p
                  className={cn(
                    "max-w-[85%] rounded-[8px] px-3 py-2 text-sm leading-relaxed",
                    message.from === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  )}
                >
                  {message.text}
                </p>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-border bg-card px-3 py-3">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Digite sua mensagem..."
              aria-label="Mensagem"
              className="h-9 flex-1 rounded-[6px] border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              aria-label="Enviar mensagem"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar chat de suporte" : "Abrir chat de suporte"}
        className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <img
            src={supportAgent}
            alt="Atendente de suporte usando fone de ouvido"
            className="h-full w-full object-cover"
          />
        )}
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-breaking-strip">
            <span className="absolute h-full w-full animate-ping rounded-full bg-breaking-strip opacity-75" />
          </span>
        )}
      </button>
    </div>
  );
}
