import { View, HStack, VStack, Box, Text, Pressable, Image, Spacer, Icon } from 'native-base';
import { SwipeListView } from 'react-native-swipe-list-view';
import { MaterialIcons } from '@expo/vector-icons';
import { Alert, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';

import Api from '../utils/Api';
import MediaPlayer from '../component/MediaPlayer';
import apiResponse from '../enums/apiResponse';
import outputMessages from '../utils/outputMessages.json'


const PlayList = () => {
  const [playList, setPlayList] = useState([]);
  const [listData, setListData] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    getPlayList();
  }, []);

  const getPlayList = () => {
    const api = new Api();
    const url = "/playList";
    const params = {}

    api.doGet(url, params)
      .then((response) => {
        const responseData = response.data;

        if (responseData.result === apiResponse.SUCCESS) {
          const jsonObject = JSON.parse(responseData.data);
          
          setPlayList(jsonObject);
        }
      })
      .catch((error) => {
        console.log(`[PlayList.js] Get PlayList Failed : ${error}`);
        Alert.alert(outputMessages['PlayList.getPlayList.fail.title'], outputMessages["PlayList.getPlayList.fail.content"]);
      });
  }

  useEffect(() => {
    const formattedData = playList.map((item, index) => ({
      key: index.toString(),
      id: item.id,
      title: item.audio.youtubeTitle,
      audioUrl: item.audio.audioUrl,
      thumbnailUrl: item.audio.thumbnailUrl,
    }));

    setListData(formattedData);
  }, [playList]);

  const renderItem = ({ item }) => (
    <Box>
      <Pressable onPress={() => handleOnPress(item.key)} _dark={{ bg: 'coolGray.800' }} _light={{ bg: '#000000' }}>
        <Box pl="5" pr="5" py="1">
          <HStack alignItems="center" space={4}>

            <Image
              size="80px"
              source={{ uri: item.thumbnailUrl }}
              alt={item.title}
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
            </VStack>
            <Spacer />
          </HStack>
        </Box>
      </Pressable>
    </Box>
  );

  const handleOnPress = (key) => {
    console.log(`PlayList : ${key}`)
    setCurrentIdx(key);
  }

  const renderHiddenItem = (data, rowMap) => (
    <HStack flex="1" pl="2">
      <Pressable
        w="70"
        ml="auto"
        cursor="pointer"
        bg="red.500"
        justifyContent="center"
        // onPress={() => deleteRow(data.item)}
        _pressed={{ opacity: 0.5 }}
      >
        <VStack alignItems="center" space={2}>
          <Icon as={<MaterialIcons name="delete" />} color="white" size="xs" />
          <Text color="white" fontSize="xs" fontWeight="medium">
            Delete
          </Text>
        </VStack>
      </Pressable>
    </HStack>
  )

  const onRowDidOpen = (itemKey) => {
    Alert.alert(
      "해당 재생목록을 삭제하겠습니까?",
      '',
      [
        {
          text: "예",
          onPress: () => {
            deletePlayList(itemKey);
          }
        },
        {
          text: "아니오",
        }
      ],
      { cancelable: false }
    )
  }

  const deletePlayList = (itemKey) => {
    const audioId = playList[itemKey].audio.id;

    if (audioId) {
      const api = new Api();
      const url = "/playList";
      const params = {
        "audioId": audioId
      }

      api.doDelete(url, params)
        .then((response) => {
          const responseData = response.data;
          console.log(`response Result : ${responseData.result}`);
          if (responseData.result === apiResponse.SUCCESS) {
            getPlayList();
          }
        })
        .catch((error) => {
          console.log(`[PlayList.js] Get PlayList Failed : ${error}`);
          Alert.alert("재생목록 삭제에 실패하였습니다.", "잠시 후 다시 시도 해 주세요");
        });
    }
  }

  return (
    <View style={styles.container}>
      <Box bg="#000000" flex="0">
        <SwipeListView
          data={listData}
          renderItem={renderItem}
          renderRow={renderItem}
          renderHiddenItem={renderHiddenItem}
          previewRowKey={'0'}
          previewOpenValue={50}
          previewOpenDelay={3000}
          onRowClose={onRowDidOpen}
          initialNumToRender={10}
          disableRightSwipe={true}
        />
      </Box>
      <MediaPlayer playList={listData} currentIdx={currentIdx} setCurrentIdx={setCurrentIdx} />
    </View>
  )
}

const styles = StyleSheet.create({
  inputText: {
    color: "white"
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
    marginTop: 40,
  },
});

export default PlayList;