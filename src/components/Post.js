//React base
import React, { useEffect, useState, useCallback, useContext } from 'react'
import { StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { Box, Text, HStack, Menu, Avatar, Pressable, VStack, Actionsheet, useDisclose, Input, FlatList, Image } from 'native-base';

//Hatch stuffs
import { StorageService, ActivityService, ProfileContext } from '../index';

//Libs
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import horror from '../assets/hswhite.mp4';


const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;
export default Post = ({ post }) => {
  //console.log('post ', post);
  const _context = useContext(ProfileContext);
  //const [type, setType] = useState(post.contentType.indexOf('image') > -1 ? 'image' : post.contentType.indexOf('video') > -1 ? 'video' : 'none');

  Moment.locale('en');


  return post && (
    <Box flex={1} height={height - 120}>
{post.contentType.indexOf('video') > -1 && <Video
source={horror}
ref={ref => {
this.player = ref;
}}
resizeMode="cover"
repeat
muted
onBuffer={this.onBuffer}
onError={this.videoError}
style={styles.backgroundVideo}
/>}
      {post.contentType.indexOf('image') > -1 && <Image alt="image" source={{
            uri: `https://api.hatch.social/api/posts/media?postKey=${post.key}&activeProfileKey=${_context.profile.key}`,
            headers: {
              'Authorization': 'Bearer ' + _context.token
            }
          }} resizeMode="cover" style={styles.backgroundImage} /> }
                  <LinearGradient style={{ flex: 1 }} colors={["#ffffff00", "rgba(40, 40, 43,.5)"]}>
        <Box flex={1}>
          <PostDate post={post} />
          <Box style={styles.postBodyBox}>
            <PostActions post={post} context={_context} />
            <VStack space={3}>
              <PostPoster post={post} context={_context} />
              <PostViewsComments post={post} context={_context} />
              <PostBody post={post} context={_context} />
            </VStack>

          </Box>
        </Box>
        </LinearGradient>
      
    </Box>
  )
}

const PostViewsComments = ({ post, context }) => {
  return (
    <Box style={[styles.postViewComments]}>
      <HStack>
        <Box>
          <Text color="white">VIEW COUNT</Text>
        </Box>
        <Box>
          <Text>|</Text>
        </Box>
        <Box>
          <Text color="white">COMMENT COUNT</Text>
        </Box>
      </HStack>
    </Box>
  )
}

const PostBody = ({ post, context }) => {
  return (
    <Box style={[styles.postBody]}>
      <Text style={styles.postBodyText}>{post.body}</Text>
    </Box>
  )
}

const PostPoster = ({ post, context }) => {

  let item = { backgroundColor: null, backgroundMimeType: "none", createdAt: "2022-11-10T14:17:04.757502Z", description: "Fgdsfg", displayName: "Fgdfsgsd", email: null, key: "4639e454-60bf-4143-a0ba-69f416c0aecb", privacy: 1 }
  return (
    <Box style={[styles.postPoster]}>
      <HStack space={5}>
        <Box style={[styles.avatar, item.privacy == 0 ? styles.private : styles.public]}>
          <Avatar size="44px" source={{ uri: `https://api.hatch.social/api/profiles/avatar?activeProfileKey=${post.createdBy}`, headers: { 'Authorization': 'Bearer ' + context.token } }} />
        </Box>
        <Box justifyContent="center">
          <Text style={{ color: 'white' }}>Jackie Tripplefingers</Text>
          <Text style={{ color: 'white' }}>NEW YORK</Text>
        </Box>



      </HStack>

    </Box>

  )
}

const PostTitle = ({ post, type }) => {
  if (type == 'image')
    return (
      <Box style={{ position: 'absolute', left: 8, top: 6 }}>
        <Text fontSize="20">{post.title}</Text>
      </Box>

    )

  return (
    <Box flex={1} justifyContent="flex-end" alignItems="center">
      <Text color="black" fontSize="20">{post.title}</Text>
    </Box>

  )
}

const PostDate = ({ post }) => {
  var now = Moment();
  var created = Moment(post.createdAt);
  var sex = now.diff(created, 'seconds');
  var mins = now.diff(created, 'minutes');
  var hours = now.diff(created, 'hours');
  var days = now.diff(created, 'days');
  var weeks = now.diff(created, 'weeks');
  var months = now.diff(created, 'months');
  var years = now.diff(created, 'years');

  var display = '';
  if (sex < 60)
    display = sex + ' seconds ago';
  else if (mins < 60)
    display = mins + ' minutes ago';
  else if (hours < 24)
    display = hours + ' hours ago';
  else if (days < 7)
    display = days + ' days ago';
  else if (weeks < 4)
    display = weeks + ' minutes ago';
  else if (months < 12)
    display = months + ' minutes ago';
  else
    display = years + ' years ago';

  return (
    <Box justifyContent="center" style={{ position: 'absolute', right: 0, top: 0 }}>
      <Text>{display}</Text>
    </Box>

  )

}


const PostMedia = ({ post, type, token, profileKey }) => {
  console.log('shittttttt', post);
  let width = Dimensions.get('screen').width;
  return (

    <Box w="100%" h="100%">
      {type == 'image' && <Image
        alt="blerg"
        resizeMode={'cover'}
        style={{ width: width, height: width }}
        source={{
          uri: `https://api.hatch.social/api/posts/media?postKey=${post.key}&activeProfileKey=${profileKey}`,
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }}
      />}
      {type == 'video' && <Video
        source={{
          uri: `https://api.hatch.social/api/posts/media?postKey=${post.key}&activeProfileKey=${profileKey}`,
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }}
        resizeMode={'cover'}
        style={{ width: '100%', height: '100%' }}
        controls={true}
        hideShutterView={true}
        paused={true}
        onBuffer={() => { console.log('loading video') }}
        onError={() => { console.log('video error') }}
      />}
    </Box>
  )
}


const PostCommentSection = ({ post }) => {
  return (
    <Box style={{ position: 'absolute', left: 8, bottom: 24 }}>
      <Text>View comments</Text>
    </Box>

  )
}



const PostActions = ({ post, context }) => {
  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclose();
  return (
    <Box style={{ position: 'absolute', right: 20, bottom: 10 }}>
      <VStack space={2}>
        <VStack space={1}>
          <Box style={styles.actionIconBox}>
            <Icon name={post.isLiked ? "plus" : "thumbs-up"} size={16} color="white" onPress={() => {
              likePost(post.key, context.profile.key)
            }} />
          </Box>
          <Box style={styles.actionTextBox}>
            <Text style={styles.actionText}>232</Text>
          </Box>
        </VStack>
        <VStack space={1}>
          <Box style={styles.actionIconBox}>
            <Icon name="comments" size={16} color="white" onPress={onOpen} />
          </Box>
          <Box style={styles.actionTextBox}>
            <Text style={styles.actionText}>232</Text>
          </Box>
        </VStack>
        <VStack space={1}>
          <Box style={styles.actionIconBox}>
            <Icon name="share" size={16} color="white" />
          </Box>
          <Box style={styles.actionTextBox}>
            <Text style={styles.actionText}>232</Text>
          </Box>
        </VStack>


      </VStack>

    </Box>
  )

}

const openComments = async () => {

}


const likePost = async (postKey, profileKey) => {
  await ActivityService.LikePost({ postKey: postKey, activeProfileKey: profileKey });
}


const unlikePost = async (postKey) => {
  await ActivityService.UnlikePost(postKey);
}


const onBuffer = () => {
  console.log('BUFFFFFF');
}

const videoError = () => {
  console.log('ERRRRRRR');
}



const PostCaption = ({ post }) => (
  <View style={{ marginTop: 5 }}>
    <Text style={{ color: 'white' }}>
      <Text>{post.title}</Text>
      <Text> {post.body}</Text>
    </Text>
  </View>
)


const PostComments = ({ post }) => (
  <>
    {post.comments.map((comment, index) => (
      <View key={index} style={{ flexDirection: 'row', marginTop: 5 }}>
        <Text style={{ color: 'white' }}>
          <Text>{comment.user}</Text>{' '}
          {comment.comment}
        </Text>
      </View>
    ))}
  </>
)



const styles = StyleSheet.create({
  shadyBg: {
    backgroundColor: 'rgba(0,0,0,.25)',
    padding: 7,
    borderRadius: 10
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: '100%'
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: '100%'
  },
  postBodyBox: {
    flex: 1,
    width: width,
    height: '30%',
    position: 'absolute',
    bottom: 0
  },
  postPoster: {
    width: '100%'
  },
  postBody: {
    height: 120,
    bottom: 0,
    //backgroundColor: 'rgba(0,0,0,.25)',
    width: '100%'
  },
  postBodyText: {
    color: 'white'
  },
  postViewComments: {
    //backgroundColor: 'rgba(0,0,0,.25)',
    padding: 7,
    width: '100%'
  },
  actionIconBox: {
    backgroundColor: 'rgba(0,0,0,.15)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionTextBox: {
    color: 'white',
    //backgroundColor: 'rgba(0,0,0,.15)',
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  actionText: {
    color: 'white',
    fontSize: 12
  },
  mainPostBox: {
    flex: 1,
    paddingTop: 75,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
    alignItems: 'center',
  },
  story: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
    borderRadius: 50,
    marginLeft: 6,
    borderWidth: 1.5,
    borderColor: '#ff8501',
  },
  userName: {
    color: 'white',
    marginLeft: 5,
  },
  footerIcon: {
    height: 33,
    width: 33,
  },
  leftFooterIconContainer: {
    flexDirection: 'row',
    width: '32%',
    justifyContent: 'space-between',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  private: {
    borderColor: 'red'
  },
  public: {
    borderColor: 'green'
  },
  avatar: {
    height: 48,
    width: 48,
    borderWidth: 5,
    backgroundColor: 'white',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rowItem: {
    padding: 10
  },




  mediaImage: {

  }
})