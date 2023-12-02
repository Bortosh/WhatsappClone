import { View, StyleSheet, Button } from 'react-native'
import { Auth } from 'aws-amplify'

const SettingsScreen = () => {
    return (
        <View style={styles.container}>
            <Button onPress={() => Auth.signOut()} title='Sing out'/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default SettingsScreen;