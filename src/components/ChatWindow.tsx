import { FormEvent } from "react";
import BotMessage from "./BotMessage";
import UserMessage from "./UserMessage";
import { IoMdSend } from "react-icons/io";
import { Message } from "~/utils/message";

function ChatWindow({ topText, messages, onSubmit }: {
  topText: string,
  messages: Message[],
  onSubmit: (message: string) => void
}) {

  function renderMessages() {
    const m: JSX.Element[] = [];
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      if (!message) continue;
      if (message.role === "user") {
        m.push(<UserMessage text={message.content} key={i} />);
        continue;
      }
      if (message.role === "assistant") {
        m.push(<BotMessage text={message.content} key={i} />);
        continue;
      }
    }
    return m;
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const textbox = form.querySelector("[role=textbox]") as HTMLDivElement;
    const message = textbox.innerText;
    onSubmit(message);
    textbox.innerText = "";
  }

  return (
    <div className="
      w-96 bg-white rounded-xl shadow-xl py-2
      flex flex-col gap-2
    ">
      <div className="grow">
        <div className="flex justify-center pb-2 px-2 text-sm text-gray-600">
          {topText}
        </div>
        {renderMessages()}
      </div>
      <form className="flex gap-2 items-end px-2" onSubmit={(e) => submit(e)}>
        <span role="textbox" contentEditable className="
        w-80 min-h-[2.5rem] bg-gray-200 rounded-3xl py-2 px-3
      " />

        <button className="h-10 w-10 text-blue-600 flex items-center justify-center">
          <IoMdSend className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;
