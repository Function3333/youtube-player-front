import { View, StyleSheet, StatusBar } from 'react-native';
import { Text, Icon, HStack, IconButton, Box } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';


const AppBar = () => {
    return (
        <View>
            <StatusBar bg="#3700B3" barStyle="light-content" />
            <Box Top bg="violet.600" />

            <HStack bg="#000000" px="1" py="3" justifyContent="center" alignItems="center" w="100%">
                <HStack alignItems="center">
                    <Text color="white" fontSize="25" style={styles.customFont}>
                        Y Music
                    </Text>
                </HStack>
            </HStack>
        </View>
    )
}

const styles = StyleSheet.create({
    customFont: {
        fontFamily: 'PlaywriteAUVIC-Regular',
    },
});

export default AppBar;