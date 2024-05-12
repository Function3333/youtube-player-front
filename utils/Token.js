import apiResponse from "../enums/apiResponse";
import Api from "./Api";
import moment from "moment-timezone";
import SecureStore from "./SecureStore";

class Token {
    
    constructor(acccessTokenData, refreshTokenData) {
        this.acccessTokenData = acccessTokenData;
        this.refreshTokenData = refreshTokenData;
    }

    //AccessToken만 expired이면 RefreshToken으로 AccessToken을 갱신한 후 true 반환, 단 에러 발생 시 false 반환 후 로그인 페이지로 navigate
    //둘다 expired이면 false 반환 후 로그인 페이지로 navigate
    isTokenExpired() {
        const accessTokenResult = this.isAccessTokenExpired();
        const refreshTokenResult = this.isRefreshTokenExpired();
        let result = false;
        
        if(accessTokenResult === true && refreshTokenResult === false) {
            const api = new Api();
            const secureStore = new SecureStore();
            const url = "/user/accessToken";
            const params = {
                "REFRESH_TOKEN" : this.refreshTokenData.payload
            };

            api.doGet(url, params)
                .then((response) => {
                    const responseResult = response.data.result;
                    
                    if(responseResult === apiResponse.SUCCESS) {                        
                        const accessTokenData = response.data.data;
                        const token = new Token(accessTokenData, this.refreshTokenData);
          
                        secureStore.save("token", JSON.stringify(token));
                    }
                })
                .catch((error) => {
                    result = true;
                    console.error("Error during API request:", error);
                });
        }

        if(accessTokenResult === true && refreshTokenResult === true) {
            result = true;
        }

        return  result;
    }

    isAccessTokenExpired() {
        const expiredDate = moment(this.acccessTokenData.expiredDate, 'ddd MMM DD HH:mm:ss [KST] YYYY');
        const now = moment();

        console.log(`[Token.js] isAccessTokenExpired : ${expiredDate.isBefore(now)}`);
        return expiredDate.isBefore(now);
    }

    isRefreshTokenExpired() {
        const expiredDate = moment(this.refreshTokenData.expiredDate, 'ddd MMM DD HH:mm:ss [KST] YYYY');
        const now = moment();

        console.log(`[Token.js] isRefreshTokenExpired : ${expiredDate.isBefore(now)}`);
        return expiredDate.isBefore(now);
    }
}

export default Token;