import { useState, useEffect } from 'react'
import { ActivityIndicator, Alert } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { getChatRoom } from '../screens/ChatsScreen/queries'

import { API, graphqlOperation } from 'aws-amplify'
import { onUpdateChatRoom } from '../graphql/subscriptions'
import GroupInfoPresentational from '../presentational/GroupInfoPresentational'

const ChatRoomInfoContainer = () => {

    const route = useRoute()
    const chatroomID = route.params.id

    const [chatRoom, setChatRoom] = useState(null)
    const [userToDelete, setUsersToDelete] = useState([])
    const [users, setUsers] = useState([])

    
    useEffect(() => {
        API.graphql(graphqlOperation(getChatRoom, { id: chatroomID })).then(
            (result) => {
                setChatRoom(result.data?.getChatRoom)
            })

        const subscription = API.graphql(
            graphqlOperation(onUpdateChatRoom, {
                filter: { id: { eq: chatroomID } }
            })
        ).subscribe({
            next: ({ value }) => {
                setChatRoom((cr) => ({
                    ...(cr || {}),
                    ...value.data.onUpdateChatRoom
                }))
            },
            error: error => console.warn(error)
        })
        return () => subscription.unsubscribe()
    }, [chatroomID])

    const removeChatRoomUser = async (chatRoomUser) => {
        setUsersToDelete(chatRoomUser.id)
    }

    const onContactPress = (chatRoomUser) => {
        Alert.alert('Removing the user', `Are you sure you want to remove ${chatRoomUser.user.name} from this group`,
    [
        {
            text: 'Cancel',
            style: 'cancel'
        },
        {
            text: 'Remove',
            style: 'destructive',
            onPress: () => removeChatRoomUser(chatRoomUser)
        }
    ]
        )
    }

    if (!chatRoom) {
        return <ActivityIndicator />
    }
    
    if(userToDelete !== '') {
        const usuarios = chatRoom.users.items.filter(item => item.id !== userToDelete)
        setUsers(usuarios)
        setUsersToDelete('')
    }

    return (
        <GroupInfoPresentational onContactPress={onContactPress} chatRoom={chatRoom} users={users}/>
    )
}

export default ChatRoomInfoContainer;