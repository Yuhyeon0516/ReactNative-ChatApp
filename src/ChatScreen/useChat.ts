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
                    prevMessages.concat([
                        {
                            id: doc.id,
                            ...data,
                        },
                    ]),
                );
            } finally {
                setSending(false);
            }
        },
        [chat],
    );

    useEffect(() => {
        loadChat();
    }, [loadChat]);

    return {
        chat,
        loadingChat,
        messages,
        sending,
        sendMessage,
    };
}

export default useChat;
