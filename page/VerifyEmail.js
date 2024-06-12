import { Box, Heading, VStack, FormControl, Input, HStack, Center, Button, View, Text } from 'native-base';
import { StyleSheet, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import Api from '../utils/Api';
import apiResponse from '../enums/apiResponse';
import outputMessages from '../utils/outputMessages.json'

const TIME_LIMIT = 300;

const VerifyEmail = ({ navigation, route }) => {
  const [verifyNumber, setVerifyNumber] = useState("");
  const [isVerifyEmailClick, setVerifyEmailClick] = useState(false);
  const [countDown, setCountDown] = useState(TIME_LIMIT);
  const { email } = route.params;
  const api = new Api();

  useEffect(() => {
    if (isVerifyEmailClick) {
      const interval = setInterval(() => {
        setCountDown((currentCountDown) => {
          if (currentCountDown <= 1) {
            clearInterval(interval);
            navigation.goBack();
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
    const params = {
      "email": email
    }

    const response = api.doGet(url, params);
    response.then((response) => {
      const reuslt = response.data.result;
      if (reuslt === apiResponse.SUCCESS) {
        Alert.alert(outputMessages['SendSuccess.email']);
        setVerifyEmailClick(true);
      }
    });
  }

  const handleSubmitVerifyNumber = () => {
    const url = "/login/verifyEmail";
    const params = {
      "verifyNumber": verifyNumber,
      "inputEmail": email
    }

    const response = api.doPost(url, params);
    response.then((response) => {
      const result = response.data.result;

      switch (result) {
        case apiResponse.SUCCESS:
          Alert.alert(
            outputMessages['VerifySuccess.email'], "",
            [{ text: "OK", onPress: () => navigation.navigate("SiginUp", { "verifyEmailResult": apiResponse.SUCCESS }) }]
          );
          break;

        case apiResponse.DUPLICATE_EMAIL:
          Alert.alert(
            outputMessages['DuplicateError.email'], "",
            [{ text: "OK", onPress: () => navigation.navigate("SiginUp", { "verifyEmailResult": apiResponse.DUPLICATE_EMAIL }) }]
          );
          break;

        case apiResponse.VERIFY_EMAIL_FAIL:
          Alert.alert(
            outputMessages['VerifyError.email'], "",
            [{ text: "OK", onPress: () => navigation.navigate("SiginUp", { "verifyEmailResult": apiResponse.VERIFY_EMAIL_FAIL }) }]
          );
          break;

        default:
          break;
      }
    });
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
            <FormControl >

              {isVerifyEmailClick ?
                <FormControl.Label><Text style={styles.countDownText}>{countDown}초</Text> 내에 전송된 인증번호를 입력해주세요.</FormControl.Label>
                :
                <FormControl.Label></FormControl.Label>
              }
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
              onPress={handleSubmitVerifyNumber}
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
  inputText: {
    color: "white"
  },
  countDownText: {
    color: "red"
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default VerifyEmail;