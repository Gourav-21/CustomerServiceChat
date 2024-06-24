import { doc, deleteDoc, collection, getDocs } from "firebase/firestore";
import React from 'react'
import { Avatar, AvatarImage } from '../ui/avatar'
import { messagesProp } from '@/app/data';
import { Info, Phone, Trash2, Video } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';
import { db } from '@/lib/firebase';

interface ChatTopbarProps {
  selectedUser: messagesProp;
  setSelectedUser: React.Dispatch<React.SetStateAction<messagesProp|null>>;
}

export default function ChatTopbar({ selectedUser, setSelectedUser }: ChatTopbarProps) {

  async function Delete(id: string) {
    try {
      setSelectedUser(null);
      const issueDocRef = doc(db, "issues", id);

      const messagesCollectionRef = collection(issueDocRef, "messages");
      const messagesSnapshot = await getDocs(messagesCollectionRef);

      messagesSnapshot.forEach((messageDoc) => {
        deleteDoc(doc(messagesCollectionRef, messageDoc.id));
      });

      await deleteDoc(issueDocRef);

      console.log("Issue and its subcollections deleted successfully.");
    } catch (error) {
      console.error("Error deleting issue and subcollections:", error);
    }
  }

  return (
    <div className="w-full h-20 flex p-4 justify-between items-center border-b">
      <div className="flex items-center gap-2">
        <Avatar className="flex justify-center items-center">
          <AvatarImage
            src={selectedUser.avatar}
            alt={selectedUser.name}
            width={6}
            height={6}
            className="w-10 h-10 "
          />
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{selectedUser.name}</span>
          <span className="text-xs">Active 2 mins ago</span>
        </div>
      </div>

      <div>
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
          }}
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "h-9 w-9",
            "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
          )}
        >
          <Phone size={20} className="text-muted-foreground" />
        </Link>
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
          }}
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "h-9 w-9",
            "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
          )}
        >
          <Video size={20} className="text-muted-foreground" />
        </Link>
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            Delete(selectedUser.id);
          }}
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "h-9 w-9",
            "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
          )}
        >
          <Trash2 size={20} className="text-muted-foreground" />
        </Link>
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
          }}
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "h-9 w-9",
            "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
          )}
        >
          <Info size={20} className="text-muted-foreground" />
        </Link>
      </div>
    </div>
  )
}
