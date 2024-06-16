import { View, HStack } from 'native-base';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useState } from 'react';

import AppBar from '../component/AppBar';
import Footer from '../component/Footer';
import Search from './Search';
import PlayList from './PlayList';

const MainPage = () => {
  const [selectPage, setSelectPage] = useState(1);

  return (
    <SafeAreaView style={styles.safeArea}>

      <AppBar />

      <View style={styles.gap} />

      {selectPage === 1 ? <Search /> : <PlayList />}

      <HStack px="1" py="3" justifyContent="space-between">
        <Footer setSelectPage={setSelectPage} />
      </HStack>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  gap: {
    height: 10, // 원하는 간격 크기로 설정
  },
});

export default MainPage;