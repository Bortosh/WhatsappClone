import { useEffect } from 'react'
import { View, ImageBackground, StyleSheet, FlatList, KeyboardAvoidingView, Modal, Text } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import Mesagge from '../components/Message'
import InputBox from '../components/InputBox'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import bg from '../../assets/images/BG.png'
import CustomHeaderButton from '../components/CustomHeaderButton'
import ListFavorites from '../components/ListFavorites.js/index.js'

const ChatPresentational = ({openModal, closeModal, modalVisible, allFavoritos, messages, chatRoom, chatRoomID}) => {

    const route = useRoute()

    const navigation = useNavigation()

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


    return (

        <KeyboardAvoidingView
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
                                            renderItem={({ item }) => <ListFavorites item={item} />}
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

export default ChatPresentational;