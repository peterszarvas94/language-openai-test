import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import ChatWindow from "~/components/ChatWindow";
import { api } from "~/utils/api";
import { Message } from "~/utils/message";
import { AiOutlineClear } from "react-icons/ai";

const Home: NextPage = () => {

  const [messages, setMessages] = useState<Message[]>([{ sender: "bot", text: "Hello" }]);

  const response = api.ai.getResponse.useMutation();
  const translation = api.ai.getTranslation.useMutation();

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  function sendMessage(message: string) {
    if (message === "") return;
    setMessages([...messages, { sender: "user", text: message }]);
  }

  return (
    <>
      <Head>
        <title>Language chat AI</title>
        <meta name="description" content="Language chat AI" />
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
      </Head>

      <main className="p-2 bg-gray-100 h-screen">

        <div className="flex flex-col gap-1 items-start">
          <div className="flex gap-2">
            <ChatWindow
              language="english"
              onSubmit={(message) => { sendMessage(message) }}
              messages={messages}
            />
            <ChatWindow
              language="swedish"
              onSubmit={(message) => { sendMessage(message) }}
              messages={messages}
            />
            <div>
              <button onClick={() => setMessages([])}>
                <AiOutlineClear className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

      </main>
    </>
  );
};

export default Home;
