//React Base
import React, { Component } from 'react';

//Hatch
import { StorageService } from '../index';

//Libs
import axios from 'axios';
import Config from 'react-native-config';
import uuid from 'react-native-uuid';


class BubbleService extends Component {

  GetBubble = async (bubbleKey, profileKey) => {
    return axios.get(`https://api.hatch.social/api/bubbles?bubbleKey=${bubbleKey}&activeProfileKey=${profileKey}`, {
      headers: {
        'Authorization': `Bearer ${await StorageService.Retrieve('hatch-auth0-access-token')}`
      }
    }).then(async (response) => {
      return response.data;
      // let o = {};
      // let b = response.data.map((i) => { if (i.key == bubbleKey) return i; });
      // if (b.length > 0)
      //   o = b[0];
      // return o;
    }).catch(async (error, x) => {
      console.log('getbubbleseerror error ', error, x);
    });
  }

  GetAllTags = async () => {
    return axios.get(`${Config.HATCH_API_BASE_URL}/bubbles/tags?count=1000`, {
      headers: {
        'Authorization': `Bearer ${await StorageService.Retrieve('hatch-auth0-access-token')}`
      }
    }).then(async (response) => {
      return { status: response.status, data: response.data };
    }).catch(async (error) => {
      console.error('blobbers fuuuuuck ', error);
    })
  }

  Save = async (bubble) => {
    if (!bubble.bubbleKey) {
      let key = uuid.v4();
      bubble.bubbleKey = key;
      console.log('save this new bubble ',bubble);
      return axios.post('https://api.hatch.social/api/bubbles', bubble, {
        headers: {
          'Authorization': `Bearer ${await StorageService.Retrieve('hatch-auth0-access-token')}`
        }
      }).then(async (response) => {
        console.log('BUBBLE SAVED ',response);
        return bubble;
      }).catch(async (error, x) => {
        console.log('swvebubbleerror error ', error, x);
      });
    }

    console.log('update this bubble bubble ',bubble);

    return axios.put('https://api.hatch.social/api/bubbles', bubble, {
      headers: {
        'Authorization': `Bearer ${await StorageService.Retrieve('hatch-auth0-access-token')}`
      }
    }).then(async (response) => {
      console.log(response);
      return bubble;
    }).catch(async (error, x) => {
      console.log('sav bubvble 4 error ', error, x);
    });
  }

  UploadAvatar = async (bubble, photo) => {
    let formData = new FormData();
    formData.append('activeProfileKey', bubble.activeProfileKey);
    formData.append('bubbleKey', bubble.bubbleKey);
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
      url: `${Config.HATCH_API_BASE_URL}/bubbles/avatar`,
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

  Delete = async (bubbleKey, profileKey) => {
    return axios.delete(`https://api.hatch.social/api/bubbles?bubbleKey=${bubbleKey}&activeProfileKey=${profileKey}`, {
      headers: {
        'Authorization': `Bearer ${await StorageService.Retrieve('hatch-auth0-access-token')}`
      }
    }).then(async (response) => {
      return response.data;
    }).catch(async (error, x) => {
      console.log('delete bubble error ', error, x);
    });
  }

}

export default new BubbleService();