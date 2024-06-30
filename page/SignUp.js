import { Box, Heading, VStack, FormControl, Link, Input, HStack, Text, Center, Button, View } from 'native-base';
import { StyleSheet, Alert, Image } from 'react-native';
import { useState, useEffect } from 'react';
import Api from '../utils/Api';
import formValidator from '../utils/FormValidator';
import apiResponse from '../enums/apiResponse';
import outputMessages from '../utils/outputMessages.json';

const SignUp = ({ navigation, route }) => {
  const [username, setUsername] = useState("");
  const [usernameErrorMsg, setUsernameErrorMsg] = useState("");
  const [usernameFlag, setUsernameFlag] = useState(false);

  const [email, setEmail] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const verifyEmailResult = route.params?.verifyEmailResult ?? null;

  const [password, setPassword] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [passwordFlag, setpasswordFlag] = useState(false);

  useEffect(() => {
    const validator = new formValidator();
    const result = validator.validateUsername(username);

    if (result === false) setUsernameErrorMsg(outputMessages['FormatError.username']);
    if (result === true) setUsernameErrorMsg("");
  }, [username]);

  useEffect(() => {
    const validator = new formValidator();
    let result = validator.validateEmail(email);

    if (result === false) setEmailErrorMsg(outputMessages['FormatError.email']);
    if (result === true) setEmailErrorMsg("");
  }, [email]);

  useEffect(() => {
    const validator = new formValidator();
    let result = validator.validatePassword(password);

    if (result === false) {
      setPasswordErrorMsg(outputMessages['FormatError.password']);
      setpasswordFlag(false);
    }

    if (result === true) {
      setPasswordErrorMsg("");
      setpasswordFlag(true);
    }
  }, [password]);

  const isUsernameDuplicate = async () => {
    const api = new Api();
    const validator = new formValidator();

    const result = validator.validateUsername(username);
    if (result === true) {
      const url = "/login/validateUsername";
      const params = {
        "username": username
      }

      const response = await api.doGet(url, params);
      if (response.data.result === apiResponse.SUCCESS) {
        Alert.alert(outputMessages['VerifySuccess.username']);
        setUsernameFlag(true);
      }
      if (response.data.result === apiResponse.DUPLICATE_NAME) {
        Alert.alert(outputMessages['DuplicateError.username']);
        setUsernameErrorMsg(outputMessages['DuplicateError.username']);
      }
    }
  }

  const verifyEmail = () => {
    const validator = new formValidator();
    const emailReult = validator.validateEmail(email);

    if (usernameFlag === true && emailReult === true) {
      navigation.navigate("VerifyEmail", { email: email });
    }
  }

  const handleSignUp = () => {
    const api = new Api();

    if (usernameFlag === true && verifyEmailResult === apiResponse.SUCCESS && passwordFlag === true) {
      const url = "/user";
      const params = {
        "username": username,
        "email": email,
        "password": password
      };

      const response = api.doPost(url, params);
      response.then((response) => {
        const result = response.data.result;
        let title, content = null;

        if (result === apiResponse.SUCCESS) {
          title = outputMessages['SiginUpSuccess'];
          content = "";
        }
        if (result === apiResponse.FAIL) {
          title = outputMessages['SiginUpError.title'];
          content = outputMessages['SiginUpError.content'];
        }
        Alert.alert(
          title, content,
          [{ text: "OK", onPress: () => navigation.navigate("Login") }]
        );
      });
    }
  }

  return (
    <View style={styles.container}>
      <Center w="100%">
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Center>
            <Image
              source={require('../assets/icon.png')}
              style={[styles.logo, { width: 500, height: 180 }]}
            />
          </Center>

          <VStack space={3} mt="5">
            <FormControl isInvalid={!!usernameErrorMsg}>
              <FormControl.Label>Username</FormControl.Label>

              <HStack space={2}>
                <Input
                  flex={1}
                  style={styles.inputText}
                  autoCapitalize={"none"}
                  onChangeText={setUsername}
                />
                <Button
                  onPress={isUsernameDuplicate}
                  size="sm"
                  variant="outline"
                  borderColor="gray.400"
                  _text={{ color: "gray.600" }}
                  borderWidth={1}
                >
                  중복 인증
                </Button>
              </HStack>
              {usernameErrorMsg && (
                <FormControl.ErrorMessage>
                  {usernameErrorMsg}
                </FormControl.ErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!emailErrorMsg}>
              <FormControl.Label>Email</FormControl.Label>

              <HStack space={2}>
                <Input
                  flex={1}
                  style={styles.inputText}
                  autoCapitalize={"none"}
                  onChangeText={setEmail}
                />
                <Button
                  onPress={verifyEmail}
                  size="sm"
                  variant="outline"
                  borderColor="gray.400"
                  _text={{ color: "gray.600" }}
                  borderWidth={1}
                >
                  인증 요청
                </Button>
              </HStack>
              {emailErrorMsg && (
                <FormControl.ErrorMessage>
                  {emailErrorMsg}
                </FormControl.ErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={!!passwordErrorMsg}>
              <FormControl.Label>Password</FormControl.Label>
              <Input
                type="password"
                style={styles.inputText}
                autoCapitalize={"none"}
                onChangeText={setPassword}
              />
              {passwordErrorMsg && (
                <FormControl.ErrorMessage>
                  {passwordErrorMsg}
                </FormControl.ErrorMessage>
              )}
            </FormControl>

            <Button
              mt="2"
              bg="#000000"
              color="#000000"
              onPress={handleSignUp}
              _text={{ color: "white", fontSize: "lg",fontWeight: "bold", fontFamily: "PlaywriteAUVIC-Regular" }}
            >
              Sign Up
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
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default SignUp;