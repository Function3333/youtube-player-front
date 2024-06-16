import { View, StyleSheet, SafeAreaView, StatusBar, Image } from 'react-native';
import { Text, Icon, HStack, IconButton, Box } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';


const AppBar = () => {
    return (
        <View>
            <StatusBar bg="#3700B3" barStyle="light-content" />
            <Box Top bg="violet.600" />

            <HStack bg="#000000" px="1" py="3" justifyContent="space-between" alignItems="center" w="100%">
                <HStack alignItems="center">
                    <Text color="white" fontSize="20" fontWeight="bold" >
                        Y Music
                    </Text>
                </HStack>

                <HStack>
                    <IconButton icon={<Icon as={MaterialIcons} name="info" size="lg" color="white" />} />
                </HStack>
            </HStack>
            {/* </SafeAreaView> */}
        </View>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000000',
    },
});

export default AppBar;