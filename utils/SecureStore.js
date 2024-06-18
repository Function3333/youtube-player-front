import * as ExpoSecureStore from 'expo-secure-store';
import Token from '../utils/Token';

class SecureStore {

    save(key, value) {
        ExpoSecureStore.setItemAsync(key, value);
    }

    getValue(key) {
        return ExpoSecureStore.getItemAsync(key);
    }

    async saveSearchResult(value) {
        try {
            this.save("searchResult", value);
        } catch (error) {
            console.log(`[SecureStore.js] saveSearchResult Failed : ${error}`);
        }
    }

    async getSearchResult() {
        try {
            return JSON.parse(await this.getValue("searchResult"));
        } catch (error) {
            console.log(`[SecureStore.js] getSearchResult Failed : ${error}`);
        }
    }

    async saveCurrentIdx(value) {
        try {
            this.save("currentIdx", value);
        } catch (error) {
            console.log(`[SecureStore.js] saveCurrentIdx() ERROR : ${error}`);
        }
    }

    async getCurrentIdx() {
        let currentAudio = null;

        try {
            currentAudio = JSON.parse(await this.getValue("currentIdx"));
        } catch (error) {
            console.log(`[SecureStore.js] getCurrentIdx() ERROR : ${error}`);
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