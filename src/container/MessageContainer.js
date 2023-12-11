import { Auth, API, graphqlOperation } from 'aws-amplify'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useEffect, useState } from 'react'
import { updateMessage } from '../../graphql/mutations'

dayjs.extend(relativeTime)

const MesaggeContainer = ({ message }) => {

    const [isMe, setIsMe] = useState(false)
    const [favorito, setFavorito] = useState(message.favoritos)

    const isMyMessage = async () => {

        const authUser = await Auth.currentAuthenticatedUser()

        setIsMe(message.userID === authUser.attributes.sub)
    }

    useEffect(() => {
        isMyMessage()
    }, [])

    const addToFavorites = async () => {
        try {
            setFavorito((prevFavorito) => !prevFavorito);

            if (favorito) {
                await API.graphql(graphqlOperation(updateMessage, { input: { id: message.id, favoritos: false } }))
            } else {
                await API.graphql(graphqlOperation(updateMessage, { input: { id: message.id, favoritos: true } }))
            }

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <MesaggePresentational
            addToFavorites={addToFavorites}
            message={message}
            isMe={isMe}
            favorito={favorito}
        />
    )
}

export default MesaggeContainer;