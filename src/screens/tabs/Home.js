//React base
import React, { useState, useEffect, useCallback, useContext, useReducer, useLayoutEffect } from 'react';
import { Alert, Dimensions } from 'react-native';
import { Box, Text, FlatList, Center, Button, useTheme, Spinner, Image, Menu, Pressable, HamburgerIcon } from 'native-base';

//Hatch stuffs
import { StorageService, ProfileService, TickerService, StockMarquee, ProfileContext } from '../../index';

//Libs
import { useNavigation } from '@react-navigation/native';





export default Home = ({ navigation, route }) => {
    const _context = useContext(ProfileContext);
    //const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const width = Dimensions.get('screen').width;
    // let beginPosition = 0;
    // let endPosition = 0;
    //const navigation = useNavigation();
    const forceUpdate = useReducer(x => x + 1, 0)[1];

    useLayoutEffect(() => {
        let pnav = navigation.getParent();

        pnav.setOptions({
            title: 'PROFILE',
            headerLeft: () => <Image source={require('../../assets/hatch_social_logo_app.png')} alt='LOGO' style={{ width: 35, height: 41 }} />,
            headerRight: () => _context.profile && _context.profile.key && (
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


    useEffect(() => {
        console.log('home effect ',_context.profile);
        
        // navigation.addListener('focus', () => {
        //     console.log('home focus');
        //     loadProfiles();
        //     //loadTicker();
        // });
        // console.log(_context.profile);
        // if (!_context.profile.key)
        //     loadProfile();
        //loadProfile();
    }, [_context]);

    // const getCatalogs = useCallback(async() => {
    //     var cats = await ProfileService.GetCatalogs(_context.profile.key);
    //     console.log('meow ',cats);
    // })


    // const loadTicker = useCallback(async () => {
    //     let stuff = await TickerService.GetAggregateStuffs();
    // })

    // const getBeginPosition = async (e) => {
    //     beginPosition = e.contentOffset.x;
    // }

    // const getEndPosition = async (e) => {
    //     endPosition = e.contentOffset.x;
    //     let ni = endPosition / width;
    //     _context.updateProfile(profiles[ni]);
    // }

    // const loadProfile = useCallback(async () => {
    //     console.log('LOAD PROFILE');
    //     if (route && route.params && route.params.profile) {
    //         let profile = await ProfileService.GetProfile(route.params.profile.key);
    //         profile.catalogs = await ProfileService.GetCatalogs(profile.key);
    //         _context.updateProfile(profile);
    //     } else {
    //         let profiles = await ProfileService.GetProfiles();
    //         console.log('got profiles ', profiles);
    //         if (profiles && profiles.length > 0) {
    //             //setProfiles(profiles);
    //             profiles[0].catalogs = await ProfileService.GetCatalogs(profiles[0].key);
    //             _context.updateProfile(profiles[0]);

    //         } else {
    //             _context.updateProfile(null);
    //         }
    //     }

    //     setLoading(false);


    // })

    // const data = [
    //     'AAPL',
    //     'GOOGL',
    //     'GOOG',
    //     'MSFT',
    //     'FB',
    //     'TSM',
    //     'INTC',
    //     'ORCL',
    //     'CSCO',
    // ].map((item) => ({
    //     title: item,
    //     price: parseInt((Math.random() * 1000).toFixed(2), 10),
    //     change: parseInt((Math.random() * 100).toFixed(2), 10),
    //     isGain: Math.floor(Math.random() * 10).toFixed(2) > 5,
    // }));



    return <>
    {_context.profile && _context.profile.key && (
        <Box flex={1}>
            <ProfileMain />
            {/* <StockMarquee data={data} />
            {loading && <Center flex={1}><Spinner size="lg" /></Center>}
            {!loading && <Box flex={1}>
                {<ProfileMain />}
                
            </Box>
            } */}

        </Box>)}
    {!_context.profile || ( _context.profile && !_context.profile.key) && <Center flex={1}><Button onPress={() => { navigation.navigate('ProfileInfo', { newProfile: true, profileKey: null }) }} bg="white" style={{ width: 100, height: 100, borderRadius: 50 }}><Text color="black">NEW</Text></Button></Center>}
    </>


    
}