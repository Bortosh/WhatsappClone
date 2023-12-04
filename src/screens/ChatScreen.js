import { useEffect, useState } from 'react'
import { ImageBackground, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import Mesagge from '../components/Message'
import InputBox from '../components/InputBox'
import { API, graphqlOperation } from 'aws-amplify'
import { getChatRoom, listMessagesByChatRoom } from '../graphql/queries'
import { onCreateMessage, onUpdateChatRoom } from '../graphql/subscriptions'

import bg from '../../assets/images/BG.png'
import messages from '../../assets/data/messages.json'

const ChatScreen = () => {

    const [chatRoom, setChatRoom] = useState(null)
    const [messages, setMessages] = useState([])


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

        // SUBSCRIBE TO NEW MESSAGES
        // AQUI NO TIENE EL FILTRO EL CUAL NOTIFICA SOLAMENTE EL MENSAJE PARA CADA ROOM EN ESPECIFICO, AL PARECER ES UN TEMA CON EL UPSYNC EN AWS QUE MAS ADELANTE PODRIAMOS SOLVENTAR, IGUAL EL CODIGO CON EL FILTRO ESTA COMENTADO ABAJO DEL COMPONENTE
        // DE IGUAL MODO FUNCIONA A TIEMPO REAL PERFECTO!!
        const subscription = API.graphql(graphqlOperation(onCreateMessage)).subscribe({
            next: ({ value }) => {
                setMessages((m) => [value.data.onCreateMessage, ...m])
            },
            error: (err) => console.warn(err)
        })

        return () => subscription.unsubscribe()

    }, [chatRoomID])

    useEffect(() => {
        navigation.setOptions({ title: route.params.name })
    }, [route.params.name])

    if (!chatRoom) {
        return <ActivityIndicator />
    }

    return (

        <KeyboardAvoidingView
            // behavior={Platform.OS === 'ios' ? 60 : 90}
            style={styles.bg}
        >
            <ImageBackground source={bg} style={styles.bg}>
                <FlatList
                    data={messages}
                    renderItem={({ item }) => <Mesagge message={item} />}
                    style={styles.list}
                    inverted
                />
                <InputBox chatroom={chatRoom} />
            </ImageBackground>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    bg: {
        flex: 1
    },
    list: {
        padding: 10
    }
})

export default ChatScreen;



// SUBSCRIBE TO NEW MESSAGES
//     const subscription = API.graphql(graphqlOperation(onCreateMessage, {
//         filter: {chatRoomID: { eq: chatRoomID }}
//     })).subscribe({
//         next: ({ value }) => {
//             setMessages((m) => [value.data.onCreateMessage, ...m])
//         },
//         error: (err) => console.warn(err)
//     })

//     return () => subscription.unsubscribe()

// }, [chatRoomID])