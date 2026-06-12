"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ContactMessage } from "@/types/cms";
import { Mail, MailOpen } from "lucide-react";

export function MessagesManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    setMessages(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleRead = async (msg: ContactMessage) => {
    const supabase = createClient();
    await supabase.from("contact_messages").update({ read: !msg.read }).eq("id", msg.id);
    load();
  };

  if (loading) return <p className="text-white/50">Loading messages...</p>;

  return (
    <div className="space-y-3">
      {messages.length === 0 ? (
        <p className="text-white/40">No messages yet</p>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-xl border p-4 ${msg.read ? "border-white/5 bg-white/[0.02]" : "border-cyan-500/20 bg-cyan-500/5"}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white">{msg.name}</p>
                  <span className="text-xs text-white/40">{msg.email}</span>
                </div>
                {msg.subject && <p className="mt-1 text-sm font-medium text-white/70">{msg.subject}</p>}
                <p className="mt-2 text-sm text-white/60">{msg.message}</p>
                <p className="mt-2 text-xs text-white/30">
                  {new Date(msg.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => toggleRead(msg)}
                className="shrink-0 rounded-lg border border-white/10 p-2 text-white/60 hover:bg-white/5"
                title={msg.read ? "Mark unread" : "Mark read"}
              >
                {msg.read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4 text-cyan-400" />}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
