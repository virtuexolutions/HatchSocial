//React base
import React, { Component } from 'react';

//Hatch stuffs

//Libs
import SInfo from 'react-native-sensitive-info';
import Config from 'react-native-config';


class StorageService extends Component {

    Stash = async (key, value) => {
        //console.log(`Stashing ${key}`);
        if ((typeof value) == 'string')
            return SInfo.setItem(key, value, {});

        return SInfo.setItem(key, JSON.stringify(value), {});
    }

    Retrieve = async (key) => {
        //console.log(`Retrieving ${key}`);
        let ret = await SInfo.getItem(key, {});
        if (ret === undefined || (ret[0] !== '{' && ret[0] !== '[')) {
            return ret;
        }

        return JSON.parse(ret);
    }

    Destroy = async (key) => {
        return SInfo.deleteItem(key, {});
    }

    DestroyAll = async (bit) => {
        let stuffs = await this.GetAllItems(bit ?? 'hatch-');
        for (var i = 0; i < stuffs[0].length; i++)
            await this.Destroy(stuffs[0][i].key);

    }


    GetAllItems = async (bit) => {
        return SInfo.getAllItems({ sharedPreferencesName: bit });
    }


}

export default new StorageService();