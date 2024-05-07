import { Box, Heading, VStack, FormControl, Input, HStack, Center, Button, View, Text} from 'native-base';
import { StyleSheet, Alert} from 'react-native';
import { useState , useEffect} from 'react';
import Api from '../utils/Api';
import apiResponse from '../enums/apiResponse';

const TIME_LIMIT = 1800;

const VerifyEmail = ({navigation, route}) => {
    const [verifyNumber, setVerifyNumber] = useState("");
    const [isVerifyEmailClick, setVerifyEmailClick] = useState(false);
    const [countDown, setCountDown] = useState(TIME_LIMIT);
    const {email} = route.params;
    const api = new Api();

    useEffect(() => {
        if(isVerifyEmailClick) {
            const interval = setInterval(() => {
                setCountDown((currentCountDown) => {
                  if (currentCountDown <= 1) {
                    clearInterval(interval);
                    navigation.goBack();
                    // 예: navigation.navigate('SignUp');
                    return 0;
                  }
                  return currentCountDown - 1;
                });
              }, 1000);
            
              return () => clearInterval(interval);
        }
      }, [isVerifyEmailClick]); 

    const handleVerifyEmail = () => {
        const url = "/login/verifyEmail";
        console.log(`inputEmail : ${email}`);
        const params = {
            "email" : email
        }
        
        const response = api.doGet(url, params);
        response.then((response) => {
            const reuslt = response.data.result;
            if(reuslt === apiResponse.SUCCESS) {
                Alert.alert("인증번호가 전송되었습니다");
                setVerifyEmailClick(true);
            }
        });
    }

    const handleSubmitVerifyNumber = () => {
        
    }

    return (
      <View style={styles.container}>
        <Center w="100%">
          <Box safeArea p="2" py="8" w="90%" maxW="290">
            <Center>
              <Heading size="lg" fontWeight="600" color="#FAFAD2">
                  Youtube Player
              </Heading>
            </Center>

            <VStack space={3} mt="5">
              {/* <FormControl isInvalid={!!countDown}> */}
              <FormControl >
                
                    {isVerifyEmailClick ? 
                        <FormControl.Label><Text style={styles.countDownText}>{countDown}초</Text> 내에 전송된 인증번호를 입력해주세요.</FormControl.Label> 
                        : 
                        <FormControl.Label></FormControl.Label> 
                        }
                {/* <FormControl.Label><Text style={styles.countDownText}>{countDown}초</Text> 내에 전송된 인증번호를 입력해주세요.</FormControl.Label>  */}
                <HStack space={3}>
                  <Input 
                      flex={1}
                      style={styles.inputText} 
                      autoCapitalize={"none"}
                      onChangeText={setVerifyNumber}
                  />
                  <Button 
                    onPress={handleVerifyEmail}
                    size="sm" 
                    variant="outline" 
                    borderColor="gray.400" 
                    _text={{ color: "gray.600" }}
                    borderWidth={1} 
                  >
                    인증요청
                </Button>
                </HStack>  
                
              </FormControl>
              <Button 
                mt="2" 
                color="#808080"
              >
                인증하기
              </Button>
            </VStack>
          </Box>
        </Center>
      </View>
    );
  };

  const styles = StyleSheet.create({
    inputText : {
      color : "white"
    },
    countDownText : {
        color : "red"
    },
    container: {
      flex: 1,
      backgroundColor: '#000000',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });


  export default VerifyEmail;