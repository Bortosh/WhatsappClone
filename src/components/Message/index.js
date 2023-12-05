import { View, Text, StyleSheet } from 'react-native'
import { Auth, API, graphqlOperation } from 'aws-amplify'
import { Entypo } from '@expo/vector-icons';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useEffect, useState } from 'react'
import { updateMessage } from '../../graphql/mutations'
import { onUpdateMessage } from '../../graphql/subscriptions'

dayjs.extend(relativeTime)

const Mesagge = ({ message }) => {


    const [isMe, setIsMe] = useState(false)
    const [favorito, setFavorito] = useState(message.favoritos)

    const isMyMessage = async () => {

        const authUser = await Auth.currentAuthenticatedUser()

        setIsMe(message.userID === authUser.attributes.sub)
    }

    useEffect(() => {
        isMyMessage()
    }, [])

    const addToFavoritos = async () => {
        try {
            setFavorito((prevFavorito) => !prevFavorito);
            
            if (favorito) {
                await API.graphql(graphqlOperation(updateMessage, { input: { id: message.id, favoritos: false } }))
            } else {
                await API.graphql(graphqlOperation(updateMessage, { input: { id: message.id, favoritos: true } }))
            }

        } catch (error) {
            console.error('Error actualizando el mensaje favorito:', error);
        }
    };

    return (
        <View style={[styles.container, {
            backgroundColor: isMe ? '#DCF8C5' : 'white',
            alignSelf: isMe ? 'flex-end' : 'flex-start',
        }]}>
            <Entypo name="heart" size={24} color={favorito ? 'red' : 'gray'} style={styles.favorito} onPress={addToFavoritos} />
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

export default Mesagge;