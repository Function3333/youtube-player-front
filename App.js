import { View, StyleSheet } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './page/Login'
import SignUp from './page/SignUp';
import VerifyEmail from './page/VerifyEmail';
import Search from './page/Search';

const Stack = createNativeStackNavigator();
const HEADER_NAME = "Youtube Player"
export default function App() {
  return (
    <NavigationContainer>
        <NativeBaseProvider>
            <Stack.Navigator initialRouteName="Login">
            {/* <Stack.Navigator> */}
                <Stack.Screen name = "Login" component={Login} options={{ title: HEADER_NAME }} />
                <Stack.Screen name = "SiginUp" component={SignUp}/>
                <Stack.Screen name = "VerifyEmail" component={VerifyEmail}/>
                <Stack.Screen name = "Search" component={Search}/>
            </Stack.Navigator>
        </NativeBaseProvider> 
    </NavigationContainer>
  );
}