import { View, HStack } from 'native-base';
import { StyleSheet } from 'react-native';
import { useState } from 'react';

import AppBar from '../component/AppBar';
import Footer from '../component/Footer';
import Search from './Search';
import PlayList from './PlayList';

const MainPage = () => {
    const [selectPage, setSelectPage] = useState(1);

    return(
        <View style={styles.container}>
          
          <AppBar/>

          {selectPage === 1 ? <Search /> : <PlayList />}

          <HStack px="1" py="3"  justifyContent="space-between">
            <Footer setSelectPage={setSelectPage}/>
          </HStack>
        </View>
    )
}

const styles = StyleSheet.create({
    inputText : {
      color : "white"
    },
    container: {
      flex: 1,
      backgroundColor: '#000000',
      alignItems: 'center',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    searchContainer: {
      width: "100%",
      alignItems: 'center',
      // marginBottom: 10,
      marginTop: 40,
    },
});

export default MainPage;