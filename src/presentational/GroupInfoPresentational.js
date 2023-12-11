import React from "react";
import { StyleSheet, FlatList, View, Text } from 'react-native'
import ContactListItem from "../components/ContactListItem";

const GroupInfoPresentational = ({onContactPress, chatRoom, users}) => {


    return (
        <View style={styles.container}>
            <Text style={styles.title}>{chatRoom.name}</Text>

            <Text style={styles.sectionTitle}>{users.length} Participants</Text>
            <View style={styles.section}>
                <FlatList
                    data={users}
                    renderItem={({ item }) => <ContactListItem user={item.user} onPress={() => onContactPress(item)} />}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1
    },
    title: {
        fontWeight: 'bold',
        fontSize: 30
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 20
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 5,
        marginVertical: 10
    }
})

export default GroupInfoPresentational;