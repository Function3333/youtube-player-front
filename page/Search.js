import { View, Input, HStack, ScrollView, Icon } from 'native-base';
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from 'react-native';
import { useState } from 'react';

import Api from '../utils/Api';
import SecureStore from '../utils/SecureStore';
import AppBar from '../component/AppBar';
import Footer from '../component/Footer';
import SearchResult from './SearchResult';



const Search = () => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    const handleSearch = async () => {
      const api = new Api();
      const url = "/youtubeSearchList";
      const params = {
        "keyword" : searchKeyword
      }

      console.log(`keyword : ${searchKeyword}`);

      api.doGet(url, params)
        .then((response) => {
          console.log(`response : ${JSON.stringify(response)}`);
        })
        .catch((error) => {

        });
    }

    return (
        <View style={styles.container}>
          {/* Start AppBar */}
          <AppBar/>
          {/* End AppBar */}

          {/* Start SearchBar */}
          <View style={styles.searchContainer}>
            <Input
              style={styles.inputText} 
              onChangeText={setSearchKeyword}
              onSubmitEditing={handleSearch}
              placeholder="Search"
              variant="outline"
              width="90%"
              borderRadius="5 "
              py="2"
              px="2"
              _hover={{ bg: "gray.600" }} // 포커스 시 배경 색상 변경
              InputLeftElement={
                <Icon ml="2" size="4" color="gray.400" as={<Ionicons name="search" />} />
              }
            />
          </View>
          {/* End SearchBar */}

          {/* Scrollable Content Start */}
          {/* <ScrollView w="100%" contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}> */}
          <SearchResult/>
          {/* </ScrollView> */}
          {/* Scrollable Content End */}

          {/* Start Footer */}
          <HStack px="1" py="3"  justifyContent="space-between">
            <Footer/>
          </HStack>
          {/* End Footer */}

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
    //   justifyContent: 'space-between',
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

export default Search;