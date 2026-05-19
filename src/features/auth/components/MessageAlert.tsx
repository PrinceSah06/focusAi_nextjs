import type { Message } from "../types";

type MessageAlertProps = {
  message: Message;
};

export function MessageAlert({ message }: MessageAlertProps) {
  const colorClasses =
    message.type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <div className={`mt-6 rounded-md border px-4 py-3 text-sm ${colorClasses}`}>
      {message.text}
    </div>
  );
}
