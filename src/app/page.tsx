import { cookies } from "next/headers";
import { ChatLayout } from "@/components/chat/chat-layout";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import MiniChat from "@/components/MiniChat";

export default function Home() {
  const layout = cookies().get("react-resizable-panels:layout");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center ">
     
      {/* <div className=" p-4 md:px-24 py-32 gap-4"> */}

        <div className=" border rounded-lg max-w-5xl w-full h-full text-sm lg:flex ">
          <ChatLayout defaultLayout={defaultLayout} navCollapsedSize={8} />
        </div>
      {/* </div> */}

      <MiniChat />


    </main>
  );
}
