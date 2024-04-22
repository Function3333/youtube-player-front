import { Box, Heading, VStack, FormControl, Link, Input, HStack, Text, Center, Button } from 'native-base';

const login = () => {
    return (
    <Center w="100%">
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Center>
            <Heading size="lg" fontWeight="600" color="#FAFAD2">
                Youtube Player
            </Heading>
            
            <Heading mt="1" color="#FAFAD2" fontWeight="medium" size="xs">
                Sign in to continue!
            </Heading>
          </Center>

          <VStack space={3} mt="5">
            <FormControl>
              <FormControl.Label>Email ID</FormControl.Label>
              <Input />
            </FormControl>
            <FormControl>
              <FormControl.Label>Password</FormControl.Label>
              <Input type="password" />
              <Link _text={{
              fontSize: "xs",
              fontWeight: "500",
              color: "indigo.500"
            }} alignSelf="flex-end" mt="1">
                Forget Password?
              </Link>
            </FormControl>
            {/* <Button mt="2" colorScheme="indigo"> */}
            <Button mt="2" color="#808080">
              Sign in
            </Button>
            <HStack mt="6" justifyContent="center">
              <Text fontSize="sm" color="coolGray.600" _dark={{
              color: "warmGray.200"
            }}>
                I'm a new user.{" "}
              </Text>
              <Link _text={{
              color: "indigo.500",
              fontWeight: "medium",
              fontSize: "sm"
            }} href="#">
                Sign Up
              </Link>
            </HStack>
          </VStack>
        </Box>
      </Center>
    );
  };

  export default login;