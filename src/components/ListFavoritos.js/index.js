import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const ListFavoritos = ({item}) => {

    // console.log(JSON.stringify(item))

    return (
        <View style={styles.container}>
            <Text>{item.text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#DCF8C5',
        padding: 8,
        margin: 8,
        borderRadius: 8
    }
})

export default ListFavoritos;