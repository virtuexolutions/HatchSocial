//React Base
import React, { Component } from 'react';

//Hatch
import { StorageService } from '../index';

//Libs
import axios from 'axios';
import Config from 'react-native-config';
import uuid from 'react-native-uuid';


class ProfileService extends Component {

  GetProfiles = async () => {
    return axios.get(`${Config.HATCH_API_BASE_URL}/profiles`, {
      headers: {
        'Authorization': `Bearer ${await StorageService.Retrieve('hatch-auth0-access-token')}`
      }
    }).then(async (response) => {
      return response.data;
    }).catch(async (error) => {
      console.error('get all profiles fuuuuuck ', error);
    })
  }

  GetProfile = async (id) => {
    return axios.get(`${Config.HATCH_API_BASE_URL}/profiles/${id}`, {
      headers: {
        'Authorization': `Bearer ${await StorageService.Retrieve('hatch-auth0-access-token')}`
      }
    }).then(async (response) => {
      return response.data;
    }).catch(async (error) => {
      console.error('get all profiles fuuuuuck ', error);
    })
  }


  GetCatalogs = async (profileKey) => {
    console.log('get catalogs ',profileKey);
    return axios.get(`${Config.HATCH_API_BASE_URL}/profiles/catalogs?activeProfileKey=${profileKey}`, {
      headers: {
        'Authorization': `Bearer ${await StorageService.Retrieve('hatch-auth0-access-token')}`
      }
    }).then(async (response) => {
      console.log('get ctaalogs ',response.data);
      return response.data;
    }).catch(async (error) => {
      console.error('get all profiles fuuuuuck ', error);
    })
  }

  Save = async (profile) => {
    if(!profile.backgroundColor)
      profile.backgroundColor = '#ffffff';
    if (!profile.activeProfileKey) {
      var key = uuid.v4();
      profile.activeProfileKey = key;
      console.log(`Save()`, profile);
      return axios.post(`${Config.HATCH_API_BASE_URL}/profiles`, profile, {
        headers: {
          'Authorization': `Bearer ${await StorageService.Retrieve('hatch-auth0-access-token')}`
        }
      }).then(async (response) => {
        return profile;
      }).catch(async (error, x) => {
        console.error('save profile error 1', error, x);
      });
    }
    console.log('...its an update ',profile);
    return axios.put(`${Config.HATCH_API_BASE_URL}/profiles`, profile, {
      headers: {
        'Authorization': `Bearer ${await StorageService.Retrieve('hatch-auth0-access-token')}`
      }
    }).then(async (response) => {
      return profile;
    }).catch(async (error, x) => {
      console.error('save profile error 2', error, x);
    });
  }

  UploadAvatar = async (key, photo) => {
    console.log(`UploadAvatar(${key}, ${photo.fileName})`);
    let formData = new FormData();
    formData.append('activeProfileKey', key);
    formData.append('formFile', {
      name: photo.fileName,
      type: photo.type,
      uri:
        Platform.OS === "android"
          ? photo.uri
          : photo.uri.replace("file://", "")
    });

    const response = await axios({
      method: "POST",
      url: `${Config.HATCH_API_BASE_URL}/profiles/avatar`,
      data: formData,
      headers: {
        'Authorization': `Bearer ${await StorageService.Retrieve('hatch-auth0-access-token')}`,
        'Content-Type': 'multipart/form-data'
      },
      transformRequest: (data, error) => {
        return formData;
      }
    });

    if (response) {
      console.log('RESPONSE TO STUFF ',response.data);
      return response.data;
    } else
      console.log('SHIT SHIT SHIT');

  }

  Delete = async (key) => {
    return axios.delete(`${Config.HATCH_API_BASE_URL}/profiles/${key}`, {
      headers: {
        'Authorization': `Bearer ${await StorageService.Retrieve('hatch-auth0-access-token')}`
      }
    }).then(async (response) => {
      return response.data;
    }).catch(async (error) => {
      console.log('delete profile error ', error);
    });
  }

}

export default new ProfileService();