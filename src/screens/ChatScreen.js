import { useEffect, useState } from 'react'
import { ImageBackground, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import Mesagge from '../components/Message'
import InputBox from '../components/InputBox'
import { API, graphqlOperation } from 'aws-amplify'
import { getChatRoom, listMessagesByChatRoom } from '../graphql/queries'

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
    }, [chatRoomID])
    
    // FETCH MESSAGES
    useEffect(() => {
        API.graphql(graphqlOperation(listMessagesByChatRoom, { chatroomID: chatRoomID, sortDirection: 'DESC'})).then(
            result => {
                setMessages(result.data?.listMessagesByChatRoom?.items)
            }
        )
    }, [chatRoomID])

    useEffect(() => {
        navigation.setOptions({ title: route.params.name })
    }, [route.params.name])

    if(!chatRoom) {
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