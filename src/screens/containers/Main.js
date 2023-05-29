//React base
import React from 'react';
import { HamburgerIcon, Menu, Button, Pressable, Image } from 'native-base';

//Hatch stuffs
import { ProfileList, ProfileInfo, ProfileInterests, FeedList, FeedInfo, BubbleInfo, HomeHub, Activity, Settings, ProfilePosts, ProfilePreview, BubbleHome } from '../../index';

//Libs
import { createNativeStackNavigator } from '@react-navigation/native-stack';


export default Main = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName={'HomeHub'}>
      <Stack.Screen name="HomeHub" component={HomeHub}></Stack.Screen>
      <Stack.Screen name="ProfileList" component={ProfileList}></Stack.Screen>
      <Stack.Screen name="ProfileInfo" component={ProfileInfo}></Stack.Screen>
      <Stack.Screen name="ProfileInterests" component={ProfileInterests}></Stack.Screen>
      <Stack.Screen name="FeedList" component={FeedList}></Stack.Screen>
      <Stack.Screen name="FeedInfo" component={FeedInfo}></Stack.Screen>
      <Stack.Screen name="BubbleInfo" component={BubbleInfo}></Stack.Screen>
      <Stack.Screen name="BubbleHome" component={BubbleHome}></Stack.Screen>
      <Stack.Screen name="Activity" component={Activity}></Stack.Screen>
      <Stack.Screen name="Settings" component={Settings}></Stack.Screen>
      <Stack.Screen name="ProfilePosts" component={ProfilePosts}></Stack.Screen>
      <Stack.Screen name="ProfilePreview" component={ProfilePreview}></Stack.Screen>
      <Stack.Screen name="InterestAdder" component={InterestAdder}></Stack.Screen>
    </Stack.Navigator>
  )

}