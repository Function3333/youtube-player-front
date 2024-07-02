import { View, Input, HStack, VStack, Icon, Box, Text, Pressable, Image, Spacer } from 'native-base';
import { Ionicons } from "@expo/vector-icons";
import { SwipeListView } from 'react-native-swipe-list-view';
import { ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';


import { addSearch, setNewSearch } from '../redux/searchSlice';
import { increaseSearchIndex, resetSearchIndex, setKeyword } from '../redux/searchInfoSlice';
import Api from '../utils/Api';
import outputMessages from '../utils/outputMessages.json';
import apiResponse from '../enums/apiResponse';


const Search = () => {
  const reduxSearch = useSelector((state) => state.search);
  const storedSearchIdx = useSelector((state) => state.searchInfo.searchIdx);
  const storedSearchKeyword = useSelector((state) => state.searchInfo.keyword);

  const [searchResult, setSearchResult] = useState([]);
  const [listData, setListData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  // const [searchIdx, setSearchIdx] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    if (reduxSearch) {
      setSearchResult(reduxSearch);
    }

    if (storedSearchKeyword) {
      setSearchKeyword(storedSearchKeyword);
    }

  }, []);

  useEffect(() => {
    if (searchResult) {
      const formattedData = searchResult.map((item, index) => ({
        key: index,
        id: item.id,
        title: item.title,
        channelTitle: item.channelTitle,
        thumbnailUrl: item.thumbnailUrl,
        length: item.length
      }));

      setListData(formattedData);
    }
  }, [searchResult]);

  const renderItem = ({ item }) => (
    <Box>
      <Pressable onPress={() => handleOnPress(item.id, item.title, item.channelTitle, item.thumbnailUrl, item.length)} _dark={{ bg: 'coolGray.800' }} _light={{ bg: '#000000' }}>
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

    dispatch(increaseSearchIndex());

    if (storedSearchKeyword && storedSearchIdx) {
      setLoading(true);

      const url = "/youtubeSearchList";
      const params = {
        "keyword": storedSearchKeyword,
        "searchIdx": storedSearchIdx
      }

      api.doGet(url, params)
        .then(async (response) => {
          const responseData = response.data;
          const responseResult = responseData.result;
          const data = responseData.data;

          if ((responseResult === apiResponse.SUCCESS) && data) {
            setSearchResult(data);
            dispatch(addSearch(data));
          }
        })
        .catch((error) => {
          Alert.alert(outputMessages['SearchError.title'], outputMessages['SearchError.content']);
          console.log(`[Search.js] onEndReached() Error : ${error}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleSearch = async () => {
    const api = new Api();


    if (searchKeyword.length > 0) {
      setLoading(true);

      const url = "/youtubeSearchList";
      const params = {
        "keyword": searchKeyword,
        "searchIdx": 0
      }

      api.doGet(url, params).then((response) => {
        const responseData = response.data;
        const responseResult = responseData.result;
        const data = responseData.data;

        if ((responseResult === apiResponse.SUCCESS) && data) {
          setSearchResult(data);
          dispatch(setNewSearch(data));
          dispatch(setKeyword(searchKeyword));
          dispatch(resetSearchIndex());
        }
      }).catch((error) => {
        Alert.alert(outputMessages['SearchError.title'], outputMessages['SearchError.content']);
        console.error(`[Search.js] Get Search List Failed : ${error}`);
      })
        .finally(() => {
          setLoading(false);
        })
    }
  }

  const extractAudioRequest = (id, title, channelTitle, thumbnailUrl, length) => {
    if (id && title && channelTitle && thumbnailUrl && length) {
      const api = new Api();
      const url = "/audio";
      const params = {
        "id": id,
        "title": title,
        "channelTitle": channelTitle,
        "thumbnailUrl": thumbnailUrl,
        "length": length
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
          value={searchKeyword}
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
          {isLoading ?
            (
              <ActivityIndicator size="large" style={styles.activityIndicator} />
            )
            :
            (
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
            )
          }
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
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200, // 원하는 높이 설정
  },
});

export default Search;