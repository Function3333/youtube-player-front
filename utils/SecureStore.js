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
        let token = null;
        try {
            token = JSON.parse(await this.getValue("token"));    
        } catch (error) {
            console.log(`[SecureStore.js] ERROR : ${error}`);
        }
        return (token === null) ? null : new Token(token.acccessTokenData, token.refreshTokenData);
    }

    async getNextPageToken() {
        let nextPageTokne = undefined;
        try {
            nextPageTokne = await this.getValue("nextPageToken");    
        } catch (error) {
            console.log(`[SecureStore.js] ERROR : ${error}`);
        }
        
        return nextPageTokne;
    }
}

export default SecureStore;