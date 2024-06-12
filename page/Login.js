import { Box, Heading, VStack, FormControl, Input, HStack, Text, Center, Button, View, Link } from 'native-base';
import { StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import outputMessages from '../utils/outputMessages.json'
import Api from '../utils/Api';
import apiResponse from '../enums/apiResponse';
import SecureStore from '../utils/SecureStore';
import Token from '../utils/Token';


const Login = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    const loginApi = new Api();
    const secureStore = new SecureStore();

    const usernameLength = username.length;
    const passwordLength = password.length;

    if (usernameLength === 0 && passwordLength === 0 || usernameLength === 0) Alert.alert(outputMessages['EmptyError.username']);
    if (usernameLength !== 0 && passwordLength === 0) Alert.alert(outputMessages['EmptyError.password']);

    if (usernameLength > 0 && passwordLength > 0) {
      const param = {
        "name": username,
        "password": password
      }

      loginApi.doPost("/user/login", param)
        .then((response) => {
          const responseResult = response.data.result;

          switch (responseResult) {
            case apiResponse.SUCCESS:
              const responseData = JSON.parse(response.data.data);
              const token = new Token(responseData.accessToken, responseData.refreshToken);

              secureStore.save("token", JSON.stringify(token));
              navigation.navigate("MainPage");
              break;

            case apiResponse.LOGIN_FAIL:
              Alert.alert(outputMessages['LoginError']);
              break;

            default:
              Alert.alert(outputMessages['ServerError.title'], outputMessages['ServerError.content']);
              break;
          }
        })
        .catch((error) => {
          Alert.alert(outputMessages['ServerError.title'], outputMessages['ServerError.content']);
          console.log(`[Login.js] handleSignIn Error : ${error}`);
        });
    }
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
            <FormControl>
              <FormControl.Label>Username</FormControl.Label>
              <Input
                style={styles.inputText}
                autoCapitalize={"none"}
                onChangeText={setUsername}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Password</FormControl.Label>
              <Input
                type="password"
                style={styles.inputText}
                autoCapitalize={"none"}
                onChangeText={setPassword}
              />
            </FormControl>

            <Button
              mt="2"
              color="#808080"
              onPress={handleSignIn}
            >
              Sign in
            </Button>
            <HStack mt="6" justifyContent="center">

              <Text fontSize="sm" color="coolGray.600" _dark={{ color: "warmGray.200" }}>
                회원이 아니신가요?.{" "}
              </Text>

              <Link
                _text={{ color: "indigo.500", fontWeight: "medium", fontSize: "sm" }}
                onPress={() => navigation.navigate("SiginUp")}
                to={{ screen: "SiginUp" }}
              >
                Click!
              </Link>
            </HStack>
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
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default Login;