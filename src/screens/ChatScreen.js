import { useEffect, useState } from 'react'
import { View, ImageBackground, StyleSheet, FlatList, KeyboardAvoidingView, Modal, ActivityIndicator, Text, Button } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import Mesagge from '../components/Message'
import InputBox from '../components/InputBox'
import { API, graphqlOperation } from 'aws-amplify'
import { getChatRoom, listMessagesByChatRoom } from '../graphql/queries'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import { onCreateMessage, onUpdateChatRoom } from '../graphql/subscriptions'

import bg from '../../assets/images/BG.png'
import CustomHeaderButton from '../components/CustomHeaderButton'
import ListFavoritos from '../components/ListFavoritos.js'

const ChatScreen = () => {

    const [chatRoom, setChatRoom] = useState(null)
    const [messages, setMessages] = useState([])
    const [modalVisible, setModalVisible] = useState(false);
    const [allFavoritos, setAllFavoritos] = useState({})


    // console.log(JSON.stringify(allFavoritos.data.listMessagesByChatRoom.items))

    const fetchFavoritos = async () => {
        const response = await API.graphql(graphqlOperation(listMessagesByChatRoom, { chatroomID: chatRoom.id, filter: { favoritos: { eq: true } } }))
        setAllFavoritos(response)
    }
    useEffect(() => {
        if (chatRoom) {
            fetchFavoritos()
        }

    }, [chatRoom])

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
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    {/* Contenido del modal */}
                    <ImageBackground source={bg} style={styles.bg}>
                        <View style={styles.modalContainer}>
                            <View style={styles.subContainer}>
                                <Text style={styles.textFavoritos}>Favoritos</Text>
                                <View style={styles.boxBtn}>
                                    <Text style={styles.btn} onPress={closeModal}>X</Text>
                                </View>
                            </View>
                            <View style={styles.modalContent}>
                                {
                                    allFavoritos.data?.listMessagesByChatRoom?.items.length === 0
                                        ? <Text style={styles.warningText}>No hay favoritos</Text>
                                        :
                                        <FlatList
                                            data={allFavoritos.data?.listMessagesByChatRoom?.items}
                                            renderItem={({ item }) => <ListFavoritos item={item} />}
                                        />
                                }
                            </View>
                        </View>
                    </ImageBackground>
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
    },
    modalContainer: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        width: 350,
        height: 500,
        top: 150,
        borderRadius: 20,
        maxHeight: '80%',
        overflow: 'hidden',
    },
    modalContent: {
        margin: 10,
        minWidth: '60%',
        flexDirection: 'row',
        flex: 1,
        overflow: 'hidden',
    },
    btn: {
        color: '#000',
        fontSize: 20,
        left: 8.5
    },
    boxBtn: {
        backgroundColor: '#ECE5DD80',
        width: 30,
        borderRadius: 4
    },
    subContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10,
        width: '80%',
        alignItems: 'center',
    },
    textFavoritos: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#4b793f',
        left: 80
    },
    warningText: {
        fontSize: 30,
        fontWeight: 'bold',
        alignSelf: 'center',
    }
})

export default ChatScreen;

