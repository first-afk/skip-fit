"use client";
import { ArrowUp, X } from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
// import Button from "./ui/Button";

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const handleClick = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const { user, allActivityLogs } = useAppContext();

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  return (
    <div className="fixed bottom-25 lg:bottom-5 right-10 shadow-lg transition-discrete transition-all">
      {isOpen ? (
        <div className="bg-emerald-800 min-h-60 max-h-72 w-80 rounded-lg overflow-hidden transition-opacity duration-300 ease-in-out z-99 flex flex-col justify-between">
          <div className="flex justify-between items-start text-sm border-b-2 border-slate-50 w-full p-2 mb-2">
            <p>What would you like help with?</p>

            <div
              onClick={handleClose}
              className="rounded-full border-2 border-slate-50 w-fit cursor-pointer"
            >
              <X className="text-slate-50 size-4" />
            </div>
          </div>

          <div className="px-3 flex flex-1 flex-col items-center space-y-1.5 max-h-60 overflow-y-auto chat-section">
            {messages.map((message) => (
              <div
                className="w-full flex items-center message-container"
                key={message.id}
                style={{
                  justifyContent:
                    message.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  className="w-full px-2 py-2 rounded-lg"
                  style={{
                    backgroundColor:
                      message.role === "user" ? "#000" : "#e5e5e5",
                    color: message.role === "user" ? "#fff" : "#000",
                  }}
                >
                  {message.parts.map((part, index) =>
                    part.type === "text" ? (
                      <div key={index}>
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => (
                              <p
                                className="text-sm"
                                style={{ margin: "0 0 8px 0" }}
                              >
                                {children}
                              </p>
                            ),
                            ul: ({ children }) => (
                              <ul
                                style={{
                                  margin: "0 0 8px 0",
                                  paddingLeft: "20px",
                                }}
                              >
                                {children}
                              </ul>
                            ),
                            li: ({ children }) => (
                              <li style={{ marginBottom: "4px" }}>
                                {children}
                              </li>
                            ),
                            strong: ({ children }) => (
                              <strong style={{ fontWeight: "600" }}>
                                {children}
                              </strong>
                            ),
                          }}
                        >
                          {part.text}
                        </ReactMarkdown>
                      </div>
                    ) : null,
                  )}
                </div>
              </div>
            ))}

            {status === "streaming" && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="animate-pulse"
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#999",
                      }}
                    />
                    <div
                      className="animate-pulse"
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#999",
                      }}
                    />
                    <div
                      className="animate-pulse"
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#999",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="w-full px-3 py-2 text-xs text-red-100 rounded-lg">
                Error: {error.message}
              </div>
            )}
          </div>

          <div className="flex rounded items-center justify-between">
            <form
              className="p-3 w-full border-t border-[#e5e5e5] flex gap-2 items-center"
              onSubmit={(e) => {
                e.preventDefault();
                if (input.trim()) {
                  sendMessage(
                    { text: input },
                    {
                      body: {
                        userContext: {
                          name: user?.username,
                          goal: user?.goal,
                          activity: allActivityLogs,
                        },
                      },
                    },
                  );
                  setInput("");
                }
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={status !== "ready"}
                placeholder="Ask a question"
                className="flex-1 px-3 py-4 rounded-3xl border border-gray-200 bg-white text-black text-sm outline-0"
              />
              <button
                type="submit"
                disabled={status !== "ready"}
                className="w-10 h-10 rounded-lg text-white flex items-center justify-center"
                style={{
                  backgroundColor: status !== "ready" ? "#e5e5e5" : "#000",
                  cursor: status !== "ready" ? "not-allowed" : "pointer",
                }}
              >
                <ArrowUp />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <div
            onClick={handleClick}
            className="bg-emerald-500 font-medium h-10 w-45 rounded-lg rounded-br-none p-2 flex items-center justify-center cursor-pointer motion-safe:animate-bounce hover:animate-none relative"
          >
            <p>Hi, chat with Unix</p>
            <div className="absolute bottom-0 right-0 translate-x-full w-0 h-0 border-b-12 border-emerald-500 border-r-12 border-r-transparent"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
