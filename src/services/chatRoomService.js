import { API, graphqlOperation, Auth } from 'aws-amplify'

export const getCommonChatRoomWithUser = async (userID) => {

    const authUSer = await Auth.currentAuthenticatedUser()

    const response = await API.graphql(graphqlOperation(listChatRooms, {id: authUSer.attributes.sub}))

    const chatRooms = response.data?.getUser?.ChatRooms?.items || []

    const chatRoom = chatRooms.find((chatRoomItem) => chatRoomItem.chatRoom.users.items.some((userItem) => userItem.user.id === userID))

    return chatRoom
}



export const listChatRooms = /* GraphQL */  `
    query GetUser($id: ID!) {
        getUser(id: $id) {
            id
            ChatRooms {
                items {
                    chatRoom {
                        id
                        users {
                            items {
                                user {
                                    id
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;