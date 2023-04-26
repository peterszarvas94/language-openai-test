function BotMessage({ text }: { text: string }) {
  return (
    <div className="flex justify-start pb-2 px-2">
      <div className="bg-blue-100 py-2 px-3 rounded-3xl max-w-full break-words">
        {text}
      </div>
    </div>
  );
}

export default BotMessage;
