import { View, HStack, VStack, Box, Text, Pressable, Image, Spacer, Icon } from 'native-base';
import { SwipeListView } from 'react-native-swipe-list-view';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { Alert, StyleSheet } from 'react-native';
import { useState, useEffect} from 'react';

import MediaPlayer from '../component/MediaPlayer';
import Api from '../utils/Api';
import apiResponse from '../enums/apiResponse';


const PlayList = () => {
    const [playList, setPlayList] = useState([]);
    const [listData, setListData] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [audio, setAudio] = useState({});

    // Start useEffect Logic
    useEffect(() => {
      getPlayList();
    }, []);

    useEffect(() => {
      const formattedData = playList.map((item, index) => ({
        key : index.toString(),
        id : item.id,
        title : item.audio.youtubeTitle,
        audioUrl : item.audio.audioUrl,
        thumbnailUrl : item.audio.thumbnailUrl,
      }));
      setListData(formattedData);
      console.log(`PlayList.js listData : ${JSON.stringify(listData)}`);
    }, [playList]);

    useEffect(() => {
      if(listData.length > 0) {
        setAudio({
          "title" : listData[currentIdx].title,
          "thumbnailUrl" : listData[currentIdx].thumbnailUrl,
          "audioUrl" : listData[currentIdx].audioUrl.replace("\"", ""),
          "playListSize" : listData.length
        });
      }
    }, [currentIdx]);
    // End useEffect Logic

    const handleOnPress = (title, thumbnailUrl, audioUrl) => {
      setAudio({
        "title" : title,
        "thumbnailUrl" : thumbnailUrl,
        "audioUrl" : audioUrl.replace("\"", ""),
        "playListSize" : listData.length
      });
    }

    const getPlayList = () => {
      const api = new Api();
      const url = "/playList";
      const params = {}
      
      api.doGet(url, params)
        .then((response) => {
          const responseData = response.data;
          
          if(responseData.result === apiResponse.SUCCESS) {
            const jsonObject = JSON.parse(responseData.data);
            setPlayList(jsonObject);
          }
        })
        .catch((error) => {
          console.log(`[PlayList.js] Get PlayList Failed : ${error}`);
          Alert.alert("재생목록을 가져오는데 실패하였습니다.", "잠시 후 다시 시도 해 주세요");
        });
    }


  
    const onRowDidOpen = rowKey => {
      console.log('This row opened', rowKey);
    };

    const renderItem = ({ item }) => (
      <Box>
        <Pressable onPress={() => handleOnPress(item.title, item.thumbnailUrl, item.audioUrl)} _dark={{ bg: 'coolGray.800' }} _light={{ bg: '#000000' }}>
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
                  {/* {item.audioUrl}     */}
                </Text>
              </VStack>
              <Spacer />
            </HStack>
          </Box>
        </Pressable>
      </Box>
    );
    //End Render Search Result Logic


  const renderHiddenItem = (data, rowMap) => 
  <HStack flex="1" pl="2">
    <Pressable w="70" ml="auto" cursor="pointer" bg="coolGray.200" justifyContent="center" onPress={() => closeRow(rowMap, data.item.key)} _pressed={{
      opacity: 0.5
    }}>
        <VStack alignItems="center" space={2}>
          <Icon as={<Entypo name="dots-three-horizontal" />} size="xs" color="coolGray.800" />
          <Text fontSize="xs" fontWeight="medium" color="coolGray.800">
            More
          </Text>
        </VStack>
      </Pressable>
      <Pressable w="70" cursor="pointer" bg="red.500" justifyContent="center" onPress={() => deleteRow(rowMap, data.item.key)} _pressed={{
      opacity: 0.5
    }}>
        <VStack alignItems="center" space={2}>
          <Icon as={<MaterialIcons name="delete" />} color="white" size="xs" />
          <Text color="white" fontSize="xs" fontWeight="medium">
            Delete
          </Text>
        </VStack>
      </Pressable>
  </HStack>;
    
    const onScroll = (event) => {
      console.log(`offset : ${event.nativeEvent.contentOffset.y}`);
      if (event.nativeEvent.contentOffset.y === -100) { // 스크롤 위치가 -50 픽셀보다 작을 때
        console.log(`refresh`);
      }
  };



    return (
        <View style={styles.container}>

          <Box bg="#000000" safeArea flex="1">
            <SwipeListView
              data={listData}
              renderItem={renderItem}
              renderHiddenItem={renderHiddenItem}
              rightOpenValue={-130}
              previewRowKey={'0'}
              previewOpenValue={-40}
              previewOpenDelay={3000}
              onRowDidOpen={onRowDidOpen}
              initialNumToRender={10}
              // onEndReached={onEndReached}
              // onEndReachedThreshold={0.5}
              onScroll={onScroll}
            />
          </Box>
          <MediaPlayer audio={audio} currentIdx={currentIdx} setCurrentIdx={setCurrentIdx}/>
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

export default PlayList;