import { Message, UserData, messagesProp } from "@/app/data";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import React, { useEffect } from "react";
import { collection, getDocs, limit, query } from "firebase/firestore/lite";
import { db } from "@/lib/firebase";

interface ChatProps {
  messages?: Message[];
  selectedUser: messagesProp;
  isMobile: boolean;
}

export function Chat({ messages, selectedUser, isMobile }: ChatProps) {
  const [messagesState, setMessages] = React.useState<Message[]>(
    messages ?? []
  );

  if (!selectedUser) {
    return <div className="flex flex-col justify-center items-center h-full text-2xl font-medium">
      no messages
    </div>;
  }

  useEffect(() => {
    async function fetch() {
      const q = query(collection(db, "issues", selectedUser.id, "messages"), limit(30));
      const querySnapshot = await getDocs(q);
      const messages = querySnapshot.docs.map((doc) => {
        return { ...doc.data() }
      });
      setMessages(messages);
    }
    fetch();
  }, [messages]);



  const sendMessage = (newMessage: Message) => {
    setMessages([...messagesState, newMessage]);
  };

  


  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar selectedUser={selectedUser} />

      <ChatList
        messages={messagesState}
        selectedUser={selectedUser}
        sendMessage={sendMessage}
        isMobile={isMobile}
      />
    </div>
  );
}
