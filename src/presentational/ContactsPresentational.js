import { FlatList, Text, Pressable } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import ContactListItem from '../components/ContactListItem'
import { useNavigation } from '@react-navigation/native'

const ContactsPresentational = ({ createAChatRoomWithTheUSer, users }) => {

    const navigation = useNavigation()

    return (
        <FlatList
            data={users}
            renderItem={({ item }) => <ContactListItem user={item} onPress={() => createAChatRoomWithTheUSer(item)} />}
            style={{ backgroundColor: 'white' }}
            ListHeaderComponent={() => (
                <Pressable
                    onPress={() => { navigation.navigate('New Group') }}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 15,
                        paddingHorizontal: 20
                    }}
                >
                    <MaterialIcons
                        name='group'
                        size={24}
                        color='royalblue'
                        style={{
                            marginRight: 20,
                            backgroundColor: 'gainsboro',
                            padding: 7,
                            borderRadius: 20,
                            overflow: 'hidden'
                        }}
                    />
                    <Text style={{ color: 'royalblue', fontSize: 16 }}>New Group</Text>
                </Pressable>
            )}
        />
    )
}

export default ContactsPresentational