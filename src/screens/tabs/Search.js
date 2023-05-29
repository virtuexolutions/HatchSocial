//React base
import React, { useState, useContext, useLayoutEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Box, Text, Button, Image, Menu, Pressable, HamburgerIcon, Heading, Input, VStack, Icon } from 'native-base';

//Hatch stuffs
import { ProfileContext } from '../../index';

//libs
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';



export default Search = ({ navigation }) => {
    const [weather, setWeather] = useState({});
    const [stuffLoaded, setStuffLoaded] = useState(false);
    const _context = useContext(ProfileContext);

    // useLayoutEffect(() => {
    //     let pnav = navigation.getParent();

    //     pnav.setOptions({
    //         title: 'SEARCH',
    //         headerLeft: () => <Image source={require('../../assets/hatch_social_logo_app.png')} alt='LOGO' style={{ width: 35, height: 41 }} />,
    //         headerRight: () => (
    //             <Menu w="190" trigger={triggerProps => {
    //                 return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
    //                     <HamburgerIcon size={8} />
    //                 </Pressable>;
    //             }}>
    //                 <Menu.Item onPress={() => { navigation.navigate('FeedInfo', { feedKey: null }) }}>New Feed</Menu.Item>
    //                 <Menu.Item onPress={() => { navigation.navigate('BubbleInfo', { bubbleKey: null }) }}>New Bubble</Menu.Item>
    //             </Menu>
    //         ),
    //     });
    // });

    const doStuff = () => {
        Alert.alert('TITS');
    }


    return (
        <Box style={styles.container}>
            <VStack w="100%" space={5} alignSelf="center">
        <Heading fontSize="lg">Cupertino</Heading>
        <Input placeholder="Search" variant="filled" width="100%" borderRadius="10" py="1" px="2" InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<FontAwesome5Icon name="search" />} />} />
      </VStack>
        </Box>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: 80,
        height: 80
    }
});
