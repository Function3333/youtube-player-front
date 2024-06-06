import * as ExpoSecureStore from 'expo-secure-store';
import Token from '../utils/Token';

class SecureStore {

    save(key, value) {
        ExpoSecureStore.setItemAsync(key, value);
    }

    getValue(key) {
        return ExpoSecureStore.getItemAsync(key);
    }

    async saveCurrentAudio (value) {
        this.save("currentAudio", value);
    }

    async getCurrentAudio() {
        let currentAudio = null;

        try {
            currentAudio = JSON.parse(await this.getValue("currentAudio"));    
        } catch (error) {
            console.log(`[SecureStore.js] getCurrentAudio() ERROR : ${error}`);
        }
        return currentAudio;
    }

    async getToken() {
        let token = null;
        try {
            token = JSON.parse(await this.getValue("token"));    
        } catch (error) {
            console.log(`[SecureStore.js] getToken() ERROR : ${error}`);
        }
        return (token === null) ? null : new Token(token.acccessTokenData, token.refreshTokenData);
    }

    async getNextPageToken() {
        let nextPageTokne = undefined;
        try {
            nextPageTokne = await this.getValue("nextPageToken");    
        } catch (error) {
            console.log(`[SecureStore.js] getNextPageToken() ERROR : ${error}`);
        }
        
        return nextPageTokne;
    }
}

export default SecureStore;