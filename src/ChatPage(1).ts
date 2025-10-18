import { useState, useRef, useEffect } from "react";
import logo from "./PPTlogo.svg";
import userAvatar from "./logo.svg";
import ReactMarkdown from "react-markdown";
import React from "react";

const parseTextWithNewlines = (text: string) => {
  return text.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      {index < text.split("\n").length - 1 && <br />}
    </React.Fragment>
  ));
};

const WEBHOOK_URL =
  "http://localhost:5678/webhook-test/7ff7d1e0-db68-44ab-9314-772a918681b0";
const MARKDOWN_WEBHOOK_URL =
  "http://localhost:5678/webhook-test/55d73eee-7e12-49ed-94e4-72bc3da91bab";

export function ChatPage({
  evaluationCriteria,
  generateNewCriteria,
  shouldClear,
  onClearComplete,
}: {
  evaluationCriteria: any;
  generateNewCriteria: (prompt: string) => Promise<void>;
  shouldClear: boolean;
  onClearComplete: () => void;
}) {
  const [messages, setMessages] = useState<{
    sender: "user" | "ai";
    text: string;
    fileUrl?: string;
    fileType?: string;
  }[]>([]);
  const [inputText, setInputText] = useState("");
  const [markdownText, setMarkdownText] = useState(
    "# Markdown编辑器\n输入Markdown代码..."
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const markdownSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMarkdownText("");
  }, []);

  useEffect(() => {
    if (shouldClear) {
      setMessages([]);
      setMarkdownText("");
      setInputText("");
      onClearComplete();
    }
  }, [shouldClear]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputText.trim() === "") return;
    const newUserMessage = { sender: "user", text: inputText };
    setMessages([...messages, newUserMessage]);
    setInputText("");

    await generateNewCriteria(inputText);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputText }),
      });

      if (!response.ok) {
        console.error("Webhook 请求失败:", response.statusText);
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "请求出错，请稍后重试。" },
        ]);
      } else {
        const data = await response.json();
        if (data.output) {
          setMessages((prev) => [
            ...prev,
            { sender: "ai", text: data.output },
          ]);
          setMarkdownText(data.output);
        } else {
          setMessages((prev) => [
            ...prev,
            { sender: "ai", text: "响应格式错误，请稍后重试。" },
          ]);
        }
      }
    } catch (error) {
      console.error("Webhook 请求出错:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "请求出错，请稍后重试。" },
      ]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileUrl = event.target?.result as string;
      const fileType = file.type.split("/")[0];

      const newFileMessage = {
        sender: "user",
        text: `上传了${fileType === "image" ? "图片" : "文件"}: ${file.name}`,
        fileUrl,
        fileType,
      };

      setMessages([...messages, newFileMessage]);

      setTimeout(() => {
        const aiResponse = {
          sender: "ai",
          text: `已收到您上传的${fileType === "image" ? "图片" : "文件"}，正在处理...`,
        };
        setMessages((prev) => [...prev, newFileMessage, aiResponse]);
        setMarkdownText(aiResponse.text);
      }, 800);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMarkdown = async () => {
    if (markdownText.trim() === "") return;

    const mdContent = `${markdownText}`;

    setMessages((prev) => [...prev, { sender: "user", text: mdContent }]);
    setMarkdownText("");

    try {
      const response = await fetch(MARKDOWN_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown: mdContent }),
      });

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "Markdown Webhook 请求失败，请稍后重试。" },
        ]);
      } else {
        const data = await response.json();
        if (data.output) {
          setMessages((prev) => [
            ...prev,
            { sender: "ai", text: data.output },
          ]);
          const newPageUrl = "http://localhost:3030/";
          window.open(newPageUrl, "_blank");
        } else {
          setMessages((prev) => [
            ...prev,
            { sender: "ai", text: "Markdown Webhook 响应无内容" },
          ]);
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Markdown Webhook 请求出错，请稍后重试。" },
      ]);
    }
  };

  const handleMouseEnter = () => {
    if (markdownSectionRef.current) {
      markdownSectionRef.current.classList.add("expanded");
    }
  };

  const handleMouseLeave = () => {
    if (markdownSectionRef.current) {
      markdownSectionRef.current.classList.remove("expanded");
    }
  };

  return (
    <div className="chat-page">
      <div
        className="markdown-section"
        ref={markdownSectionRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="markdown-container">
          <div className="markdown-editor">
            <h3>Markdown编辑区</h3>
            <textarea
              value={markdownText}
              onChange={(e) => setMarkdownText(e.target.value)}
              placeholder="在此输入Markdown代码..."
              className="markdown-input"
            />
          </div>
          <div className="markdown-preview">
            <h3>实时预览</h3>
            <div className="preview-container">
              <ReactMarkdown>{markdownText}</ReactMarkdown>
            </div>
            <button
              className={`markdown-send-button ${
                markdownText.trim() === "" ? "disabled" : ""
              }`}
              onClick={handleSendMarkdown}
              disabled={markdownText.trim() === ""}
            >
              发送Markdown内容
            </button>
          </div>
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.sender === "ai" && (
                <img
                  src={logo}
                  alt="AI 标志"
                  className="ai-logo"
                />
              )}
              <div>
                {message.fileType === "image" ? (
                  <img
                    src={message.fileUrl}
                    alt="上传的图片"
                    className="uploaded-image"
                  />
                ) : message.fileType ? (
                  <a
                    href={message.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="uploaded-file"
                  >
                    {parseTextWithNewlines(message.text)}
                  </a>
                ) : (
                  <div className="message-content">
                    {message.text.split("\n").map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                )}
              </div>
              {message.sender === "user" && (
                <img
                  src={userAvatar}
                  alt="用户头像"
                  className="user-logo"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    marginLeft: "12px",
                    objectFit: "contain",
                  }}
                />
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="chat-input">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="输入你的消息..."
            className="chat-input-field"
          />
          <div className="file-upload-container">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*, .pdf, .doc, .docx, .xlsx"
              onChange={handleFileUpload}
              style={{ display: "none" }}
              id="file-upload"
            />
            <label htmlFor="file-upload" className="upload-button">
              <i className="fa-solid fa-folder-open" aria-hidden="true"></i>
            </label>
          </div>
          <button
            id="send-button"
            type="submit"
            className={`chat-send-button ${inputText.trim() === "" ? "disabled" : ""}`}
            disabled={inputText.trim() === ""}
          >
            发送
          </button>
        </form>
      </div>
    </div>
  );
}