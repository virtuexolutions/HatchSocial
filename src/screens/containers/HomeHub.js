//React base
import React, { useState, useContext, useCallback, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, Dimensions, Alert } from 'react-native';
import { HamburgerIcon, Menu, Button, Pressable, Image } from 'native-base';

//Hatch stuffs
import { Home, Messages, Account, NewPost, Search, ProfileContext, Test, ProfileService } from '../../index';

//Libs
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
//import FontAwesome, { SolidIcons, RegularIcons, BrandIcons, parseIconFromClassName } from 'react-native-fontawesome';


export default HomeHub = ({navigation}) => {
  const _context = useContext(ProfileContext);
  const Tab = createBottomTabNavigator();
  const DEVICE_WIDTH = Dimensions.get('window').width;

  useLayoutEffect(() => {
    console.log('HOME HUB ULE ',_context);
    //navigation.setOptions({title: 'PROFILE'});
    if(!_context.profile || (_context.profile && !_context.profile.key))
      preloadContext();
  },[]);

  useEffect(()=>{
    console.log('useeffect');
  },[]);


const preloadContext = useCallback(async () => {
  console.log('LOAD PROFILE');
  let profiles = await ProfileService.GetProfiles();
      console.log('got profiles ', profiles);
      if (profiles && profiles.length > 0) {
          profiles[0].catalogs = await ProfileService.GetCatalogs(profiles[0].key);
          _context.updateProfile(profiles[0]);

      } else {
          _context.updateProfile(null);
      }

  


})

  const scroptions = {
    
    headerShown: false,
    tabBarActiveTintColor: _context.profile ? _context.profile.backgroundColor : 'red',
    tabBarStyle: {
      paddingTop: 7,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderLeftWidth: 0.2,
      borderRightWidth: 0.2,
      position: 'absolute',
      overflow: 'hidden',
      background: '#ffffff',
      shadowColor: 'rgba(0, 0, 0, 0.25)',
      shadowOffset: { width: -2, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    }
  }

  return (

      <Tab.Navigator initialRouteName='Home' screenOptions={{ ...scroptions }}>
        <Tab.Screen name="Home" component={Home} options={{ tabBarIcon: ({ color, size }) => (<Icon name="home" size={30} />) }} />
        <Tab.Screen name="Messages" component={Messages} options={{ tabBarIcon: ({ color, size }) => (<Icon name="comment-dots" size={30} />) }} />
        <Tab.Screen name="NewPost" component={NewPost} options={{ tabBarIcon: ({ color, size }) => (<Icon name="plus-square" size={30} />) }} />
        <Tab.Screen name="Search" component={Search} options={{ tabBarIcon: ({ color, size }) => (<Icon name="search" size={30} />) }} />
        <Tab.Screen name="Account" component={Account} options={{ tabBarIcon: ({ color, size }) => (<Icon name="user" size={30} />) }} />
      </Tab.Navigator>

  )
}
