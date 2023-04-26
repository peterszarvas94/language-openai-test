function UserMessage({ text }: { text: string }) {
  return (
    <div className="flex justify-end pb-2 px-2">
      <div className="bg-blue-600 text-white py-2 px-3 rounded-3xl max-w-full break-words">
        {text}
      </div>
    </div>
  );
}

export default UserMessage;
