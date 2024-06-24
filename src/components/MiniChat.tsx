"use client"
import { MessageCircleQuestion, Minimize2 } from 'lucide-react'
import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from './ui/button'
import { db } from '@/lib/firebase'
import { addDoc, collection } from 'firebase/firestore'
import { userData } from '@/app/data'
import { Chat } from './minichat/chat'


export default function MiniChat() {
    const [show, setShow] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('rahul.dora21@gmail.com')
    const [chatId, setChatId] = useState("")

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            const docRef = await addDoc(collection(db, "issues"), {
                avatar: '/LoggedInUser.jpg',
                name: name,
                email: email,
            });
            setChatId(docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    const loggedInUserData = {
        avatar: '/LoggedInUser.jpg',
        name: name,
        email: email
    };

    return (
        <div className='h-screen w-screen flex flex-col items-center justify-center relative z-10'>
            <div className='absolute bottom-10 right-10 h-10 w-10 bg-black rounded-full flex items-center justify-center cursor-pointer' onClick={() => setShow(!show)} >
                {!show ? <MessageCircleQuestion size={20} color='white' /> : <Minimize2 size={20} color='white' />}
            </div>
            <div className={`absolute bottom-20 right-20 transition-all duration-300 ease-in-out ${show ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-0 translate-y-2/4 translate-x-2/4  '}`}>
                <div className='bg-white text-sm w-[350px] h-[500px] border-2 border-muted rounded-lg flex flex-col items-center justify-center '>
                    {chatId != "" ? (
                        <Chat isMobile={false} selectedUser={userData?.[0]} loggedInUserData={loggedInUserData} messages={userData[0].messages} chatId={chatId} />
                    ) : (
                        <Detail name={name} setName={setName} submit={submit} />
                    )}
                </div>
            </div>
        </div>
    )
}

function Detail({ name, setName, submit }: { name: string, setName: React.Dispatch<React.SetStateAction<string>>, submit: React.FormEventHandler<HTMLFormElement> }) {

    return (
        <form onSubmit={submit} className='flex flex-col items-center justify-center  w-full h-full p-4 gap-5'>
            <h1 className='text-3xl font-bold text-left w-full pr-5'>Enter your details to start chatting with us</h1>
            <Input type="text" required placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
            {/* <Input type="text" placeholder="Enter your email" /> */}
            <Button variant="secondary" className="w-full" >Start chatting</Button>
        </form>
    )
}