import { View, Input, HStack, VStack, Icon, Box, Text, Pressable, Image, Spacer } from 'native-base';
import { Ionicons } from "@expo/vector-icons";
import { SwipeListView } from 'react-native-swipe-list-view';
import { Alert, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Api from '../utils/Api';
import outputMessages from '../utils/outputMessages.json';
import SecureStore from '../utils/SecureStore';
import apiResponse from '../enums/apiResponse';
import { addSearch, setNewSearch } from '../redux/searchSlice';
import { increase, decrease, reset } from '../redux/pageIndexSlice';

const Search = () => {
  const reduxSearch = useSelector((state) => state.search);
  const reduxPageIndex = useSelector((state) => state.pageIndex.value);
  const dispatch = useDispatch();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [listData, setListData] = useState([]);

  useEffect(() => {
    const payloads = reduxSearch.map(item => item.payload).flat();

    if(payloads) {
      setSearchResult(payloads);
    }
  },[]);

  useEffect(() => {    
    if(searchResult) {
      const formattedData = searchResult.map((item, index) => ({
        key: index,
        id: item.id,
        title: item.title,
        channelTitle: item.channelTitle,
        thumbnailUrl: item.thumbnailUrl,
        length : item.length
      }));
  
      setListData(formattedData);
    }
  }, [searchResult]);

  const renderItem = ({ item }) => (
    <Box>
      <Pressable onPress={() => handleOnPress(item.id, item.title, item.channelTitle,item.thumbnailUrl, item.length)} _dark={{ bg: 'coolGray.800' }} _light={{ bg: '#000000' }}>
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
                width="280px" 
                flexWrap="wrap" 
                numberOfLines={2} 
                ellipsizeMode="tail" 
              >
                {item.title}
              </Text>
              <Text color="white" _dark={{ color: 'warmGray.200' }}>
                {item.channelTitle}
              </Text>

              <Text color="white" _dark={{ color: 'warmGray.200' }} style={{ fontSize: 12 }}>
                {item.length}
              </Text>
            </VStack>
            <Spacer />
          </HStack>
        </Box>
      </Pressable>
    </Box>
  );

  const onEndReached = async () => {
    const api = new Api();
    const secureStore = new SecureStore();
    const nextPageToken = await secureStore.getNextPageToken();

    if ((searchKeyword !== undefined) && (searchKeyword.length > 0) && (nextPageToken !== undefined)) {
      const url = "/youtubeSearchList";
      const params = {
        "keyword": searchKeyword,
        "nextPageToken": nextPageToken
      }

      api.doGet(url, params)
        .then(async (response) => {
          const responseData = JSON.parse(response.data.data);

          const savedSearchResult = await secureStore.getSearchResult();

          if(savedSearchResult) {
            await secureStore.saveSearchResult(JSON.stringify(addSearhResult(savedSearchResult, responseData.item)));
          } else {
            if(responseData) {
              addResult(responseData.items);
            }
          }

          if (responseData.nextPageToken !== undefined) {
            secureStore.save("nextPageToken", responseData.nextPageToken);
          }
        })
        .catch((error) => {
          Alert.alert(outputMessages['SearchError.title'], outputMessages['SearchError.content']);
          console.log(`[Search.js] onEndReached() Error : ${error}`);
        });
    }
  };

  const addResult = (newResults) => {
    setSearchResult((prevResults) => [...prevResults, ...newResults]);
  };

  const addSearhResult = (previousResult, newResult) => {
    return [...previousResult, ...newResult];
  }

  const handleSearch = async () => {
    const api = new Api();

    if (searchKeyword.length > 0) {
      const url = "/youtubeSearchList";
      const params = {
        "keyword": searchKeyword
      }

      api.doGet(url, params).then((response) => {
        const responseData = response.data;
        const responseResult = responseData.result;
        const data = responseData.data;

        if ((responseResult === apiResponse.SUCCESS) && data) {
          setSearchResult(data);
          dispatch(addSearch(data));
        }

      }).catch((error) => {
        Alert.alert(outputMessages['SearchError.title'], outputMessages['SearchError.content']);
        console.error(`[Search.js] Get Search List Failed : ${error}`);
      });
    }
  }

  const extractAudioRequest = (id, title, channelTitle, thumbnailUrl, length) => {
    if (id && title && channelTitle && thumbnailUrl && length) {
      const api = new Api();
      const url = "/audio";
      const params = {
        "id": id,
        "title": title,
        "channelTitle" : channelTitle,
        "thumbnailUrl": thumbnailUrl,
        "length" : length
      };

      api.doPost(url, params)
        .then((response) => {
          const result = response.data.result;

          if (result === apiResponse.SUCCESS) {
            Alert.alert(outputMessages['Search.extractAudio.success']);

          } else {
            Alert.alert(outputMessages['Search.extractAudio.fail.title'], outputMessages['Search.extractAudio.fail.content']);
          }
        })
        .catch((error) => {
          console.log(`[Search.js] extractAudioRequest() Error :  ${error}`);
          Alert.alert(outputMessages['Search.extractAudio.fail.title'], outputMessages['Search.extractAudio.fail.content']);
        });
    }
  }

  const handleOnPress = (id, title, channelTitle, thumbnailUrl, length) => {
    Alert.alert(
      outputMessages['Search.handleOnPress'],
      '',
      [
        {
          text: "예",
          onPress: () => {
            extractAudioRequest(id, title, channelTitle, thumbnailUrl, length);
          }
        },
        {
          text: "아니오",
        }
      ],
      { cancelable: false }
    );
  }

  return (
    <View style={styles.container}>
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
          _hover={{ bg: "gray.600" }}
          InputLeftElement={
            <Icon ml="2" size="4" color="gray.400" as={<Ionicons name="search" />} />
          }
        />
        <Box bg="#000000" flex="0">
          <SwipeListView
            data={listData}
            renderItem={renderItem}
            rightOpenValue={-130}
            previewRowKey={'0'}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            initialNumToRender={10}
            onEndReached={onEndReached}
          />
        </Box>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  inputText: {
    color: "white",
    fontSize: 14
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
    marginBottom: 50,
    // marginTop: 0,
  },
});

export default Search;