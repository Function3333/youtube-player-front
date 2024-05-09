import * as ExpoSecureStore from 'expo-secure-store';

class SecureStore {

    save(key, value) {
        ExpoSecureStore.setItemAsync(key, value);
    }

    getValue(key) {
        return ExpoSecureStore.getItemAsync(key);
    }
}

export default SecureStore;