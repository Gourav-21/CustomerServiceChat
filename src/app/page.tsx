import { cookies } from "next/headers";
import { ChatLayout } from "@/components/chat/chat-layout";
import MiniChat from "@/components/MiniChat";

export default async function Home() {
  const layout = cookies().get("react-resizable-panels:layout");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center ">

      <div className=" border rounded-lg max-w-5xl w-full h-full text-sm lg:flex ">
        <ChatLayout defaultLayout={defaultLayout} navCollapsedSize={8}  />
      </div>

      <MiniChat />
    </main>
  );
}
