export const listChatRooms = /* GraphQL */ `
    query GetUser($id: ID!) {
        getUser(id: $id) {
        id
        ChatRooms {
            items {
            chatRoom {
                id
                updatedAt
                name
                image
                users {
                items {
                    user {
                    id
                    image
                    name
                    }
                }
                }
                LastMessage {
                id
                createdAt
                text
                }
            }
            }
        }
        }
    }
`;

export const getChatRoom = /* GraphQL */ `
    query GetChatRoom($id: ID!) {
        getChatRoom(id: $id) {
        id
        updatedAt
        users {
            items {
            id
            chatRoomId
            userId
            createdAt
            updatedAt
            user {
                id
                name
                status
                image
            }
            }
            nextToken
        }
        createdAt
        chatRoomLastMessageId
        name
        }
    }
`;

export const listChatRoomsServices = /* GraphQL */  `
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