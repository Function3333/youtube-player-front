import * as ExpoSecureStore from 'expo-secure-store';
import api from './Api';

class SecureStore {

    save(key, value) {
        ExpoSecureStore.setItemAsync(key, value);
    }

    getValue(key) {
        return ExpoSecureStore.getItemAsync(key);
    }

    isAccessTokenExpired(accessToken) {
        
    }
}

export default SecureStore;