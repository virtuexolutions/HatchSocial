//React base
import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { Box, Text, Header, VStack, HStack, FlatList, Center, Button, useTheme, Spinner, Image, Menu, Pressable, HamburgerIcon } from 'native-base';

//Hatch stuffs
import { ProfileContext } from '../../index';

//Libs
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';


export default Messages = ({navigation}) => {
  const _context = useContext(ProfileContext);

  useLayoutEffect(() => {
    let pnav = navigation.getParent();

    pnav.setOptions({
        title: 'MESSAGES',
        headerLeft: () => <Image source={require('../../assets/hatch_social_logo_app.png')} alt='LOGO' style={{ width: 35, height: 41 }} />,
        headerRight: () => (
            <Menu w="190" trigger={triggerProps => {
                return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                    <HamburgerIcon size={8} />
                </Pressable>;
            }}>
                <Menu.Item onPress={() => { navigation.navigate('FeedInfo', { feedKey: null }) }}>New Feed</Menu.Item>
                <Menu.Item onPress={() => { navigation.navigate('BubbleInfo', { bubbleKey: null }) }}>New Bubble</Menu.Item>
            </Menu>
        ),
    });
});

  return (
    <Box style={{flex:1}} pt="5">
        <Text>MESSAGING</Text>
    </Box>
  )
  }
  
