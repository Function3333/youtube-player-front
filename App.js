import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import TrackPlayer from 'react-native-track-player';

import store from './redux/store';
import Login from './page/Login'
import SignUp from './page/SignUp';
import VerifyEmail from './page/VerifyEmail';
import Search from './page/Search';
import PlayList from './page/PlayList';
import MainPage from './page/MainPage';

const Stack = createNativeStackNavigator();
const HEADER_NAME = "Y Music"

export default function App() {

  useEffect(() => {
    LogBox.ignoreAllLogs();

    const setupPlayer = async () => {
      await TrackPlayer.setupPlayer({});

      TrackPlayer.registerPlaybackService(() => require('./component/playBack'));
      TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
          TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
          TrackPlayer.CAPABILITY_SEEK_TO
        ],
        compactCapabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
          TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS
        ],
        notificationCapabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
          TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS
        ],
      })
    }

    setupPlayer();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <NativeBaseProvider>
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} options={{ title: HEADER_NAME }} />
            <Stack.Screen name="SiginUp" component={SignUp} />
            <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="PlayList" component={PlayList} />
            <Stack.Screen name="MainPage" component={MainPage} />
          </Stack.Navigator>
        </NativeBaseProvider>
      </NavigationContainer>
    </Provider>
  );
}