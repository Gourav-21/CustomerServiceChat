import { Message, messagesProp } from "@/app/data";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import React, { useEffect } from "react";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { onSnapshot } from "firebase/firestore";
import { addDoc } from "firebase/firestore";

interface ChatProps {
  messages?: Message[];
  selectedUser: messagesProp;
  isMobile: boolean;
}

export function Chat({ messages, selectedUser, isMobile }: ChatProps) {
  const [messagesState, setMessages] = React.useState<Message[]>([]);

  if (!selectedUser) {
    return <div className="flex flex-col justify-center items-center h-full text-2xl font-medium">
      no messages
    </div>;
  }

  
  useEffect(() => {
    if (!selectedUser.id) {
      return;
    }
    const q = query(collection(db, "issues", selectedUser.id, "messages"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newMessages = querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            setMessages((p)=>([...p,change.doc.data()]))
        }
      });
      setMessages((p)=>([...p,newMessages])); // Update the state
    });
  
    return () => {
      unsubscribe();
      setMessages([]);
    };
  }, [selectedUser]);
  



  const sendMessage = async (newMessage: Message) => {
    try {
      const docRef = await addDoc(collection(db, "issues", selectedUser.id, "messages"), newMessage);
      setMessages([...messagesState, newMessage]);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    // setMessages([...messagesState, newMessage]);
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
