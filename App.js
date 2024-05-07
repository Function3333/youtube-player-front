import { View, StyleSheet } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './component/Login'
import SignUp from './component/SignUp';
import VerifyEmail from './component/VerifyEmail';

const Stack = createNativeStackNavigator();
const HEADER_NAME = "Youtube Player"
export default function App() {
  return (
    <NavigationContainer>
        <NativeBaseProvider>
            <Stack.Navigator initialRouteName="Login">              
                <Stack.Screen name = "Login" component={Login} options={{ title: HEADER_NAME }} />
                <Stack.Screen name = "SiginUp" component={SignUp}/>
                <Stack.Screen name = "VerifyEmail" component={VerifyEmail}/>
            </Stack.Navigator>
        </NativeBaseProvider> 
    </NavigationContainer>
  );
}