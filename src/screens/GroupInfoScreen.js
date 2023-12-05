import { useState, useEffect } from 'react'
import { StyleSheet, FlatList, View, Text, ActivityIndicator, Alert } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { deleteUserChatRoom } from '../graphql/mutations'

import { API, graphqlOperation } from 'aws-amplify'
import { onUpdateChatRoom } from '../graphql/subscriptions'
import ContactListItem from '../components/ContactListItem'

const ChatRoomInfo = () => {

    const [chatRoom, setChatRoom] = useState(null)
    const [userToDelete, setUsersToDelete] = useState([])
    const [users, setUsers] = useState([])

    // console.log(JSON.stringify(users))

    const route = useRoute()
    
    const chatroomID = route.params.id
    
    useEffect(() => {
        API.graphql(graphqlOperation(getChatRoom, { id: chatroomID })).then(
            (result) => {
                setChatRoom(result.data?.getChatRoom)
            })

        // SUBSCRIBE TO onUpdateChatRoom
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
        // NO HAGO LA ELIMINACION REAL EN LA BASE DE DATOS PORQUE REALMENTE NO SE ELIMINA DE LA BASE DE DATOS, QUE HACE ES PASAR A UN ESTADO TTL (TIME TO LEAVE)
        // EL CUAL SIGNIFICA QUE VA A SER ELIMINADO DE LA BASE DE DATOS EN UN PERIODO DE TIEMPO DE 30 DIAS, ENTONCES AUN PERMANECE EN LA BASE DE DATOS
        // PARA SOLVENTAR ESTE TEMA, POR AHORA LREALICE LA ELIMINACION MANUAL Y LOGICA, PERO NO CON BASE DE DATOS Y MUTATIONS,
        // LO QUE TENGO QUE HACER ES CREAR UNA PROPIEDAD LLAMADA "ELIMINADO" Y ESTA PASE A TRUE EN EL CASO DE QUE HAYA SIDO ELIMINADO
        // EL USUARIO

        // const response = await API.graphql(graphqlOperation(deleteUserChatRoom, {input: {id: chatRoomUser.id}}))
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
        <View style={styles.container}>
            <Text style={styles.title}>{chatRoom.name}</Text>

            <Text style={styles.sectionTitle}>{users.length} Participants</Text>
            <View style={styles.section}>
                <FlatList
                    data={users}
                    renderItem={({ item }) => <ContactListItem user={item.user} onPress={() => onContactPress(item)} />}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1
    },
    title: {
        fontWeight: 'bold',
        fontSize: 30
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 20
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 5,
        marginVertical: 10
    }
})

export default ChatRoomInfo;

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

// export const getChatRoom = /* GraphQL */ `
//     query GetChatRoom($id: ID!) {
//         getChatRoom(id: $id) {
//             id
//             updatedAt
//             users{
//                 items{
//                     id
//                     chatRoomId
//                     userId
//                     createdAt
//                     updatedAt
//                     _version
//                     _deleted
//                     _lastChangedAt
//                     user {
//                         id
//                         name
//                         status
//                         image
//                     }
//                 }
//                 nextToken
//                 startedAt
//             }
//             createdAt
//             _version
//             _deleted
//             _lastChangedAt
//             chatRoomLastMessageId
//         }
//     }
// `