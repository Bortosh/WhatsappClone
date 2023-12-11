import { useEffect, useState } from 'react'
import { StyleSheet, ActivityIndicator} from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { API, graphqlOperation } from 'aws-amplify'
import { getChatRoom, listMessagesByChatRoom } from '../graphql/queries'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import { onCreateMessage, onUpdateChatRoom } from '../graphql/subscriptions'

import CustomHeaderButton from '../components/CustomHeaderButton'
import ChatPresentational from '../presentational/ChatPresentational.js'

const ChatContainer = () => {

    const [chatRoom, setChatRoom] = useState(null)
    const [messages, setMessages] = useState([])
    const [modalVisible, setModalVisible] = useState(false);
    const [allFavoritos, setAllFavoritos] = useState({})

    const fetchFavoritos = async () => {
        const response = await API.graphql(graphqlOperation(listMessagesByChatRoom, { chatroomID: chatRoom.id, filter: { favoritos: { eq: true } } }))
        setAllFavoritos(response)
    }
    useEffect(() => {
        if (chatRoom) {
            fetchFavoritos()
        }

    }, [chatRoom])

    const route = useRoute()
    const navigation = useNavigation()

    const chatRoomID = route.params.id

    // FETCH CHAT ROOM
    useEffect(() => {
        API.graphql(graphqlOperation(getChatRoom, { id: chatRoomID })).then(
            result => setChatRoom(result.data?.getChatRoom)
        )

        const subscription = API.graphql(graphqlOperation(onUpdateChatRoom, { filter: { id: { eq: chatRoomID } } })
        ).subscribe({
            next: ({ value }) => {
                setChatRoom((cr) => ({
                    ...(cr || {}),
                    ...value.data.onUpdateChatRoom
                }))
            },
            error: err => console.warn(err)
        })

        return () => subscription.unsubscribe()
    }, [chatRoomID])

    // FETCH MESSAGES
    useEffect(() => {
        API.graphql(graphqlOperation(listMessagesByChatRoom, { chatroomID: chatRoomID, sortDirection: 'DESC' })).then(
            result => {
                setMessages(result.data?.listMessagesByChatRoom?.items)
            }
        )

        const subscription = API.graphql(graphqlOperation(onCreateMessage)).subscribe({
            next: ({ value }) => {
                setMessages((m) => [value.data.onCreateMessage, ...m])
            },
            error: (err) => console.warn(err)
        })

        return () => subscription.unsubscribe()

    }, [chatRoomID])

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    useEffect(() => {
        navigation.setOptions({
            title: route.params.name,
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    <Item
                        title="GroupInfo"
                        iconName="more-vertical"
                        onPress={() => navigation.navigate('Group Info', { id: chatRoomID })}
                    />
                    <Item
                        title="Star"
                        iconName="star"
                        onPress={() => {
                            openModal()
                        }}
                    />
                </HeaderButtons>
            ),
        });
    }, [route.params.name, chatRoomID]);


    if (!chatRoom) {
        return <ActivityIndicator />
    }

    return (

        <ChatPresentational
            openModal={openModal}
            closeModal={closeModal}
            modalVisible={modalVisible}
            allFavoritos={allFavoritos}
            messages={messages}
            chatRoom={chatRoom}
            chatRoomID={chatRoomID}
        />
    )
}

export default ChatContainer;

