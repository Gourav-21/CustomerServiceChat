export const userData =  [
    {
        id: 1,
        avatar: '/User1.png',
        messages: [
            {
                id: 1,
                avatar: '/User1.png',
                name: 'Jane Doe',
                message: 'Hey, Jakob',
            },
            {
                id: 2,
                avatar: '/User1.png',
                name: 'Jane Doe',
                message: 'How can i help you?',
            },
        ],
        name: 'Jane Doe',
    }
];

export type UserData = (typeof userData)[number];

export const loggedInUserData = {
    email: 'jakobhoeg@gmail.com',
    avatar: '/LoggedInUser.jpg',
    name: 'Jakob Hoeg',
};

export type LoggedInUserData = (typeof loggedInUserData);

export interface Message {
    id: number;
    avatar: string;
    name: string;
    message: string;
    email?: string;
    createdAt?: Date;
}

export interface User {
    id: number;
    avatar: string;
    messages: Message[];
    name: string;
}

export interface messagesProp {
    id: string;
    email:string,
    avatar: string;
    messages: Message[];
    name: string;
}