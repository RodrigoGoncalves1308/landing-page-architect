import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { AudioLines, MessageCircle, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

const HISTORY_KEY = "pulso-chat-history-v1";
const suggestions = ["Recomenda-me música", "O que é o Pulso?", "Explorar artistas portugueses"];
const welcome = "Olá! Sou o assistente do Pulso. Posso ajudar-te a descobrir música, explorar artistas e encontrar novas sonoridades. O que te apetece ouvir?";

function ChatPanel({ initialMessages, close }: { initialMessages: UIMessage[]; close: () => void }) {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, error, stop } = useChat({
    id: "pulso-single-conversation",
    messages: initialMessages,
    transport,
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(messages)); } catch { /* Private browsing may block storage. */ }
  }, [messages, status]);

  useEffect(() => { textareaRef.current?.focus(); }, [status]);

  const submit = (text: string) => {
    const clean = text.trim();
    if (!clean || busy) return;
    void sendMessage({ text: clean });
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  return (
    <section role="dialog" aria-modal="false" aria-label="Ajuda Chat Pulso" className="chat-panel fixed z-[61] flex flex-col overflow-hidden border border-chat-border bg-chat-surface/95 text-chat-foreground shadow-[var(--shadow-chat)] backdrop-blur-2xl">
      <header className="flex h-16 shrink-0 items-center gap-3 border-b border-chat-border px-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"><AudioLines className="size-4" /></span>
        <div className="min-w-0 flex-1"><h2 className="text-sm font-bold leading-5">Pulso · Ajuda Chat</h2><p className="text-[11px] text-chat-muted">O teu espaço para descobrir música</p></div>
        <Button type="button" variant="ghost" size="icon" className="text-chat-muted hover:bg-chat-soft hover:text-chat-foreground" onClick={close} aria-label="Fechar chat" title="Fechar chat"><X /></Button>
      </header>

      <Conversation className="min-h-0 bg-chat-surface/40">
        <ConversationContent className="gap-5 px-4 py-5">
          <Message from="assistant" className="max-w-full">
            <p className="mb-1 text-[11px] font-bold text-chat-muted">PULSO</p>
            <MessageContent className="!text-chat-foreground"><MessageResponse>{welcome}</MessageResponse></MessageContent>
          </Message>
          {messages.map((message) => (
            <Message key={message.id} from={message.role} className="max-w-[90%]">
              {message.role === "assistant" && <p className="text-[11px] font-bold text-chat-muted">PULSO</p>}
              {message.parts.map((part, index) => part.type === "text" ? (
                <MessageContent key={index} className={message.role === "user" ? "!rounded-lg !bg-chat-user !text-chat-user-foreground" : "!text-chat-foreground"}>
                  <MessageResponse>{part.text}</MessageResponse>
                </MessageContent>
              ) : null)}
            </Message>
          ))}
          {status === "submitted" && <div className="text-sm text-chat-muted"><Shimmer>A pensar na tua música…</Shimmer></div>}
          {error && <p role="alert" className="text-sm text-destructive">{error.message || "Não foi possível responder. Tenta novamente."}</p>}
          {!messages.length && <div className="flex flex-wrap gap-2 pt-1">{suggestions.map((text) => <Button key={text} variant="outline" size="sm" className="h-auto whitespace-normal rounded-full border-chat-border bg-chat-soft px-3 py-2 text-left text-xs text-chat-foreground shadow-none hover:bg-chat-border hover:text-chat-foreground" onClick={() => submit(text)}>{text}</Button>)}</div>}
        </ConversationContent>
        <ConversationScrollButton className="border-chat-border bg-chat-surface text-chat-foreground" aria-label="Ir para a última mensagem" />
      </Conversation>

      <div className="shrink-0 border-t border-chat-border bg-chat-surface px-3 py-3">
        <PromptInput onSubmit={({ text }) => submit(text)} className="border-chat-border bg-chat-input text-chat-foreground shadow-none">
          <PromptInputTextarea ref={textareaRef} aria-label="Mensagem" placeholder="Pergunta-me sobre música…" className="min-h-12 max-h-28 text-sm placeholder:text-chat-muted" />
          <PromptInputFooter className="justify-end pt-0"><PromptInputSubmit status={status} onStop={stop} disabled={!busy && status !== "error" && false} className="size-8 rounded-md bg-primary text-primary-foreground hover:bg-primary-hover" /></PromptInputFooter>
        </PromptInput>
      </div>
    </section>
  );
}

export function PulsoChat() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      if (Array.isArray(stored)) setInitialMessages(stored.filter((item) => item && typeof item.id === "string" && ["user", "assistant"].includes(item.role) && Array.isArray(item.parts)));
    } catch { /* Ignore invalid saved history. */ }
    setLoaded(true);
  }, []);

  return <>
    {open && loaded && <ChatPanel initialMessages={initialMessages} close={() => setOpen(false)} />}
    <Button type="button" className="fixed bottom-24 right-4 z-[62] h-11 gap-2.5 rounded-full bg-primary px-4 text-xs font-bold text-primary-foreground shadow-[var(--shadow-chat-trigger)] hover:bg-primary-hover md:right-6" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Fechar Ajuda Chat" : "Abrir Ajuda Chat"} aria-controls="pulso-chat">
      {open ? <X className="size-4" /> : <MessageCircle className="size-4" />}
      <span>AJUDA CHAT</span>
    </Button>
  </>;
}