//React base
import React, { useEffect, useContext, useCallback } from 'react';
import { Alert, Dimensions } from 'react-native';
import { Box, Image, HamburgerIcon, Menu, Pressable, Text, Center, FlatList, Avatar } from 'native-base';

//Hatch stuffs
import { Wheel, HatchProfileBg, RotatingMenu, ProfileContext, ProfileService } from '../index';

//Libs
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
//import FontAwesome, { SolidIcons, RegularIcons, BrandIcons, parseIconFromClassName } from 'react-native-fontawesome';




export default ProfileMain = () => {
    const _context = useContext(ProfileContext);
    const keyGenerator = () => '_' + Math.random().toString(36).substr(2, 9);
    const width = Dimensions.get('screen').width;
    const height = Dimensions.get('screen').height;
    const bgs = ['#f6ae2d', '#33658a', '#f26419', '#55dde0'];
    const navigation = useNavigation();

    useEffect(() => {
        console.log('OGOOGOGGOGOGOGOG ', _context.profile);


    })
    



    const kids = [
        {
            profileKey: '',

        },
        {
            profileKey: '',
        },
        {
            profileKey: ''
        }
    ]

    const renderThing = () => {
        return (<Box style={{ marginTop: 10 }}>
            <Avatar width="8" height="8" style={{ transform: [{ rotate: '180deg' }] }} source={{ uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" }} />
        </Box>)
    }


    return (
        
            
                <HatchProfileBg>
                    <Box w={width} flex={1} justifyContent="center" alignItems="center">
                {/* <HatchProfileBg /> */}
                {/* <Wheel prof={item} key={keyGenerator()} /> */}
                <RotatingMenu />
                <Box alignItems="center" justifyContent="center" style={{ position: 'absolute', height: 34, width: 800, left: -385, backgroundColor: 'black', transform: [{ rotate: '-90deg' }] }}>
                    <Text style={{ color: 'white', fontSize: 20 }}>{_context.profile && _context.profile.displayName.toUpperCase()}</Text>
                </Box>
                {/* <Box alignItems="center" justifyContent="center" style={{ position: 'absolute', height: 34, width: 800, left: -352, backgroundColor: '#2AAFC1', transform: [{ rotate: '-90deg' }] }}>
                    <FlatList
                        style={{ transform: [{ rotate: '-90deg' }] }}
                        data={kids}
                        vertical
                        renderItem={() => renderThing()}
                        keyExtractor={keyGenerator}
                        extraData={kids}
                        showsHorizontalScrollIndicator={false}
                    />
                </Box> */}
                </Box>
                </HatchProfileBg>
            
            
            
    )
}
