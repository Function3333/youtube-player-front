import { Box, Heading, VStack, FormControl, Input, HStack, Text, Center, Button, View ,Link} from 'native-base';
import { StyleSheet, Alert} from 'react-native';
import { useState } from 'react';
import outputMessages from '../utils/outputMessages.json'
import api from '../utils/Api';

const Login = ({navigation}) => {
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");

    const validateform = async () => {
      const usernameLength = username.length;
      const passwordLength = password.length;
      
      if(usernameLength === 0) Alert.alert(outputMessages['EmptyError.username']);
      if(passwordLength === 0) Alert.alert(outputMessages['EmptyError.password']);
      
      if(usernameLength > 0 && passwordLength > 0) {
        const loginApi = new api();
        const param = {
          "name" : username,
          "password" : password
        }
        
        const response = await loginApi.doPost("/user/login", param);
        console.log(`Request Response : ${JSON.stringify(response)}`); 
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
              {/* <Link style={{
                            fontSize: "xs",
                            fontWeight: "500",
                            color: "indigo.500"
                          }} 
              alignSelf="flex-end" mt="1" to={{}}>
                Forget Password?
              </Link> */}
            </FormControl>

            <Button 
              mt="2" 
              color="#808080"
              onPress={validateform}
            >
              Sign in
            </Button>
            <HStack mt="6" justifyContent="center">
              
              <Text fontSize="sm" color="coolGray.600" _dark={{color: "warmGray.200"}}>
                회원이 아니신가요?.{" "}
              </Text>
              
              <Link 
                _text={{color: "indigo.500",fontWeight: "medium",fontSize: "sm"}} 
                onPress={() => navigation.navigate("SiginUp")}
                to={{screen : "SiginUp"}}
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
  export default Login;