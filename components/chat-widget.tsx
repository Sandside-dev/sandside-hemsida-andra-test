"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { chatDemo, getDemoAnswer } from "@/lib/chat-demo";

type Message = { id: string; sender: "bot" | "user"; text: string };
const starter: Message[] = [{ id: "welcome", sender: "bot", text: chatDemo.greeting }];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") return starter;
    try {
      const saved = window.sessionStorage.getItem("sandside-demo-chat");
      return saved ? (JSON.parse(saved) as Message[]) : starter;
    } catch {
      return starter;
    }
  });
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const messageId = useRef(1);
  const titleId = useId();

  useEffect(() => {
    try {
      window.sessionStorage.setItem("sandside-demo-chat", JSON.stringify(messages));
    } catch {
      // Ignore privacy-mode storage failures.
    }
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages]);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  function closeChat() {
    setOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const stamp = String(messageId.current++);
    setMessages((current) => [
      ...current,
      { id: `${stamp}-user`, sender: "user", text: trimmed },
      { id: `${stamp}-bot`, sender: "bot", text: getDemoAnswer(trimmed) },
    ]);
    setInput("");
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    send(input);
  }

  useEffect(() => {
    function openFromPage() {
      setOpen(true);
    }
    window.addEventListener("sandside:open-chat", openFromPage);
    return () => window.removeEventListener("sandside:open-chat", openFromPage);
  }, []);

  return (
    <div className="chat-layer">
      {open && (
        <section
          className="chat-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          onKeyDown={(event) => {
            if (event.key === "Escape") closeChat();
          }}
        >
          <header className="chat-header">
            <div>
              <p className="eyebrow">Exempelchatt</p>
              <h2 id={titleId}>{chatDemo.businessName}</h2>
            </div>
            <button className="icon-button" type="button" onClick={closeChat} aria-label="Stäng chatten">
              <X aria-hidden="true" size={21} />
            </button>
          </header>
          <div className="chat-disclaimer">Fiktiv demodata · inget skickas till ett företag</div>
          <div className="chat-messages" aria-live="polite" aria-label="Konversation">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <span className="sr-only">{message.sender === "bot" ? "Chatten" : "Du"}: </span>
                {message.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="chat-suggestions" aria-label="Exempelfrågor">
            {chatDemo.suggestions.map((suggestion) => (
              <button type="button" key={suggestion} onClick={() => send(suggestion)}>
                {suggestion}
              </button>
            ))}
          </div>
          <form className="chat-form" onSubmit={submit}>
            <label className="sr-only" htmlFor="chat-message">Skriv din fråga</label>
            <input
              ref={inputRef}
              id="chat-message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Skriv en fråga …"
              autoComplete="off"
            />
            <button className="icon-button send-button" type="submit" aria-label="Skicka fråga" disabled={!input.trim()}>
              <Send aria-hidden="true" size={19} />
            </button>
          </form>
        </section>
      )}
      <button
        ref={triggerRef}
        className="chat-trigger"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={open ? titleId : undefined}
        data-testid="chat-trigger"
      >
        {open ? <X aria-hidden="true" /> : <MessageCircle aria-hidden="true" />}
        <span>{open ? "Stäng" : "Testa chatten"}</span>
      </button>
    </div>
  );
}
