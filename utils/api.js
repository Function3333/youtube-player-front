import axios from "axios";
import SecureStore from '../utils/SecureStore';


class Api {
    constructor() {
        this.host = "192.168.0.139";
        this.port = "8080";
    }

    async setHeader() {
        const secureStore = new SecureStore();
        const token = await secureStore.getToken();

        if(token.isTokenValide()) {
            console.log("[Api.js] Set Request Header");
            this.accessTokenHeader = token.acccessTokenData.payload;
            this.refreshTokenHeader = token.refreshTokenData.payload;
        } else {
            console.log("[Api.js] No Token In SecureStore");
        } 
    }
    async doPost(url, params) {
        await this.setHeader();
        const requestUrl = `http://${this.host}:${this.port}${url}`;    
        console.log(`Request URL : ${requestUrl}`);
        console.log(`Request Params : ${JSON.stringify(params)}`);
        
        try {    
            const reuslt = axios.post(requestUrl, params);
            return reuslt;
        } catch (error) {
            console.log(error);
            return error.response;
        }
    }

    async doGet(url, params) {
        this.setHeader().then(() => {
            const requestUrl = `http://${this.host}:${this.port}${url}`;
            console.log(`Request URL: ${requestUrl}`);
            console.log(`Request Params: ${JSON.stringify(params)}`);
        
            const config = {
              params: params,
            };
        
            console.log(`this.accessTokenHeader : ${this.accessTokenHeader}`);
            console.log(`this.refreshTokenHeader : ${this.refreshTokenHeader}`);
            if (this.accessTokenHeader != null && this.refreshTokenHeader != null) {
              config.headers = {
                "ACCESS_TOKEN": this.accessTokenHeader,
                "REFRESH_TOKEN": this.refreshTokenHeader,
              };
            }
        
            axios.get(requestUrl, config)
              .then(response => {
                return response;
              })
              .catch(error => {
                console.log(error);
                return error.response;
              });
        })
      }
}

export default Api;