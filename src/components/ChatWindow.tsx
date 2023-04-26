import { FormEvent } from "react";
import BotMessage from "./BotMessage";
import UserMessage from "./UserMessage";
import { IoMdSend } from "react-icons/io";
import { Message } from "~/utils/message";

function ChatWindow({ language, messages, onSubmit }: {
  language: string,
  messages: Message[],
  onSubmit: (message: string) => void
}) {

  function renderMessages() {
    const m: JSX.Element[] = [];
    for (const message of messages) {
      if (message.sender === "user") {
        m.push(<UserMessage text={message.text} />);
        continue;
      }
      if (message.sender === "bot") {
        m.push(<BotMessage text={message.text} />);
        continue;
      }
    }
    return m;
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const form = e.currentTarget;
    const message = (form.querySelector("[role=textbox]") as HTMLDivElement).innerText;
    onSubmit(message);
  }

  return (
    <div className="
      w-96 bg-white rounded-xl shadow-xl py-2
      flex flex-col gap-2
    ">
      <div className="text-center">{language}</div>
      <div className="grow">
        <div className="flex justify-center pb-2 px-2 text-sm text-gray-600">
          Start a conversation by sending a message
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
