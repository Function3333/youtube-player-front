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

    if (token != null && token.isTokenValide()) {
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

    const config = {};

    if (this.accessTokenHeader != null && this.refreshTokenHeader != null) {
      config.headers = {
        "ACCESS_TOKEN": this.accessTokenHeader,
        "REFRESH_TOKEN": this.refreshTokenHeader,
      };
    }

    return axios.post(requestUrl, params, config);
  }

  async doGet(url, params) {
    await this.setHeader();

    const requestUrl = `http://${this.host}:${this.port}${url}`;
    console.log(`Request URL: ${requestUrl}`);
    console.log(`Request Params: ${JSON.stringify(params)}`);

    const config = {
      params: params,
    };

    if (this.accessTokenHeader != null && this.refreshTokenHeader != null) {
      config.headers = {
        "ACCESS_TOKEN": this.accessTokenHeader,
        "REFRESH_TOKEN": this.refreshTokenHeader,
      };
    }

    return axios.get(requestUrl, config);
  }

  async doDelete(url, params) {
    await this.setHeader();

    const requestUrl = `http://${this.host}:${this.port}${url}`;
    console.log(`Request URL: ${requestUrl}`);
    console.log(`Request Params: ${JSON.stringify(params)}`);

    const config = {
      params: params,
    };

    if (this.accessTokenHeader != null && this.refreshTokenHeader != null) {
      config.headers = {
        "ACCESS_TOKEN": this.accessTokenHeader,
        "REFRESH_TOKEN": this.refreshTokenHeader,
      };
    }

    return axios.delete(requestUrl, config);
  }
}

export default Api;