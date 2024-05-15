import * as ExpoSecureStore from 'expo-secure-store';
import Token from '../utils/Token';

class SecureStore {

    save(key, value) {
        ExpoSecureStore.setItemAsync(key, value);
    }

    getValue(key) {
        return ExpoSecureStore.getItemAsync(key);
    }

    async getToken() {
        const value = JSON.parse(await this.getValue("token"));
        return new Token(value.acccessTokenData, value.refreshTokenData);
    }
}

export default SecureStore;