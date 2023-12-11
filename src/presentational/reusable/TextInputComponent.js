import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const TextInputComponent = ({ placeholder, value, onChangeText }) => {
    return (
        <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            style={styles.input}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: 'lightgray',
        padding: 10,
        margin: 10,
    },
});

export default TextInputComponent;
