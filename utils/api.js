import axios from "axios";

class Api {
    constructor() {
        this.host = "192.168.0.139";
        this.port = "8080";
    }

    doPost(url , params) {
        const requestUrl = `http://${this.host}:${this.port}${url}`;    
        console.log(`Request URL : ${requestUrl}`);
        
        try {    
            const reuslt = axios.post(requestUrl, params);
            return reuslt;
        } catch (error) {
            console.log(error);
            return error.response;
        }
    }

    doGet(url , params) {
        const requestUrl = `http://${this.host}:${this.port}${url}`;
        console.log(`Request URL : ${requestUrl}`);

        try {    
            const reuslt = axios.get(requestUrl, {params : params});
            return reuslt;
        } catch (error) {
            console.log(error);
            return error.response;
        }
    }
}

export default Api;