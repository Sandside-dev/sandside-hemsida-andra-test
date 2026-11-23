"use client";

import { MessageCircle } from "lucide-react";

export function OpenChatButton() {
  return (
    <button
      className="button button-secondary"
      type="button"
      onClick={() => window.dispatchEvent(new Event("sandside:open-chat"))}
    >
      <MessageCircle aria-hidden="true" size={19} />
      Testa chattbotten
    </button>
  );
}
