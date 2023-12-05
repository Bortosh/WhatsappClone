import { View, TextInput, StyleSheet } from 'react-native'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { API, graphqlOperation, Auth } from 'aws-amplify'
import { createMessage, updateChatRoom } from '../../graphql/mutations'

const InputBox = ({ chatroom }) => {

    const [text, setText] = useState('')

    const onSend = async () => {

        const authUser = await Auth.currentAuthenticatedUser()

        const newMessage = {
            chatroomID: chatroom.id,
            text,
            userID: authUser.attributes.sub,
            favoritos: false
        }

        const newMessageData = await API.graphql(graphqlOperation(
            createMessage, { input: newMessage }
        ))

        setText('')

        // SET THE NEW MESSAGE AS LASTMESSAGE OF THE CHATROOM
        await API.graphql(graphqlOperation(
            updateChatRoom, {
            input: {
                _version: chatroom._version,
                chatRoomLastMessageId: newMessageData.data.createMessage.id, 
                id: chatroom.id
            }
        })
        )

    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']} >

            <AntDesign name='plus' size={20} color='royalblue' />

            <TextInput style={styles.input} placeholder='type your message...' value={text} onChangeText={setText} />

            <MaterialIcons style={styles.send} name='send' size={16} color='white' onPress={onSend} />

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'whitesmoke',
        padding: 6,
        paddingHorizontal: 10,
        alignItems: 'center',
        // marginBottom: -20   //MAYBE ITS NEEDS TO REMOVE FROM HERE
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 50,
        borderColor: 'lightgray',
        borderWidth: StyleSheet.hairlineWidth,
        marginHorizontal: 10,
    },
    send: {
        backgroundColor: 'royalblue',
        padding: 7,
        borderRadius: 15,
        overflow: 'hidden'
    }
})

export default InputBox;