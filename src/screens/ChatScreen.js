import { ImageBackground, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native'
import Mesagge from '../components/Message'
import InputBox from '../components/InputBox'

import bg from '../../assets/images/BG.png'
import messages from '../../assets/data/messages.json'

const ChatScreen = () => {
    return (

        // <KeyboardAvoidingView
        //     // behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        //     style={styles.bgSpace}
        // >
            <ImageBackground source={bg} style={styles.bg}>
                <FlatList
                    data={messages}
                    renderItem={({ item }) => <Mesagge message={item} />}
                    style={styles.list}
                    inverted
                />
                <InputBox />
            </ImageBackground>
        // </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    bg: {
        flex: 1
    },
    list: {
        padding: 10
    },
    bgSpace: {
        flex: 1,
        marginBottom: -50
    }
})

export default ChatScreen;