import { View, TextInput, StyleSheet } from 'react-native'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const InputBox = () => {

    const [newMessage, setNewMessage] = useState('')

    const onSend = () => {
        console.warn('sending a new message:', newMessage)
        setNewMessage('')
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']} >

            <AntDesign name='plus' size={20} color='royalblue' />

            <TextInput style={styles.input} placeholder='type your message...' value={newMessage} onChangeText={setNewMessage} />

            <MaterialIcons style={styles.send} name='send' size={16} color='white' onPress={onSend} />

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'whitesmoke',
        padding: 6,
        paddingHorizontal: 10,
        alignItems: 'center',
        // marginBottom: -20   //MAYBE ITS NEEDS TO REMOVE FROM HERE
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 50,
        borderColor: 'lightgray',
        borderWidth: StyleSheet.hairlineWidth,
        marginHorizontal: 10,
    },
    send: {
        backgroundColor: 'royalblue',
        padding: 7,
        borderRadius: 15,
        overflow: 'hidden'
    }
})

export default InputBox;