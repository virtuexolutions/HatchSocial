//React Base
import React, { Component } from 'react';

//Hatch
import { StorageService } from '../index';

//Libs
import axios from 'axios';
import Config from 'react-native-config';
import uuid from 'react-native-uuid';


class FeedService extends Component {

  GetFeed = async (feedKey, profileKey) => {
    console.log(`GetFeed(${feedKey}, ${profileKey})`);
    return axios.get(`https://api.hatch.social/api/feeds?feedKey=${feedKey}&activeProfileKey=${profileKey}`, {
      headers: {
        'Authorization': `Bearer ${await StorageService.Retrieve('hatch-auth0-access-token')}`
      }
    }).then(async (response) => {
      console.log('got feed ',response.data);
      return response.data;
    }).catch(async (error, x) => {
      console.log('get feed error error ', error, x);
    });
  }

  GetFeedsByProfileId = async (id) => {
    return axios.get('https://api.hatch.social/api/feeds' + id, {
      headers: {
        'Authorization': `Bearer ${await StorageService.Retrieve('hatch-auth0-access-token')}`
      }
    }).then(async (response) => {
      return response.data;
    }).catch(async (error, x) => {
      console.log('getbubbleseerror error ', error, x);
    });
  }
  
  Save = async (feed) => {
    if (!feed.feedKey) {
      let key = uuid.v4();
      feed.feedKey = key;
      console.log('save this feed ',feed);
      return axios.post('https://api.hatch.social/api/feeds', feed, {
        headers: {
          'Authorization': `Bearer ${await StorageService.Retrieve('hatch-auth0-access-token')}`
        }
      }).then(async (response) => {
        return feed;
      }).catch(async (error, x) => {
        console.log('save feed error ', error, x);
      });
    }

    return axios.put('https://api.hatch.social/api/feeds', feed, {
      headers: {
        'Authorization': `Bearer ${await StorageService.Retrieve('hatch-auth0-access-token')}`
      }
    }).then(async (response) => {
      return feed;
    }).catch(async (error, x) => {
      console.log('sav feed 4 error ', error, x);
    });
  }

  UploadAvatar = async (feed, photo) => {
    let formData = new FormData();
    formData.append('activeProfileKey', feed.activeProfileKey);
    formData.append('feedKey', feed.feedKey);
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
      url: `${Config.HATCH_API_BASE_URL}/feeds/avatar`,
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

  Delete = async (feedKey, profileKey) => {
    return axios.delete(`https://api.hatch.social/api/feeds?feedKey=${feedKey}&activeProfileKey=${profileKey}`, {
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

export default new FeedService();