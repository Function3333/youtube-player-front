import { View, Text, Icon, HStack, Center, Pressable } from 'native-base';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { useState } from 'react';

const Footer = () => {
    const [selected, setSelected] = useState(1);

    return (
        <View style={styles.container}>
            <HStack px="1" py="3"  justifyContent="space-between">
                {/* <Pressable cursor="pointer" opacity={selected === 0 ? 1 : 0.5} py="3" flex={1} onPress={() => setSelected(0)}>
                    <Center>
                    <Icon mb="1" as={<MaterialCommunityIcons name={selected === 0 ? 'home' : 'home-outline'} />} color="white" size="sm" />
                    <Text color="white" fontSize="12">
                        Home
                    </Text>
                    </Center>
                </Pressable> */}
                <Pressable cursor="pointer" opacity={selected === 1 ? 1 : 0.5} py="2" flex={1} onPress={() => setSelected(1)}>
                    <Center>
                    <Icon mb="1" as={<MaterialIcons name="search" />} color="white" size="sm" />
                    <Text color="white" fontSize="12">
                        Search
                    </Text>
                    </Center>
                </Pressable>
                <Pressable cursor="pointer" opacity={selected === 2 ? 1 : 0.6} py="2" flex={1} onPress={() => setSelected(2)}>
                    <Center>
                    {/* <Icon mb="1" as={<MaterialCommunityIcons name={selected === 2 ? 'cart' : 'cart-outline'} />} color="white" size="sm" /> */}
                    <Icon mb="1" as={<MaterialIcons name="headset" />} color="white" size="sm" />
                    <Text color="white" fontSize="12">
                        PlayList
                    </Text>
                    </Center>
                </Pressable>
                {/* <Pressable cursor="pointer" opacity={selected === 3 ? 1 : 0.5} py="2" flex={1} onPress={() => setSelected(3)}>
                    <Center>
                    <Icon mb="1" as={<MaterialCommunityIcons name={selected === 3 ? 'account' : 'account-outline'} />} color="white" size="sm" />
                    <Text color="white" fontSize="12">
                        Account
                    </Text>
                    </Center>
                </Pressable> */}
            </HStack>
        </View>
    );
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
});

export default Footer;