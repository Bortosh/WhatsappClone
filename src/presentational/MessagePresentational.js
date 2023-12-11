import { View, Text, StyleSheet } from 'react-native'
import { Entypo } from '@expo/vector-icons';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const MesaggePresentational = ({ message, addToFavorites, isMe, favorito }) => {

    return (
        <View style={[styles.container, {
            backgroundColor: isMe ? '#DCF8C5' : 'white',
            alignSelf: isMe ? 'flex-end' : 'flex-start',
        }]}>
            <Entypo name="heart" size={24} color={favorito ? 'red' : 'gray'} style={styles.favorito} onPress={addToFavorites} />
            <Text>{message.text}</Text>
            <Text style={styles.time}>{dayjs(message.createdAt).fromNow(true)}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 5,
        padding: 10,
        borderRadius: 10,
        maxWidth: '80%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 1,
    },
    time: {
        color: 'gray',
        alignSelf: 'flex-end'
    },
    favorito: {
        alignSelf: 'flex-end'
    }
})

export default MesaggePresentational;