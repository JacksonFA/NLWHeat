import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { api } from '../../services/api';

import styles from './style.module.scss';
import logoImg from '../../assets/logo.svg';

type Message = {
    id: string;
    text: string;
    user: {
        nome: string;
        avatar_url: string;
    }
}

const messagesQueue: Message[] = [];

const socket = io('http://localhost:5000')

socket.on('new_message', (newMessage: Message) => {
    messagesQueue.push(newMessage)
})

export function MessageList() {
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        setInterval(() => {
            if (messagesQueue.length > 0) {
                setMessages(prevState => [
                    messagesQueue[0],
                    prevState[0],
                    prevState[1],
                ].filter(Boolean))

                messagesQueue.shift()
            }
        }, 3000)
    }, [])

    useEffect(() => {
        api.get<Message[]>('messages/last3').then(response => {
            setMessages(response.data)
        })
    }, [])

    return (
        <div className={styles.messageListWrapper}>
            <img src={logoImg} alt="DoWhile 2021" />

            <ul className={styles.messageList}>
                {messages.map(message => {
                    return (
                        <li className={styles.message} key={message.id}>
                            <p className={styles.messageContent}>{message.text}</p>
                            <div className={styles.messageUser}>
                                <div className={styles.userImage}>
                                    <img src={message.user.avatar_url} alt={message.user.nome} />
                                </div>
                                <span>{message.user.nome}</span>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}