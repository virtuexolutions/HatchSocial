//React Base
import React, { Component } from 'react';
import { Linking } from 'react-native';
//Hatch
import { StorageService } from '../index';

//Libs
import Config from 'react-native-config';
import RNRestart from 'react-native-restart';
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import axios from 'axios';
import { asyncPkceChallenge } from 'react-native-pkce-challenge';
import Auth0 from 'react-native-auth0';

const auth0 = new Auth0({
    domain: Config.AUTH0_DOMAIN,
    clientId: Config.AUTH0_CLIENT_ID
});

class AuthService extends Component {
    constructor(props) {
        super(props);

        this.state = {
            verifier: null
        }
    }

    // CheckStorageForToken = async () => {
    //     let token = await StorageService.Retrieve('hatch-auth0-access-token');
    //     return token;
    // }

    

    Login = async (gotToken) => {
        const challenge = await asyncPkceChallenge();
        this.state.verifier = challenge.codeVerifier;

        const url = encodeURI(Config.AUTH0_DOMAIN + '/authorize?' +
            'response_type=code&' +
            'audience=' + Config.AUTH0_AUDIENCE + '&' +
            'code_challenge=' + challenge.codeChallenge + '&' +
            'code_challenge_method=S256&' +
            'client_id=' + Config.AUTH0_CLIENT_ID + '&' +
            'redirect_uri=' + encodeURI(Config.AUTH0_REDIRECT_URI) + '&' +
            'scope=' + Config.AUTHO_SCOPE + '&' +
            'state=' + Config.AUTH0_STATE);

            console.log(url);

        try {
            if (await InAppBrowser.isAvailable()) {
                await InAppBrowser.openAuth(url, Config.AUTH0_REDIRECT_URI, {
                    ephemeralWebSession: false,
                }).then(async (response) => {
                    console.log('shit ',response);
                    if (response.type === 'success' && response.url) {
                        console.log('alrighty then');
                        Linking.openURL(response.url);

                        let regex = /[?&]([^=#]+)=([^&#]*)/g, params = {}, match;
                        while ((match = regex.exec(response.url))) {
                            params[match[1]] = match[2];
                        }

                        console.log('shits ',params);

                        let token = await this.GetToken(params.code);
                        gotToken(token, false);
                        return true;

                    } else {
                        console.log('Unsuccessful thing happened');
                        return false;
                    }
                })
            } else {
                console.warn('Auth0 was unavailable or something');
                //Linking.openURL(url);
            }
        } catch (error) {
            console.error('In App Browser is fubar ', error);
            //Linking.openURL(url);
        }
    }

    GetToken = async (code) => {
        console.log('AuthService.GetToken ',code,this.state.verifier);

        if (this.state.verifier && code) {
            return axios.post(`${Config.AUTH0_DOMAIN}/oauth/token`, {
                grant_type: 'authorization_code',
                client_id: Config.AUTH0_CLIENT_ID,
                code_verifier: this.state.verifier,
                code: code,
                redirect_uri: Config.AUTH0_REDIRECT_URI
            }).then(async (response) => {
                return response.data.access_token;
            }).catch(async (error) => {
                console.error('Error getting token ', error);
                return null;
            });
        } else {
            console.log('Gotta log in');
            return null;
        }
            


    }

    Logout = async () => {
        await StorageService.DestroyAll();

        auth0.webAuth.clearSession().then(() => {
            RNRestart.Restart();
        }).catch(error => console.error('logout error ', error));

    }


    GetAuthUser = async (token) => {
        return axios.get(Config.AUTH0_DOMAIN + '/userinfo', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(async response => {
            return response.data;
        }).catch(async error => {
            console.log(`GetAuthUser Error: ${error}`);
        })
    }

}

export default new AuthService();
