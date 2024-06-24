"use client";

import { messagesProp, userData } from "@/app/data";
import React, { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { Sidebar } from "../sidebar";
import { collection, getDocs, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { Chat } from "./chat";
import { db } from "@/lib/firebase";

interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function ChatLayout({
  defaultLayout = [320, 480],
  defaultCollapsed = false,
  navCollapsedSize,
}: ChatLayoutProps) {
  const [messages, setMessages] = React.useState<messagesProp[]>([]);
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [selectedUser, setSelectedUser] = React.useState(messages[0] ?? []);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkScreenWidth();

    // Event listener for screen width changes
    window.addEventListener("resize", checkScreenWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  useEffect(() => {
    const issuesCollectionRef = collection(db, "issues");

    // Listen for changes in the "issues" collection
    const unsubscribe = onSnapshot(issuesCollectionRef, (issuesSnapshot) => {
      setMessages([]);
      const issues = issuesSnapshot.docs.map((issueDoc) => {
        const issueId = issueDoc.id;
        const issueData = issueDoc.data();

        // Listen for changes in the "messages" subcollection for this issue
        const messagesCollectionRef = collection(db, "issues", issueId, "messages");
        const messagesUnsubscribe = onSnapshot(
          query(messagesCollectionRef,orderBy("timestamp", "desc"), limit(1)),
          (messagesSnapshot) => {
            const messages = messagesSnapshot.docs.map((messageDoc) => ({
              ...messageDoc.data(),
              id: messageDoc.id,
            }));

            // Update the issue with the latest messages
            setMessages((prevMessages) => ([
              ...prevMessages,
              { id: issueId, ...issueData, messages: messages },
            ]));

            // console.log("Issue:", issueId, "Messages:", messages);
            // You can update your UI or perform other actions here
          }
        );

        // Unsubscribe from the messages listener when the issue is deleted
        return () => messagesUnsubscribe();
      });

      // Unsubscribe from the issues listener when you no longer need to listen
      return () => issues.forEach((unsubscribe) => unsubscribe());
    });

    return () => {
      unsubscribe();
    };
  }, []);


  // console.log(messages)

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes
        )}`;
      }}
      className="h-full items-stretch"
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={navCollapsedSize}
        collapsible={true}
        minSize={isMobile ? 0 : 24}
        maxSize={isMobile ? 8 : 30}
        onCollapse={() => {
          setIsCollapsed(true);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            true
          )}`;
        }}
        onExpand={() => {
          setIsCollapsed(false);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            false
          )}`;
        }}
        className={cn(
          isCollapsed && "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out"
        )}
      >
        <Sidebar
          isCollapsed={isCollapsed || isMobile}
          links={messages.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            messages: user.messages ?? [],
            avatar: user.avatar,
            variant: selectedUser.id === user.id ? "grey" : "ghost",
          }))}
          isMobile={isMobile}
          setSelectedUser={setSelectedUser}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
        <Chat
          messages={selectedUser?.messages}
          selectedUser={selectedUser}
          isMobile={isMobile}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
