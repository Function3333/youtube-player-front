import { Box, Heading, VStack, FormControl, Link, Input, HStack, Text, Center, Button } from 'native-base';
import { StyleSheet, Alert} from 'react-native';
import { useState , useEffect} from 'react';
import api from '../utils/api';
import formValidator from '../utils/formValidator';

const signUp = () => {
    const [username, setUsername] = useState("");
    const [usernameErrorMsg, setUsernameErrorMsg ] = useState("");
    const [email, setEmail] = useState("");
    const [emailErrorMsg, setEmailErrorMsg ] = useState("");
    const [password, setPassword] = useState("");
    const [passwordErrorMsg, setPasswordErrorMsg ] = useState("");

    const isUsernameDuplicate = () => {
        const url = "/login/validateUsername";
        const signUpApi = new api();
        const params = {
            "username" : username
        }

        const response = signUpApi.doGet(url, params);
    }

    useEffect(() => {
        const validator = new formValidator();
        let result = validator.validateUsername(username);

        if(result === false) setUsernameErrorMsg("16자 이하 영문과 숫자 조합만 가능합니다.");
        if(result === true) setUsernameErrorMsg("");
    }, [username]);

    useEffect(() => {
        const validator = new formValidator();
        let result = validator.validateEmail(email);
        
        if(result === false) setEmailErrorMsg("이메일 형식만 입력 가능합니다.");
        if(result === true) setEmailErrorMsg("");
    }, [email]);

    useEffect(() => {
        const validator = new formValidator();
        let result = validator.validatePassword(email);
        
        if(result === false) setPasswordErrorMsg("20자 이하 영문과 숫자 조합만 가능합니다.");
        if(result === true) setPasswordErrorMsg("");
    }, [password]);

    return (
    <Center w="100%">
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Center>
            <Heading size="lg" fontWeight="600" color="#FAFAD2">
                Youtube Player
            </Heading>
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
              color="#808080"
            //   onPress={validateform}
            >
              Sign in
            </Button>
          </VStack>
        </Box>
      </Center>
    );
  };

  const styles = StyleSheet.create({
    inputText : {
      color : "white"
    } 
  })

  export default signUp;