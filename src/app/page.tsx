import { cookies } from "next/headers";
import { ChatLayout } from "@/components/chat/chat-layout";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import MiniChat from "@/components/MiniChat";
import { collection, getDocs, limit, query } from "firebase/firestore/lite";
import { db } from "@/lib/firebase";
import { messagesProp } from "./data";

export default async function Home() {
  const layout = cookies().get("react-resizable-panels:layout");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  const issuesCollectionRef = collection(db, "issues");
  const issuesSnapshot = await getDocs(issuesCollectionRef);

  const issues = await Promise.all(
    issuesSnapshot.docs.map(async (issueDoc) => {
      const issueId = issueDoc.id;
      const issueData = issueDoc.data();

      // Fetch messages for this issue
      const messagesCollectionRef = collection(db, "issues", issueId, "messages");
      const messagesSnapshot = await getDocs(query(messagesCollectionRef, limit(2)));
      const messages = messagesSnapshot.docs.map((messageDoc) => ({
        ...messageDoc.data(),
        id: messageDoc.id,
      }));

      return { id: issueId, ...issueData, messages };
    })
  );

  console.log(issues);


  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center ">

      {/* <div className=" p-4 md:px-24 py-32 gap-4"> */}

      <div className=" border rounded-lg max-w-5xl w-full h-full text-sm lg:flex ">
        <ChatLayout defaultLayout={defaultLayout} navCollapsedSize={8} messages={issues} />
      </div>
      {/* </div> */}

      <MiniChat />


    </main>
  );
}
