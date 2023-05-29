//React Base
import React, { Component } from 'react';

//Hatch
import { StorageService } from '../index';

//Libs
import axios from 'axios';
import uuid from 'react-native-uuid';
import Config from 'react-native-config';


class AccountService extends Component {

    CheckExistingAccount = async (token) => {
        return axios.get(`${Config.HATCH_API_BASE_URL}/accounts`, {
            headers: {
                'Authorization': `Bearer ${await StorageService.Retrieve('hatch-auth0-access-token')}`
            }
        }).then(async (response) => {

            console.log('CheckExistingAccount() succeeded: ', response.data);
            if (response.status == 200)
                return response.data;

            return false;
        }).catch(async (error) => {
            console.error('CheckExistingAccount() failed: ', error.toJSON());
            //await AuthService.Logout();
        })
    }

    AddNewAccount = async (authUser) => {
        console.log('add new acct ', authUser);
        var key = uuid.v4();
        return axios.post(`${Config.HATCH_API_BASE_URL}/accounts`, {
            accountKey: key,
            email: authUser.email,
            nickname: authUser.nickname
        }, {
            headers: {
                'Authorization': `Bearer ${await StorageService.Retrieve('hatch-auth0-access-token')}`
            }
        }).then(async (response) => {
            console.log('AddNewAccount() succeeded: ')
            authUser.key = key;
            return authUser;
        }).catch(async (error) => {
            console.error('AddNewAccount() failed: ', error.toJSON());
            //await AuthService.Logout();
        })
    }

}

export default new AccountService();