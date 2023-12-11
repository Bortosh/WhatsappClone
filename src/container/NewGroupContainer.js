import React, { useState, useEffect } from 'react';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { listUsers } from '../graphql/queries';
import { createChatRoom, createUserChatRoom } from '../graphql/mutations';
import NewGroupPresentational from '../presentational/NewGroupPresentational ';

const NewGroupContainer = () => {
    const [users, setUsers] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [name, setName] = useState('');



    useEffect(() => {
        API.graphql(graphqlOperation(listUsers)).then((result) => {
            setUsers(result.data?.listUsers?.items);
        });
    }, []);

    const onCreateGroupPress = async ({ navigation }) => {
        const newChatRoomData = await API.graphql(graphqlOperation(createChatRoom, { input: { name } }))

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
        <NewGroupPresentational
            name={name}
            users={users}
            selectedUserIds={selectedUserIds}
            onNameChange={setName}
            onContactPress={onContactPress}
            onCreateGroupPress={onCreateGroupPress}
        />
    );
};

export default NewGroupContainer;
