import { LoggedInUserData, Message, UserData, userData } from "@/app/data";
import React, { useEffect } from "react";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import { addDoc, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { collection, getDocs, limit, query } from "firebase/firestore";


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

  useEffect(() => {
    if (!selectedUser.id) {
      return;
    }
    const q = query(collection(db, "issues", chatId, "messages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newMessages = querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            setMessages((p)=>([...p,change.doc.data()]))
        }
      });
    });
  
    return () => {
      unsubscribe();
      setMessages(userData[0].messages ?? []);
    };
  }, []);

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
