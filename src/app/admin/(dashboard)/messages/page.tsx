import { MessagesManager } from "@/components/admin/MessagesManager";

export default function AdminMessagesPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Contact Messages</h1>
      <MessagesManager />
    </div>
  );
}
