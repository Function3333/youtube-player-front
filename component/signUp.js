import { Box, Heading, VStack, FormControl, Link, Input, HStack, Text, Center, Button, View } from 'native-base';
import { StyleSheet, Alert} from 'react-native';
import { useState , useEffect} from 'react';
import Api from '../utils/Api';
import formValidator from '../utils/formValidator';
import apiResponse from '../enums/apiResponse';
import outputMessages from '../utils/outputMessages.json';

const SignUp = ({navigation}) => {
    const [username, setUsername] = useState("");
    const [usernameErrorMsg, setUsernameErrorMsg] = useState("");
    const [usernameFlag, setUsernameFlag] = useState(false);
    const [email, setEmail] = useState("");
    const [emailErrorMsg, setEmailErrorMsg] = useState("");
    const [emailFlag, setEmailFlag] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
    const [passwordFlag, setpasswordFlag] = useState(false);
    const api = new Api();    

    useEffect(() => {
        const validator = new formValidator();
        const result = validator.validateUsername(username);

        if(result === false) setUsernameErrorMsg(outputMessages['FormatError.username']);
        if(result === true) setUsernameErrorMsg("");
    }, [username]);

    useEffect(() => {
        const validator = new formValidator();
        let result = validator.validateEmail(email);
        
        if(result === false) setEmailErrorMsg(outputMessages['FormatError.email']);
        if(result === true) setEmailErrorMsg("");
    }, [email]);

    useEffect(() => {
        const validator = new formValidator();
        let result = validator.validatePassword(email);
        
        if(result === false) setPasswordErrorMsg(outputMessages['FormatError.password']);
        if(result === true) setPasswordErrorMsg("");
    }, [password]);

    const isUsernameDuplicate = async () => {
      const validator = new formValidator();

      const result = validator.validateUsername(username);
      if(result === true) {
        const url = "/login/validateUsername";
        const params = {
            "username" : username
        } 

        const response = await api.doGet(url, params);
        if(response.data.result === apiResponse.SUCCESS) {
          Alert.alert(outputMessages['VerifySuccess.username']);
          setUsernameFlag(true);
        }
        if(response.data.result === apiResponse.DUPLICATE_NAME) {
          Alert.alert(outputMessages['VerifyError.username']);
          setUsernameErrorMsg(outputMessages['VerifyError.username']);
        }
        }
    }

    const verifyEmail = () => {
      const validator = new formValidator();
      const emailReult = validator.validateEmail(email);
      
      if(usernameFlag === true && emailReult === true) {
        navigation.navigate("VerifyEmail", { email: email});
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
                color="#808080"
              //   onPress={validateform}
              >
                Sign in
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
    container: {
      flex: 1,
      backgroundColor: '#000000',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });


  export default SignUp;