import { View, StyleSheet } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import Login from './component/login'

export default function App() {
  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <Login/>
      </View> 
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
