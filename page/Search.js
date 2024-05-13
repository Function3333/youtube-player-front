import { View, Input, HStack, ScrollView, Icon } from 'native-base';
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import AppBar from '../component/AppBar';
import Footer from '../component/Footer';

const Search = () => {
    const [searchKeyword, setSearchKeyword] = useState("");

    const data = [{
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      fullName: 'Afreen Khan',
      timeStamp: '12:47 PM',
      recentText: 'Good Day!',
      avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
    }, {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      fullName: 'Sujita Mathur',
      timeStamp: '11:11 PM',
      recentText: 'Cheer up, there!',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEaZqT3fHeNrPGcnjLLX1v_W4mvBlgpwxnA&usqp=CAU'
    }, {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      fullName: 'Anci Barroco',
      timeStamp: '6:22 PM',
      recentText: 'Good Day!',
      avatarUrl: 'https://miro.medium.com/max/1400/0*0fClPmIScV5pTLoE.jpg'
    }, {
      id: '68694a0f-3da1-431f-bd56-142371e29d72',
      fullName: 'Aniket Kumar',
      timeStamp: '8:56 PM',
      recentText: 'All the best',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr01zI37DYuR8bMV5exWQBSw28C1v_71CAh8d7GP1mplcmTgQA6Q66Oo--QedAN1B4E1k&usqp=CAU'
    }, {
      id: '28694a0f-3da1-471f-bd96-142456e29d72',
      fullName: 'Kiara',
      timeStamp: '12:47 PM',
      recentText: 'I will call today.',
      avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&usqp=CAU'
    }];

    const handleSearch = () => {
      console.log(`keyword : ${searchKeyword}`)
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
              width="80%"
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
          <ScrollView w="100%" contentContainerStyle={styles.scrollViewContent}>
              {/* 검색결과 */}
          </ScrollView>
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
      marginTop: 20,
    },
});

export default Search;