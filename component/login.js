import { Box, Heading, VStack, FormControl, Link, Input, HStack, Text, Center, Button } from 'native-base';
import { TextInput , StyleSheet, Alert} from 'react-native';
import { useState } from 'react';
import formValidator from '../utils/formValidator';

const login = () => {
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");

    const validateform = () => {
      if(email.length === 0) Alert.alert("이메일은 필수 값입니다.");
      if(password.length === 0) Alert.alert("비밀번호는 필수 값입니다.");
    }

    return (
    <Center w="100%">
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Center>
            <Heading size="lg" fontWeight="600" color="#FAFAD2">
                Youtube Player
            </Heading>
          </Center>

          <VStack space={3} mt="5">
            <FormControl>
              <FormControl.Label>Email</FormControl.Label>
              <Input 
                style={styles.inputText} 
                autoCapitalize={"none"}
                onChangeText={setEmail}
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
              <Link _text={{
                            fontSize: "xs",
                            fontWeight: "500",
                            color: "indigo.500"
                          }} 
              alignSelf="flex-end" mt="1">
                Forget Password?
              </Link>
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
                I'm a new user.{" "}
              </Text>
              
              <Link _text={{color: "indigo.500",fontWeight: "medium",fontSize: "sm"}} href="#">
                Sign Up
              </Link>
            </HStack>
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

  export default login;