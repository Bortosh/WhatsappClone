import { useState, useEffect } from 'react'
import { FlatList, Text, Pressable } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import ContactListItem from '../components/ContactListItem'
import { API, graphqlOperation, Auth } from 'aws-amplify'
import { listUsers } from '../graphql/queries'
import { useNavigation } from '@react-navigation/native'
import { createChatRoom, createUserChatRoom } from '../graphql/mutations'
import { getCommonChatRoomWithUser } from '../services/chatRoomService'



const ContactsScreen = () => {

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
        // console.log(newChatRoomData)

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
        <FlatList
            data={users}
            renderItem={({ item }) => <ContactListItem user={item} onPress={() => createAChatRoomWithTheUSer(item)} />}
            style={{ backgroundColor: 'white' }}
            ListHeaderComponent={() => (
                <Pressable
                    onPress={() => { navigation.navigate('New Group') }}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 15,
                        paddingHorizontal: 20
                    }}
                >
                    <MaterialIcons
                        name='group'
                        size={24}
                        color='royalblue'
                        style={{
                            marginRight: 20,
                            backgroundColor: 'gainsboro',
                            padding: 7,
                            borderRadius: 20,
                            overflow: 'hidden'
                        }}
                    />
                    <Text style={{ color: 'royalblue', fontSize: 16 }}>New Group</Text>
                </Pressable>
            )}
        />
    )
}

export default ContactsScreen;