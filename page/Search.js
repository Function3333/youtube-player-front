import { View, Input, HStack, VStack, Icon, Box, Text, Pressable, Image, Spacer } from 'native-base';
import { Ionicons } from "@expo/vector-icons";
import { SwipeListView } from 'react-native-swipe-list-view';
import { Alert, StyleSheet } from 'react-native';
import { useState, useEffect} from 'react';

import Api from '../utils/Api';
import outputMessages from '../utils/outputMessages.json';
import AppBar from '../component/AppBar';
import Footer from '../component/Footer';
import SecureStore from '../utils/SecureStore';

const Search = () => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [listData, setListData] = useState([]);

    //Start Render Search Result Logic
    useEffect(() => {
      const formattedData = searchResult.map((item, index) => ({
        key : index.toString(),
        id : item.id.videoId,
        title : item.snippet.title,
        channelTitle : item.snippet.channelTitle,
        thumbnailUrl : item.snippet.thumbnails.high.url,
      }));
      setListData(formattedData);
    }, [searchResult]);
  
    const onRowDidOpen = rowKey => {
      console.log('This row opened', rowKey);
    };

    const renderItem = ({ item }) => (
      <Box>
        <Pressable onPress={() => console.log('You touched me')} _dark={{ bg: 'coolGray.800' }} _light={{ bg: '#000000' }}>
          <Box pl="5" pr="5" py="2.5">
            <HStack alignItems="center" space={4}>
              <Image
                size="80px"
                source={{ uri: item.thumbnailUrl }}
                alt={item.title}
                borderRadius={0} // 이미지가 사각형이 되도록 설정
              />
              <VStack>
                <Text
                  color="white"
                  _dark={{ color: 'warmGray.50' }}
                  bold
                  width="280px" // 텍스트 컴포넌트의 최대 너비 설정
                  flexWrap="wrap" // 너비를 넘어갈 경우 줄 바꿈
                  numberOfLines={2} // 최대 한 줄만 표시
                  ellipsizeMode="tail" // 텍스트가 넘칠 경우 ...으로 표시
                >
                  {item.title}
                </Text>
                <Text color="white" _dark={{color: 'warmGray.200'}}>
                  {item.channelTitle}    
                </Text>
              </VStack>
              <Spacer />
            </HStack>
          </Box>
        </Pressable>
      </Box>
    );
    //End Render Search Result Logic

    const addResult = (newResults) => {
      setSearchResult((prevResults) => [...prevResults, ...newResults]);
    };
    
    const onEndReached = async () => {
      const api = new Api();
      const secureStore = new SecureStore();
      const nextPageToken = await secureStore.getNextPageToken();

      console.log(`[Search.js] Next Page Token : ${nextPageToken}`);
      if(searchKeyword !== undefined && nextPageToken !== undefined) {
        const url = "/youtubeSearchList";
        const params = {
          "keyword" : searchKeyword,
          "nextPageToken" : nextPageToken
        }

        api.doGet(url, params)
          .then((response) => {
            const responseData = JSON.parse(response.data.data);
            
            if(responseData !== undefined) {
              addResult(responseData.items);
            }
    
            if(responseData.nextPageToken !== undefined) {
              secureStore.save("nextPageToken", responseData.nextPageToken);
            }
          })
          .catch((error) => {
            Alert.alert(outputMessages['SearchError.title'], outputMessages['SearchError.content']);
            console.log(`[Search.js] onEndReached() Error : ${error}`);
          });
      }
    };

    const handleSearch = async () => {
      const api = new Api();
      const secureStore = new SecureStore();

      if(searchKeyword.length > 0) {
        const url = "/youtubeSearchList";      
        const params = {
          "keyword" : searchKeyword
        }

        api.doGet(url, params).then( async (response) => {
          const responseData = JSON.parse(response.data.data);
          
          if(responseData !== undefined) {
            setSearchResult(responseData.items);
          }
  
          if(responseData.nextPageToken !== undefined) {
            secureStore.save("nextPageToken", responseData.nextPageToken);
          }
        }).catch((error) => {
          Alert.alert(outputMessages['SearchError.title'], outputMessages['SearchError.content']);
          console.error(`[Search.js] Get Search List Failed : ${error}`);
        });
      }
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
              borderRadius="5"
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
          {/* <SearchResult searchResult={searchResult}/> */}
          <Box bg="#000000" safeArea flex="1">
            <SwipeListView
              data={listData}
              renderItem={renderItem}
              //renderHiddenItem={renderHiddenItem}
              rightOpenValue={-130}
              previewRowKey={'0'}
              previewOpenValue={-40}
              previewOpenDelay={3000}
              onRowDidOpen={onRowDidOpen}
              initialNumToRender={10}
              onEndReached={onEndReached}
              // onEndReachedThreshold={0.5}
            />
          </Box>
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