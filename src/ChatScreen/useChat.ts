import {useCallback, useEffect, useState} from 'react';
import {Chat, Collections, FirestoreMessageData, Message, User} from '../types';
import _ from 'lodash';
import firestore from '@react-native-firebase/firestore';

function getChatKey(userIds: string[]) {
    return _.orderBy(userIds, userId => userId, 'asc');
}

function useChat(userIds: string[]) {
    const [chat, setChat] = useState<Chat | null>(null);
    const [loadingChat, setLoadingChat] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [sending, setSending] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const loadChat = useCallback(async () => {
        try {
            setLoadingChat(true);
            const chatSnapshot = await firestore()
                .collection(Collections.CHATS)
                .where('userIds', '==', getChatKey(userIds))
                .get();

            if (chatSnapshot.docs.length > 0) {
                const doc = chatSnapshot.docs[0];
                setChat({
                    id: doc.id,
                    userIds: doc.data().userIds as string[],
                    users: doc.data().users as User[],
                });

                return;
            }

            const usersSnapshot = await firestore()
                .collection(Collections.USERS)
                .where('userId', 'in', userIds)
                .get();

            const users = usersSnapshot.docs.map(doc => doc.data() as User);
            const data = {
                userIds: getChatKey(userIds),
                users,
            };

            const doc = await firestore()
                .collection(Collections.CHATS)
                .add(data);

            setChat({
                id: doc.id,
                ...data,
            });
        } finally {
            setLoadingChat(false);
        }
    }, [userIds]);

    useEffect(() => {
        loadChat();
    }, [loadChat]);

    const sendMessage = useCallback(
        async (text: string, user: User) => {
            if (chat === null) throw new Error('Chat is not loaded');
            try {
                setSending(true);
                const data: FirestoreMessageData = {
                    text: text,
                    user: user,
                    createdAt: new Date(),
                };

                const doc = await firestore()
                    .collection(Collections.CHATS)
                    .doc(chat.id)
                    .collection(Collections.MESSAGES)
                    .add(data);

                setMessages(prevMessages =>
                    [
                        {
                            id: doc.id,
                            ...data,
                        },
                    ].concat(prevMessages),
                );
            } finally {
                setSending(false);
            }
        },
        [chat],
    );

    const loadMessages = useCallback(async (chatId: string) => {
        try {
            setLoadingMessages(true);
            const messagesSnapshot = await firestore()
                .collection(Collections.CHATS)
                .doc(chatId)
                .collection(Collections.MESSAGES)
                .orderBy('createdAt', 'desc')
                .get();

            const ms = messagesSnapshot.docs.map<Message>(doc => {
                const data = doc.data();

                return {
                    id: doc.id,
                    user: data.user,
                    text: data.text,
                    createdAt: data.createdAt.toDate(),
                };
            });

            setMessages(ms);
        } finally {
            setLoadingMessages(false);
        }
    }, []);

    useEffect(() => {
        if (chat?.id) {
            loadMessages(chat.id);
        }
    }, [chat?.id, loadMessages]);

    return {
        chat,
        loadingChat,
        messages,
        sending,
        sendMessage,
        loadingMessages,
    };
}

export default useChat;
