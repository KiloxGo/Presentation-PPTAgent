// ChatPage.tsx
import { useState, useRef, useEffect } from "react";
import logo from "./PPTlogo.svg";
import userAvatar from "./logo.svg";
import ReactMarkdown from "react-markdown";
import React from "react";
import useSlidevPageNumberListener from './useSlidevPageNumberListener';


const parseTextWithNewlines = (text: string) => {
  return text.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      {index < text.split("\n").length - 1 && <br />}
    </React.Fragment>
  ));
};

const WEBHOOK_URL =
  "http://localhost:5678/webhook-test/generate-ppt-outline";
const MARKDOWN_WEBHOOK_URL =
  "http://localhost:5678/webhook-test/7523c1d8-144f-4a9a-966b-53913899af17";
const Slidev_WEBHOOK_URL =
  "http://localhost:5678/webhook-test/ca69df3e-386b-45b6-80fe-a5810363c997";

export function ChatPage({
  evaluationCriteria,
  generateNewCriteria,
  shouldClear,
  onClearComplete,
  showSlidev,
  setShowSlidev,
  messages,
  setMessages,
  fromHistory,
  setActiveSidebarItem, // 新增 prop
}: {
  evaluationCriteria: any;
  generateNewCriteria: (prompt: string) => Promise<void>;
  shouldClear: boolean;
  onClearComplete: () => void;
  showSlidev: boolean;
  setShowSlidev: React.Dispatch<React.SetStateAction<boolean>>;
  messages: { sender: "user" | "ai"; text: string; fileUrl?: string; fileType?: string }[];
  setMessages: React.Dispatch<
    React.SetStateAction<
      { sender: "user" | "ai"; text: string; fileUrl?: string; fileType?: string }[]
    >
  >;
  fromHistory: boolean;
  setActiveSidebarItem: React.Dispatch<React.SetStateAction<string>>; // 新增 prop 类型
}) {
  useSlidevPageNumberListener();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputText, setInputText] = useState("");
  const [markdownText, setMarkdownText] = useState(
    "# Markdown编辑器\n输入Markdown代码..."
  );
  const [slidevMarkdown, setSlidevMarkdown] = useState("");
  const [slidevInputText, setSlidevInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const markdownSectionRef = useRef<HTMLDivElement>(null);
  const slidevIframeRef = useRef<HTMLIFrameElement>(null);

  // Save conversation to localStorage
  const saveConversation = () => {
    if (messages.length === 0 || fromHistory) return;
    const conversations = JSON.parse(localStorage.getItem("conversations") || "[]");
    const title = messages.find((msg) => msg.sender === "user")?.text.slice(0, 30) || "New Conversation";

    const conversation = {
      id: Date.now().toString(),
      title,
      timestamp: new Date().toISOString(),
      messages,
    };
    conversations.push(conversation);
    localStorage.setItem("conversations", JSON.stringify(conversations));
  };

  useEffect(() => {
    setMarkdownText("");
  }, []);

  useEffect(() => {
    if (shouldClear) {
      saveConversation();
      setMessages([]);
      setMarkdownText("");
      setInputText("");
      onClearComplete();
    }
  }, [shouldClear]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputText.trim() === "" && !selectedFile) return;

    generateNewCriteria(inputText);

    const newUserMessage = { sender: "user", text: inputText };
    setMessages([...messages, newUserMessage]);
    setInputText("");

    let response;
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('message', inputText);
        formData.append('file', selectedFile);
        response = await fetch(WEBHOOK_URL, {
          method: "POST",
          body: formData,
        });
        setSelectedFile(null);
      } else {
        response = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: inputText }),
        });
      }

      if (!response.ok) {
        setMessages(prev => [
          ...prev,
          { sender: "ai", text: "请求出错，请稍后重试。" }
        ]);
        return;
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        setMessages(prev => [
          ...prev,
          { sender: "ai", text: "响应格式错误，请稍后重试。" }
        ]);
        return;
      }

      if (data && data.output) {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: data.output },
        ]);
        setMarkdownText(data.output); // 关键：自动粘贴到markdown区域
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "响应格式错误，请稍后重试。" },
        ]);
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { sender: "ai", text: "请求出错，请稍后重试。" }
      ]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMarkdown = async () => {
    if (markdownText.trim() === "") return;
    const mdContent = markdownText;
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
        return;
      }

      let data;
      try {
        data = await response.json();
      } catch {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "Markdown Webhook 响应格式错误，请稍后重试。" },
        ]);
        return;
      }

      if (data && data.output) {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: data.output },
        ]);
        if (slidevIframeRef.current) {
          slidevIframeRef.current.src = "http://localhost:3030/";
        }
        setShowSlidev(true);
        saveConversation();
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "PPT正在生成中，请稍侯..." },
        ]);
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

  const handleCloseIframe = () => {
    setShowSlidev(false);
    setActiveSidebarItem("home"); // 设置侧边栏为“主页”
  };

  const handleSlidevSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (slidevInputText.trim() === "") return;

    try {
      const response = await fetch(Slidev_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown: slidevInputText }),
      });

      if (!response.ok) {
        console.error("Slidev 修改请求失败:", response.statusText);
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "Slidev 修改请求出错，请稍后重试。" },
        ]);
      } else {
        const data = await response.json();
        if (data.output) {
          setMessages((prev) => [
            ...prev,
            { sender: "user", text: slidevInputText },
            { sender: "ai", text: data.output },
          ]);
          setSlidevMarkdown(data.output);
          setSlidevInputText("");
          if (slidevIframeRef.current) {
            slidevIframeRef.current.src = "http://localhost:3030/";
            console.log("Iframe src 设置为:", slidevIframeRef.current.src);
          }
        } else {
          setMessages((prev) => [
            ...prev,
            { sender: "ai", text: "Slidev 修改响应无内容" },
          ]);
        }
      }
    } catch (error) {
      console.error("Slidev 修改请求出错:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Slidev 修改请求出错，请稍后重试。" },
      ]);
    }

    saveConversation();
  };

  return (
    <div className="chat-page">
      {!showSlidev && (
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
                className={`markdown-send-button ${markdownText.trim() === "" ? "disabled" : ""
                  }`}
                onClick={handleSendMarkdown}
                disabled={markdownText.trim() === ""}
              >
                发送Markdown内容
              </button>
            </div>
          </div>
        </div>
      )}
      {showSlidev && (
        <div className="iframe-container">
          <button className="close-button" onClick={handleCloseIframe}>×</button>
          <iframe
            ref={slidevIframeRef}
            src="http://localhost:3030/"
            style={{ width: "100%", height: "90vh" }}
          />
          <form onSubmit={handleSlidevSubmit} className="slidev-input">
            <input
              type="text"
              value={slidevInputText}
              onChange={(e) => setSlidevInputText(e.target.value)}
              placeholder="输入修改 Slidev 的代码..."
              className="slidev-input-field"
            />
            <button
              id="slidev-send-button"
              type="submit"
              className={`slidev-send-button \${slidevInputText.trim() === "" ? "disabled" : ""}`}
              disabled={slidevInputText.trim() === ""}
            >
              提交修改
            </button>
          </form>
        </div>
      )}
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.sender === "ai" && (
                <img src={logo} alt="AI 标志" className="ai-logo" />
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
          {selectedFile && (
            <div className="file-preview">
              <span>{selectedFile.name}</span>
              {selectedFile.type.startsWith("image/") && (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="预览"
                  style={{ maxWidth: 80, maxHeight: 80, display: "block", marginTop: 6, borderRadius: 4 }}
                />
              )}
              <button
                type="button"
                className="clear-file-btn"
                onClick={() => setSelectedFile(null)}
                style={{ marginLeft: 8, color: "#f00", border: "none", background: "none", cursor: "pointer" }}
              >
                ×
              </button>
            </div>
          )}

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