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
        let token = undefined;
        try {
            token = JSON.parse(await this.getValue("token"));    
        } catch (error) {
            console.log(`[SecureStore.js] ERROR : ${error}`);
        }
        
        return (token === undefined) ? undefined : new Token(token.acccessTokenData, token.refreshTokenData);
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