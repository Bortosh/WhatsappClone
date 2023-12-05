import { useEffect, useState } from 'react'
import { View, ImageBackground, StyleSheet, FlatList, KeyboardAvoidingView, Modal, ActivityIndicator, Text, Button } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import Mesagge from '../components/Message'
import InputBox from '../components/InputBox'
import { API, graphqlOperation } from 'aws-amplify'
import { getChatRoom, listMessagesByChatRoom } from '../graphql/queries'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import { onCreateMessage, onUpdateChatRoom } from '../graphql/subscriptions'
import { EvilIcons } from '@expo/vector-icons';

import { Feather } from '@expo/vector-icons'

import bg from '../../assets/images/BG.png'
import messages from '../../assets/data/messages.json'
import CustomHeaderButton from '../components/CustomHeaderButton'

const ChatScreen = () => {

    const [chatRoom, setChatRoom] = useState(null)
    const [messages, setMessages] = useState([])

    // console.log(JSON.stringify(messages))

    const route = useRoute()
    const navigation = useNavigation()

    const chatRoomID = route.params.id

    // FETCH CHAT ROOM
    useEffect(() => {
        API.graphql(graphqlOperation(getChatRoom, { id: chatRoomID })).then(
            result => setChatRoom(result.data?.getChatRoom)
        )

        const subscription = API.graphql(graphqlOperation(onUpdateChatRoom, { filter: { id: { eq: chatRoomID } } })
        ).subscribe({
            next: ({ value }) => {
                setChatRoom((cr) => ({
                    ...(cr || {}),
                    ...value.data.onUpdateChatRoom
                }))
            },
            error: err => console.warn(err)
        })

        return () => subscription.unsubscribe()
    }, [chatRoomID])

    // FETCH MESSAGES
    useEffect(() => {
        API.graphql(graphqlOperation(listMessagesByChatRoom, { chatroomID: chatRoomID, sortDirection: 'DESC' })).then(
            result => {
                setMessages(result.data?.listMessagesByChatRoom?.items)
            }
        )

        // SUBSCRIBE TO NEW MESSAGES
        // AQUI NO TIENE EL FILTRO EL CUAL NOTIFICA SOLAMENTE EL MENSAJE PARA CADA ROOM EN ESPECIFICO, AL PARECER ES UN TEMA CON EL UPSYNC EN AWS QUE MAS ADELANTE PODRIAMOS SOLVENTAR, IGUAL EL CODIGO CON EL FILTRO ESTA COMENTADO ABAJO DEL COMPONENTE
        // DE IGUAL MODO FUNCIONA A TIEMPO REAL PERFECTO!!
        const subscription = API.graphql(graphqlOperation(onCreateMessage)).subscribe({
            next: ({ value }) => {
                setMessages((m) => [value.data.onCreateMessage, ...m])
            },
            error: (err) => console.warn(err)
        })

        return () => subscription.unsubscribe()

    }, [chatRoomID])






    const [modalVisible, setModalVisible] = useState(false);

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };






    useEffect(() => {
        navigation.setOptions({
            title: route.params.name,
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    <Item
                        title="GroupInfo"
                        iconName="more-vertical"
                        onPress={() => navigation.navigate('Group Info', { id: chatRoomID })}
                    />
                    <Item
                        title="Star"
                        iconName="star"
                        onPress={() => {
                            openModal()
                        }}
                    />
                </HeaderButtons>
            ),
        });
    }, [route.params.name, chatRoomID]);













    // useEffect(() => {
    //     navigation.setOptions({ title: route.params.name, headerRight: () => (
    //     <Feather
    //     onPress={() => navigation.navigate('Group Info', {id: chatRoomID})}
    //     name="more-vertical" 
    //     size={24} 
    //     color="gray" 
    //     />

    //     ) })
    // }, [route.params.name, chatRoomID])

















    if (!chatRoom) {
        return <ActivityIndicator />
    }

    return (

        <KeyboardAvoidingView
            // behavior={Platform.OS === 'ios' ? 60 : 90}
            style={styles.bg}
        >

            <ImageBackground source={bg} style={styles.bg}>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible} // Utiliza la variable de estado para controlar la visibilidad
                    onRequestClose={closeModal}
                >
                    {/* Contenido del modal */}
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text>Contenido del Modal</Text>
                            <Button title="Cerrar Modal" onPress={closeModal} />
                        </View>
                    </View>
                </Modal>

                <FlatList
                    data={messages}
                    renderItem={({ item }) => <Mesagge message={item} />}
                    style={styles.list}
                    inverted
                />
                <InputBox chatroom={chatRoom} />
            </ImageBackground>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    bg: {
        flex: 1
    },
    list: {
        padding: 10
    }
})

export default ChatScreen;



// SUBSCRIBE TO NEW MESSAGES
//     const subscription = API.graphql(graphqlOperation(onCreateMessage, {
//         filter: {chatRoomID: { eq: chatRoomID }}
//     })).subscribe({
//         next: ({ value }) => {
//             setMessages((m) => [value.data.onCreateMessage, ...m])
//         },
//         error: (err) => console.warn(err)
//     })

//     return () => subscription.unsubscribe()

// }, [chatRoomID])