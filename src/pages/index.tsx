import type { NextPage } from "next";
import Head from "next/head";
import { FormEvent, useReducer } from "react";
import { api } from "~/utils/api";

type Mode = "chat" | "text" | "translate";

function reducer(_state: Mode, action: Mode) {
  return action;
}

const Home: NextPage = () => {
  const [state, dispatch] = useReducer(reducer, "translate");

  const text = api.ai.getTextCompletion.useMutation();
  const translate = api.ai.getTranslation.useMutation();

  function changeMode(e: FormEvent<HTMLInputElement>) {
    const mode = e.currentTarget.value as Mode;
    dispatch(mode);
  }

  function fetchText(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const prompt = data.get("prompt") as string;
    if (!prompt) return;
    text.mutateAsync({ prompt }).then((res) => console.log(res));
  }

  function fetchTranslation(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const text = data.get("text") as string;
    const language = data.get("language") as string;

    if (!prompt) return;
    translate.mutateAsync({
      text,
      language
    })
  }

  function showText() {
    if (text.isLoading) return <p>Loading...</p>;
    if (text.isError) return <p>Error: {text.error.message}</p>;
    if (text.isSuccess) {
      const response = text.data.textCompletion.choices[0]?.text;
      return <pre className="w-full whitespace-pre-wrap">{response}</pre>;
    }
  }

  function showTranslation() {
    if (translate.isLoading) return <p>Loading...</p>;
    if (translate.isError) return <p>Error: {translate.error.message}</p>;
    if (translate.isSuccess) {
      const response = translate.data.translation.choices[0]?.text;
      return <pre className="w-full whitespace-pre-wrap font-sans">{response}</pre>;
    }
  }



  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Language learner AI" />
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
      </Head>

      <main className="p-2">

        <div className="flex flex-col pb-10">
          <div className="flex gap-1">
            <input type="radio" id="mode1" name="mode" value="chat" onChange={changeMode} checked={state === "chat"} />
            <label htmlFor="mode1">Chat mode</label>
          </div>
          <div className="flex gap-1">
            <input type="radio" id="mode2" name="mode" value="text" onChange={changeMode} checked={state === "text"} />
            <label htmlFor="mode2">Text mode</label>
          </div>
          <div className="flex gap-1">
            <input type="radio" id="mode3" name="mode" value="translate" onChange={changeMode} checked={state === "translate"} />
            <label htmlFor="mode3">Translation mode</label>
          </div>
        </div>

        <div className={state === "chat" ? "" : "hidden"}>
          <h2>Chat completion</h2>
          <div>TODO...</div>
        </div>

        <div className={state === "text" ? "" : "hidden"}>
          <h2>Text completion</h2>

          <form onSubmit={(e) => fetchText(e)} className="flex flex-col gap-1 items-start">
            <textarea name="prompt" className="border-black border-[1px] w-full h-32" />
            <button className="border-black border-[1px]">Click me</button>
          </form >

          <div>
            {showText()}
          </div>
        </div>

        <div className={state === "translate" ? "" : "hidden"}>
          <h2>Translation</h2>

          <form onSubmit={(e) => fetchTranslation(e)} className="flex flex-col gap-1 items-start">
            <label htmlFor="text">Source</label>
            <textarea id="text" name="text" className="border-black border-[1px] w-full h-32" />

            <label htmlFor="language">Language</label>
            <input type="text" id="language" name="language" className="border-black border-[1px] w-full" />

            <button className="border-black border-[1px]">Click me</button>
          </form>
          <div>
            {showTranslation()}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
