//React base
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Dimensions, Pressable, SafeAreaView } from 'react-native';
import { Box, Text, FlatList, Menu } from 'native-base';

//Hatch stuffs
import { Post, ActivityService, ProfileContext } from '../index';

//Libs
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/FontAwesome5';
//import FontAwesome, { SolidIcons, RegularIcons, BrandIcons, parseIconFromClassName } from 'react-native-fontawesome';



export default Activity = ({ navigation, route }) => {
    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerTitle: route.params.catalog.name,
          headerRight: () => (
              <Box justifyContent="center" style={{ position: 'absolute', right: 5 }}>

              <Menu w="190" trigger={triggerProps => {
                return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                  <Icon name="ellipsis-h" size={32} />
    
                </Pressable>;
              }}>
                <Menu.Item>Mute</Menu.Item>
                <Menu.Item>Block</Menu.Item>
                <Menu.Item>Report</Menu.Item>
                <Menu.Item>Catch phrase</Menu.Item>
                <Menu.Item>To be determined</Menu.Item>
                <Menu.Item>Third thing here</Menu.Item>
              </Menu>
            </Box>
          )
      })
  })

  const _context = useContext(ProfileContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const height = Dimensions.get('screen').height;
  const keyGenerator = () => '_' + Math.random().toString(36).substr(2, 9);
//let x = {"body": "Dose #fose", "commentCount": 0, "contentType": "image/jpeg", "createdAt": "2023-03-08T01:54:26.261311Z", "createdBy": "0b48d66b-4fa6-45ab-aac1-e181c5b99e2e", "key": "4803af48-9181-4e52-bcac-4f60117f9878", "likeCount": 0, "tags": ["#fose"], "title": "hihihi"};


  useEffect(() => {
    if(posts.length == 0) {
      grabPosts(5);
    }
      
    navigation.setOptions({ headerTitle: route.params.catalog.name });
    // navigation.addListener('focus', () => { // you gotta dispose of these
    //   console.log('gigs');
    //   grabPost();
    // });

  });


  const grabPosts = useCallback(async (num) => {
    let arr = [];
    console.log(`grabbing ${num} posts`);
    for(var i = 0;i<num;i++) {
      arr.push(await ActivityService.GetPostsForFeed(_context.profile.key, route.params.catalog.key));
      console.log(arr[i]);
    }
    setPosts([...posts,...arr]);
  })

  const endReached = () => {
    console.log('endreached');
    grabPosts(1);
  }
  

  return (
    <Box flex={1}>
      {/* {post && <Post post={post} /> */}
      <FlatList
        keyExtractor={keyGenerator}
        decelerationRate={0}
        snapToInterval={height - 120}
        snapToAlignment='center'
        data={posts}
        renderItem={({ item }) => <Post post={item} />}
        showsVerticalScrollIndicator={false}
        onEndReached={() => { endReached() }}
        onEndReachedThreshold={2}
      />
      {!posts && <Text>No Activity</Text>}
    </Box>
  )
}
