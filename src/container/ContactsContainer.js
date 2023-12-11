import { useState, useEffect } from 'react'
import { API, graphqlOperation, Auth } from 'aws-amplify'
import { listUsers } from '../graphql/queries'
import { useNavigation } from '@react-navigation/native'
import { createChatRoom, createUserChatRoom } from '../graphql/mutations'
import { getCommonChatRoomWithUser } from '../services/chatRoomService'
import ContactsPresentational from '../presentational/ContactsPresentational'

const ContactsContainer = () => {

    const navigation = useNavigation()

    const [users, setUsers] = useState([])

    useEffect(() => {
        API.graphql(graphqlOperation(listUsers)).then((result) => {
            setUsers(result.data?.listUsers?.items)
        })
    }, [])

    const createAChatRoomWithTheUSer = async (user) => {

        const existingChatRoom = await getCommonChatRoomWithUser(user.id)
        if (existingChatRoom) {
            navigation.navigate('Chat', { id: existingChatRoom.chatRoom.id })
            return
        }

        const newChatRoomData = await API.graphql(graphqlOperation(createChatRoom, { input: {} }))

        if (!newChatRoomData.data?.createChatRoom) {
            console.log('error creating chat room')
        }

        const newChatRoom = newChatRoomData.data?.createChatRoom

        // ADD THE CLICKED USER TO THE CHATROOM
        await API.graphql(graphqlOperation(createUserChatRoom, {
            input: {
                chatRoomId: newChatRoom.id,
                userId: user.id
            }
        }))

        // ADD THE AUTH TO THE CHATROOM
        const authUser = await Auth.currentAuthenticatedUser();
        await API.graphql(graphqlOperation(createUserChatRoom, {
            input: {
                chatRoomId: newChatRoom.id,
                userId: authUser.attributes.sub
            }
        }))

        // NAVIGATE TO THE NEWLY CREATED CHATROOM
        navigation.navigate('Chat', { id: newChatRoom.id })

    }

    return (
        <ContactsPresentational
            createAChatRoomWithTheUSer={createAChatRoomWithTheUSer}
            users={users}
        />
    )
}

export default ContactsContainer;