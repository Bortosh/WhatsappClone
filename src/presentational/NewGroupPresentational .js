import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Button } from 'react-native';
import ContactListItem from '../components/ContactListItem';
import TextInputComponent from './reusable/TextInputComponent';
import { useNavigation } from '@react-navigation/native';

const NewGroupPresentational = ({
    name,
    users,
    selectedUserIds,
    onNameChange,
    onContactPress,
    onCreateGroupPress,
}) => {

    const navigation = useNavigation()

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button title='Create' disabled={!name || selectedUserIds.length < 2} onPress={onCreateGroupPress} />
            )
        })
    }, [name, selectedUserIds])

    return (
        <View style={styles.container}>
            <TextInputComponent
                placeholder='Group name'
                value={name}
                onChangeText={onNameChange}
            />
            <FlatList
                data={users}
                renderItem={({ item }) => (
                    <ContactListItem
                        user={item}
                        selectable
                        onPress={() => onContactPress(item.id)}
                        isSelected={selectedUserIds.includes(item.id)}
                    />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { backgroundColor: 'white' },
});

export default NewGroupPresentational;
