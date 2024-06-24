import { Message, messagesProp } from "@/app/data";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import React, { SetStateAction, useEffect } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { onSnapshot } from "firebase/firestore";
import { addDoc } from "firebase/firestore";
import { m } from "framer-motion";

interface ChatProps {
  messages?: Message[];
  selectedUser: messagesProp;
  isMobile: boolean;
  setSelectedUser: React.Dispatch<SetStateAction<messagesProp|null>>;

}

export function Chat({ selectedUser, isMobile, setSelectedUser }: ChatProps) {
  const [messagesState, setMessages] = React.useState<Message[]>([]);

  useEffect(() => {
    if (selectedUser?.id == undefined) {
      return;
    }
    const q = query(collection(db, "issues", selectedUser.id, "messages"), orderBy("createdAt", "asc"), limit(30));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages: Message[] = [];
      querySnapshot.forEach((doc) => {
        messages.push(doc.data() as Message);
        // setMessages((p) => [...p, doc.data() as Message]);
      });
      setMessages(messages);
    });

    return () => {
      unsubscribe();
      setMessages([]);
    };
  }, [selectedUser]);

  // console.log(messagesState)


  const sendMessage = async (newMessage: Message) => {
    try {
      const docRef = await addDoc(collection(db, "issues", selectedUser.id, "messages"), newMessage);
      setMessages([...messagesState, newMessage]);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  if (selectedUser?.id == undefined) {
    return <div className="flex flex-col justify-center items-center h-full text-2xl font-medium">
      no messages
    </div>;
  }

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />

      <ChatList
        messages={messagesState}
        selectedUser={selectedUser}
        sendMessage={sendMessage}
        isMobile={isMobile}
      />
    </div>
  );
}
