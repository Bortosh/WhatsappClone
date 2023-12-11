import React, { useState, useEffect } from 'react'
import { View, FlatList, TextInput, StyleSheet, Button } from 'react-native'
import ContactListItem from '../components/ContactListItem'
import { API, graphqlOperation, Auth } from 'aws-amplify'
import { listUsers } from '../graphql/queries'
import { useNavigation } from '@react-navigation/native'
import { createChatRoom, createUserChatRoom } from '../graphql/mutations'

const NewGroupScreen = () => {

    const [users, setUsers] = useState([])
    const [selectedUserIds, setSelectedUserIds] = useState([])
    const [name, setName] = useState('')

    const navigation = useNavigation()

    useEffect(() => {
        API.graphql(graphqlOperation(listUsers)).then((result) => {
            setUsers(result.data?.listUsers?.items)
        })
    }, [])

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button title='Create' disabled={!name || selectedUserIds.length < 2} onPress={onCreateGroupPress} />
            )
        })
    }, [name, selectedUserIds])

    const onCreateGroupPress = async () => {
        const newChatRoomData = await API.graphql(graphqlOperation(createChatRoom, { input: {name} }))

        if (!newChatRoomData.data?.createChatRoom) {
            console.log('error creating chat room')
        }

        const newChatRoom = newChatRoomData.data?.createChatRoom

        // ADD THE SELECTED USERS TO THE CHATROOM
        await Promise.all(
            selectedUserIds.map((userID) =>
                API.graphql(graphqlOperation(createUserChatRoom, {
                    input: { chatRoomId: newChatRoom.id, userId: userID }
                })
                )
            )
        )

        // ADD THE AUTH USER TO THE CHATROOM
        const authUser = await Auth.currentAuthenticatedUser();
        await API.graphql(graphqlOperation(createUserChatRoom, {
            input: {
                chatRoomId: newChatRoom.id,
                userId: authUser.attributes.sub
            }
        }))

        setSelectedUserIds([])
        setName('')

        // NAVIGATE TO THE NEWLY CREATED CHATROOM
        navigation.navigate('Chat', { id: newChatRoom.id })

    }

    const onContactPress = (id) => {
        setSelectedUserIds(userIds => {
            if (userIds.includes(id)) {
                return [...userIds].filter((uid) => uid !== id)
            } else {
                return [...userIds, id]
            }
        })
    }

    return (
        <View style={styles.container}>
            <TextInput
                placeholder='Group name'
                value={name}
                onChangeText={setName}
                style={StyleSheet.input}
            />
            <FlatList
                data={users}
                renderItem={({ item }) => (
                    <ContactListItem
                        user={item}
                        selectable
                        onPress={() => onContactPress(item.id)}
                        isSelected={selectedUserIds.includes(item.id)}
                    />
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { backgroundColor: 'white' },
    input: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: 'lightgray',
        padding: 10,
        margin: 10
    }
})


export default NewGroupScreen;