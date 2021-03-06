import http from "./httpService";
import {apiUrl} from "../config.json";
import jwtDecode from "jwt-decode";

const apiEndpoint = apiUrl + "/auth";
const tokenKey = 'token';

http.setJwt(getJwt());

export async function login(email, password) {
    const {data: jwt} = await http.post(apiEndpoint, {email, password});
    loginWithJwt(jwt);
}

export function loginWithJwt(jwt) {
    localStorage.setItem(tokenKey, jwt);
}


export function logout() {
    localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
    try {
        const jwt = getJwt();
        return jwtDecode(jwt);
    } catch (e) {
        return null;
    }
}

export function getJwt() {
    return localStorage.getItem(tokenKey);
}

let exports = {
    login, logout, getCurrentUser, loginWithJwt, getJwt
};
export default exports

