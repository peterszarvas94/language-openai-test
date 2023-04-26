import type { NextPage } from "next";
import Head from "next/head";
import { FormEvent, useState } from "react";
import ChatWindow from "~/components/ChatWindow";
import { api } from "~/utils/api";
import { Message } from "~/utils/message";
import { AiOutlineClear, AiFillSave } from "react-icons/ai";

const Home: NextPage = () => {

  const [source, setSource] = useState("english");
  const [target, setTarget] = useState("swedish");

  const englishText = "Start a conversation by sending a message";
  const [sourceText, setSourceText] = useState(englishText);
  const [targetText, setTargetText] = useState("");

  const [messagesLeft, setMessagesLeft] = useState<Message[]>([]);
  const [messagesRight, setMessagesRight] = useState<Message[]>([]);

  const translation = api.ai.getTranslation.useMutation();
  const conversation = api.ai.getChatCompletion.useMutation();

  async function sendMessage({ message, which }: { message: string, which: "left" | "right" }) {
    if (!message) return;

    // get response
    if (which === "left") {
      const chat = await conversation.mutateAsync({
        messages: [
          ...messagesLeft,
          { role: "user", content: message }
        ]
      });
      const res = chat.chatCompletion.choices[0]?.message?.content;
      if (!res) return;

      // get translation of original
      const translationMessage = await translation.mutateAsync({
        source,
        target,
        text: message
      });

      // get translation of response
      const translationRes = await translation.mutateAsync({
        source,
        target,
        text: res
      });

      const tranlationMessageText = translationMessage.translation.choices[0]?.text;
      const translationResText = translationRes.translation.choices[0]?.text;
      if (!tranlationMessageText || !translationResText) return;

      setMessagesLeft([
        ...messagesLeft,
        { role: "user", content: message },
        { role: "assistant", content: res.trim() }
      ])

      setMessagesRight([
        ...messagesRight,
        { role: "user", content: tranlationMessageText.trim() },
        { role: "assistant", content: translationResText.trim() }
      ])

      return;
    }
    if (which === "right") {
      const chat = await conversation.mutateAsync({
        messages: [
          ...messagesRight,
          { role: "user", content: message }
        ]
      });
      const res = chat.chatCompletion.choices[0]?.message?.content;
      if (!res) return;

      // get translation of original
      const translationMessage = await translation.mutateAsync({
        source: target,
        target: source,
        text: message
      });

      // get translation of response
      const translationRes = await translation.mutateAsync({
        source: target,
        target: source,
        text: res
      });

      const tranlationMessageText = translationMessage.translation.choices[0]?.text;
      const translationResText = translationRes.translation.choices[0]?.text;
      if (!tranlationMessageText || !translationResText) return;

      setMessagesRight([
        ...messagesRight,
        { role: "user", content: message },
        { role: "assistant", content: res.trim() }
      ])

      setMessagesLeft([
        ...messagesLeft,
        { role: "user", content: tranlationMessageText.trim() },
        { role: "assistant", content: translationResText.trim() }
      ])


      return;
    }
  }

  function saveSource(e: FormEvent) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector("input");
    if (!input) return;
    setSource(input.value);
    translation.mutateAsync({
      source: "english",
      target: input.value,
      text: englishText
    }).then(res => {
      const translatedText = res.translation.choices[0]?.text;
      if (!translatedText) return;
      setSourceText(translatedText.trim());
    })
  }

  function saveTarget(e: FormEvent) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector("input");
    if (!input) return;
    setTarget(input.value);
    translation.mutateAsync({
      source: "english",
      target: input.value,
      text: englishText
    }).then(res => {
      const translatedText = res.translation.choices[0]?.text;
      if (!translatedText) return;
      setTargetText(translatedText.trim());
    })
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
            <form className="w-96 px-2" onSubmit={(e) => saveSource(e)}>
              <input type="text" defaultValue={source} className="w-80 p-2" />
              <button>
                <AiFillSave className="h-5 w-5 text-gray-600" />
              </button>
            </form>
            <form className="w-96 px-2" onSubmit={(e) => saveTarget(e)}>
              <input type="text" defaultValue={target} className="w-80 p-2" />
              <button>
                <AiFillSave className="h-5 w-5 text-gray-600" />
              </button>
            </form>
          </div>
          <div className="flex gap-2">
            <ChatWindow
              topText={sourceText}
              onSubmit={(message) => { sendMessage({ message, which: "left" }) }}
              messages={messagesLeft}
            />
            <ChatWindow
              topText={targetText}
              onSubmit={(message) => { sendMessage({ message, which: "right" }) }}
              messages={messagesRight}
            />
            <div>
              <button onClick={() => {
                setMessagesLeft([])
                setMessagesRight([])
              }}>
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
