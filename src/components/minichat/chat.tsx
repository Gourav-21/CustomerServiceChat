import { LoggedInUserData, Message, UserData } from "@/app/data";
import React from "react";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import { addDoc, collection } from "firebase/firestore/lite";
import { db } from "@/lib/firebase";

interface ChatProps {
  messages?: Message[];
  selectedUser: UserData;
  loggedInUserData: LoggedInUserData;
  isMobile: boolean;
  chatId: string;
}

export function Chat({ messages, selectedUser, isMobile, loggedInUserData, chatId }: ChatProps) {
  const [messagesState, setMessages] = React.useState<Message[]>(
    messages ?? []
  );

  const sendMessage = async (newMessage: Message) => {
    try {
      const docRef = await addDoc(collection(db, "issues", chatId, "messages"), newMessage);
      setMessages([...messagesState, newMessage]);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar selectedUser={selectedUser} />

      <ChatList
        messages={messagesState}
        loggedInUserData={loggedInUserData}
        sendMessage={sendMessage}
        isMobile={isMobile}
      />
    </div>
  );
}
