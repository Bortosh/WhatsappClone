import { API, graphqlOperation, Auth } from 'aws-amplify'
import { listChatRoomsServices } from '../screens/ChatsScreen/queries'

export const getCommonChatRoomWithUser = async (userID) => {

    const authUSer = await Auth.currentAuthenticatedUser()

    const response = await API.graphql(graphqlOperation(listChatRoomsServices, { id: authUSer.attributes.sub }))

    const chatRooms = response.data?.getUser?.ChatRooms?.items || []

    const chatRoom = chatRooms.find((chatRoomItem) => {
        return chatRoomItem.chatRoom.users.items.length === 2 &&
            chatRoomItem.chatRoom.users.items.some(
                (userItem) => userItem.user.id === userID
            )
    })

    return chatRoom
}