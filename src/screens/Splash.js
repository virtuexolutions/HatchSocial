//React base
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Box, Center, Button, Image, Text, Spinner, HStack, useTheme, Heading } from 'native-base';

//Hatch stuffs
import { AuthService, StorageService, AccountService, HatchButton, ProfileContext } from '../index';

//Libs
import { CommonActions } from '@react-navigation/native';
import { Alert } from 'react-native';
import Video from 'react-native-video';
import video from '../assets/hsblue.mp4';




export default Splash = ({ navigation, route }) => {

  return (

    <Box style={{ flex: 1, backgroundColor: '#00a6a6', alignItems: 'center', justifyContent: 'center' }}>
    <Video source={video} style={styles.video} autoplay onEnd={() => {navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }]
        })
      );}} />
    </Box>
  )
}
const styles = StyleSheet.create({
video: {
    width: '80%',
    height: 800
}
  });