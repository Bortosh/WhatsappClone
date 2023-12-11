import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MainTabNavigator from './MainTabNavigator';
import NewGroupContainer from '../container/NewGroupContainer';
import ChatRoomInfoContainer from '../container/GroupInfoContainer';
import ContactsContainer from '../container/ContactsContainer';
import ChatContainer from '../container/ChatContainer';

const Stack = createNativeStackNavigator();

const Navigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerStyle: {backgroundColor: 'whitesmoke'}}}>
                <Stack.Screen name='Home' component={MainTabNavigator} options={{headerShown:false}} />
                <Stack.Screen name='Chat' component={ChatContainer} />
                <Stack.Screen name='Group Info' component={ChatRoomInfoContainer} />
                <Stack.Screen name='Contacts' component={ContactsContainer} />
                <Stack.Screen name='New Group' component={NewGroupContainer} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigator;