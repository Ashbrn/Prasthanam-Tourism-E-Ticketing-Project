import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import apiClient from "../services/api";
import { useChatStore } from "../store/chatStore";
import Header from "../components/Header";

export default function ChatPage() {
  const { t } = useTranslation();
  const { sessionId, messages, isLoading, language, addMessage, setLoading, initSession } = useChatStore();
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initSession();
    addMessage("bot", t("greeting"));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    addMessage("user", userInput);
    setUserInput("");
    setLoading(true);

    try {
      const response = await apiClient.post("/chat/message", {
        sessionId,
        message: userInput,
        language: language || "en",
      });

      const { reply, actions } = response.data;
      addMessage("bot", reply, actions);
    } catch (error) {
      addMessage("bot", t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="h-screen bg-gray-100 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.from === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-800 shadow"
                }`}
              >
                <p>{msg.text}</p>
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {msg.actions.map((action, idx) => {
                      if (action.type === "quick_replies") {
                        return (
                          <div key={idx} className="flex gap-2 flex-wrap">
                            {action.payload.items.map((item: any) => (
                              <button
                                key={item.value}
                                onClick={() => {
                                  setUserInput(item.label);
                                  addMessage("user", item.label);
                                }}
                                className="text-xs bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600"
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 shadow px-4 py-2 rounded-lg">
                <div className="loading"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="bg-white border-t p-4">
          <div className="flex gap-2 max-w-2xl mx-auto">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={t("search")}
              className="input flex-1"
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading} className="btn-primary">
              {t("send") || "Send"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
