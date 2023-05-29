//React Base
import React, { Component } from 'react';

//Hatch
import { StorageService } from '../index';

//Libs
import axios from 'axios';
import uuid from 'react-native-uuid';
import Config from 'react-native-config';


class ActivityService extends Component {

  GetPostsForFeed = async (profileKey,feedKey) => {
    //console.log(profileKey, feedKey);
    return axios.get(`https://api.hatch.social/api/feeds/post?activeProfileKey=${profileKey}&feedKey=${feedKey}`, {
      headers: {
        'Authorization': `Bearer ${await StorageService.Retrieve('hatch-auth0-access-token')}`
      }
    }).then(async (response) => {
      //console.log('get post response ',response);
      return response.data;
    }).catch(async (error, x) => {
      console.error('getpposts', error, x);
    });
  }


  Save = async(post, media) => {
    let key = uuid.v4();

    console.log('post ',post);

    let formData = new FormData();
    formData.append('activeProfileKey', post.activeProfileKey);
    formData.append('postKey', key);
    formData.append('title', 'hihihi');
    formData.append('body', post.body);
    formData.append('privacy', post.privacy);

    if(media) {
      formData.append('formFile', {
        name: media.fileName,
        type: media.type,
        uri:
          Platform.OS === "android"
            ? media.uri
            : media.uri.replace("file://", "")
      });
    }


    console.log('new post datas ---> ',JSON.stringify(formData));


    const response = await axios({
      method: "POST",
      url: `${Config.HATCH_API_BASE_URL}/posts`,
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
    return axios.delete('https://api.hatch.social/api/bubbles/' + key, {
      headers: {
        'Authorization': `Bearer ${await StorageService.Retrieve('hatch-auth0-access-token')}`
      }
    }).then(async (response) => {
      return response.data;
    }).catch(async (error, x) => {
      console.error('delete bubble error ', error, x);
    });
  }
  

  LikePost = async(postKey) => {
    return axios.post('https://api.hatch.social/api/posts/like', null, {
      headers: {
        'Authorization': `Bearer ${await StorageService.Retrieve('hatch-auth0-access-token')}`
      }
    }).then(async (response) => {
      console.log('Post successfully liked.');
    }).catch(async (error, x) => {
      console.error('like ', error, x);

    });
  }

  // UnlikePost = async(postKey) => {
  //   return axios.post('https://api.hatch.social/api/posts/'+postKey+'/downvote', null, {
  //     headers: {
  //       'Authorization': `Bearer ${await StorageService.Retrieve('hatch-auth0-access-token')}`
  //     }
  //   }).then(async (response) => {
  //     console.log('Post successfully unliked.');
  //   }).catch(async (error, x) => {
  //     console.error('unlike ', error, x);

  //   });
  // }



  


  AddComment = async () => {
    console.log('add this comment ',obj);
    obj.commentKey = uuid.v4();
    return axios.post('https://api.hatch.social/api/posts/comments', obj, {
      headers: {
        'Authorization': `Bearer ${await StorageService.Retrieve('hatch-auth0-access-token')}`
      }
    }).then(async (response) => {
      console.log('Post comment successfully added.');
      return obj;
    }).catch(async (error, x) => {
      console.error('add post ', error, x);

    });
  }

  GetComments = async (postKey) => {
    return axios.get(`https://api.hatch.social/api/posts/comments?postKey=${postKey}&first=0&count=100` + id, {
      headers: {
        'Authorization': `Bearer ${await StorageService.Retrieve('hatch-auth0-access-token')}`
      }
    }).then(async (response) => {
      return response.data;
    }).catch(async (error, x) => {
      console.error('get post comment error ', error, x);
    });
  }
}

export default new ActivityService();