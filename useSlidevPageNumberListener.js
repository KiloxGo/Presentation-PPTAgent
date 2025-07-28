// useSlidevPageNumberListener.js
import { useEffect } from "react";

const useSlidevPageNumberListener = () => {
  useEffect(() => {
    const listenToPageNumber = () => {
      // 监听页面元素变化的逻辑，不使用puppeteer
      console.log("开始监听Slidev页面变化");

      // 如果需要监听iframe中的Slidev页面，可以使用postMessage
      const handleMessage = (event) => {
        if (event.origin === "http://localhost:3030") {
          console.log("收到Slidev页面消息:", event.data);
        }
      };

      window.addEventListener("message", handleMessage);

      return () => {
        window.removeEventListener("message", handleMessage);
      };
    };

    const cleanup = listenToPageNumber();

    return cleanup;
  }, []);
};

export default useSlidevPageNumberListener;
