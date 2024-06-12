import { View, HStack } from 'native-base';
import { StyleSheet } from 'react-native';
import { useState } from 'react';

import AppBar from '../component/AppBar';
import Footer from '../component/Footer';
import Search from './Search';
import PlayList from './PlayList';

const MainPage = () => {
  const [selectPage, setSelectPage] = useState(1);

  return (
    <View style={styles.container}>

      <AppBar />

      {selectPage === 1 ? <Search /> : <PlayList />}

      <HStack px="1" py="3" justifyContent="space-between">
        <Footer setSelectPage={setSelectPage} />
      </HStack>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
});

export default MainPage;