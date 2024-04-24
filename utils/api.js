import axios from "axios";

class api {
    constructor() {
        this.host = "192.168.0.139";
        this.port = "8080";
    }

    async doPost(url , params) {
        const requestUrl = `http://${this.host}:${this.port}${url}`;    
        console.log(`Request URL : ${requestUrl}`);
        
        try {    
            const reuslt = await axios.post(requestUrl, params);
            return reuslt;
        } catch (error) {
            console.log(error);
            return error.response;
        }
    }

    doGet(url , params) {}
}

export default api;