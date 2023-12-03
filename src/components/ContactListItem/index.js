import { Image, StyleSheet, Text, View, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { API, graphqlOperation, Auth } from 'aws-amplify'
import { createChatRoom, createUserChatRoom } from '../../graphql/mutations'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const ContactListItem = ({ user }) => {

    
    const navigation = useNavigation()
    
    const onPress = async () => {

        const newChatRoomData = await API.graphql(graphqlOperation(createChatRoom, { input: {}}))

        console.log(newChatRoomData)

        if(!newChatRoomData.data?.createChatRoom) {
            console.log('error creating chat room')
        }

        const newChatRoom = newChatRoomData.data?.createChatRoom

        // ADD THE CLICKED USER TO THE CHATROOM
        await API.graphql(graphqlOperation(createUserChatRoom, { input: {
            chatRoomId: newChatRoom.id,
            userId: user.id
        } }))

        // ADD THE AUTH TO THE CHATROOM
        const authUser = await Auth.currentAuthenticatedUser();
        await API.graphql(graphqlOperation(createUserChatRoom, { input: {
            chatRoomId: newChatRoom.id,
            userId: authUser.attributes.sub
        } }))

        // NAVIGATE TO THE NEWLY CREATED CHATROOM
        navigation.navigate('Chat', { id: newChatRoom.id })

    }


    return (
        <Pressable onPress={onPress} style={styles.container}>
            <Image
                source={{ uri: user.image }}
                style={styles.image}
            />
            <View style={styles.content}>
                <Text numberOfLines={1} style={styles.name}>{user.name}</Text>
                <Text numberOfLines={2} style={styles.subTitle}>{user.status}</Text>
            </View>


        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 5,
        height: 70,
        alignItems: 'center'
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10
    },
    name: {
        fontWeight: 'bold'
    },
    subTitle:{
        color: 'gray'
    },
    content: {
        flex: 1
    }


})

export default ContactListItem;