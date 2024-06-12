import { View, Box, Text, Icon, HStack, StatusBar, IconButton, Center, VStack, } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';


const AppBar = () => {
    return (
        <View>
            <StatusBar bg="#3700B3" barStyle="light-content" />
            <Box Top bg="violet.600" />

            <HStack bg="#000000" px="1" py="3" justifyContent="space-between" alignItems="center" w="100%">
                <HStack alignItems="center">
                    <Text color="white" fontSize="20" fontWeight="bold">
                        {/* 나중에 텍스트 대신 로고로 바꿔보자 */}
                        Youtube Player
                    </Text>
                </HStack>
                
                <HStack>
                    <IconButton icon={<Icon as={MaterialIcons} name="search" size="sm" color="white" />} />
                    <IconButton icon={<Icon as={MaterialIcons} name="headset" size="sm" color="white" />} />
                </HStack>
            </HStack>
        </View>
    )
}

export default AppBar;