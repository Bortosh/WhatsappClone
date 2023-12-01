import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'

const NotImplementedScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Not Implemented!</Text>
            <Image 
                source={{
                    uri: 'https://e7.pngegg.com/pngimages/649/920/png-clipart-android-mobile-app-development-mobile-phones-application-software-android-photography-repair.png'
                }}
                style={styles.image}
                resizeMode='contain'
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 18,
        fontWeight: '500',
        color: 'gray'
    },
    image: {
        width: '80%',
        aspectRatio: 2 / 1
    }
})

export default NotImplementedScreen;