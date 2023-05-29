//React base
import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Box, Text, Center, Avatar } from 'native-base';

//Hatch stuffs
import { StorageService, ProfileContext, BubbleHome } from '../index';

//Libs
import { LongPressGestureHandler, TapGestureHandler, State } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';



export default React.memo(Catalog = ({ profile, index, theta, radius, center }) => {
    const _context = useContext(ProfileContext);
    const [newCoords, setNewCoords] = useState({ x: 0, y: 0 });
    const doubleTapRef = useRef();
    const navigation = useNavigation();

    useEffect(() => {
        setNewCoords(getMyCoords());
    }, []);



    const getMyCoords = () => {
        return {
            x: Math.cos(theta) * radius,
            y: Math.sin(theta) * radius
        }
    }


    const onLongPress = () => {
        console.log(profile.catalogs[index]);
        if (profile.catalogs[index].catalogType == 2)
            navigation.navigate('FeedInfo', { feedKey: profile.catalogs[index].key });
        else if (profile.catalogs[index].catalogType == 1)
            navigation.navigate('BubbleInfo', { bubbleKey: profile.catalogs[index].key });
        else
            Alert.alert('Mistakes were made.');
    };

    const onSingleTap = (event) => {
        if (event.nativeEvent.state === State.ACTIVE) {
            if (profile.catalogs[index].catalogType == 2)
                navigation.navigate('Activity', { catalog: profile.catalogs[index] });
            else if (profile.catalogs[index].catalogType == 1)
                navigation.navigate('BubbleHome');
            else
                Alert.alert('Mistakes were made.');

        }
    };

    const onDoubleTap = (event) => {
        if (event.nativeEvent.state === State.ACTIVE) {
            Alert.alert('Double Tap');
        }
    };

    return (
    <Center style={{ ...styles.spot, left: center.x + newCoords.x, top: center.y - newCoords.y }}>
        <LongPressGestureHandler
            onHandlerStateChange={({ nativeEvent }) => {
                if (nativeEvent.state === State.ACTIVE) {
                    onLongPress();
                }
            }}
            minDurationMs={800}>
            <TapGestureHandler
                onHandlerStateChange={onSingleTap}
                waitFor={doubleTapRef}>
                <TapGestureHandler
                    ref={doubleTapRef}
                    onHandlerStateChange={onDoubleTap}
                    numberOfTaps={2}>
                    <Center>
                        {profile.catalogs[index].catalogType == 2 &&
                            <Box style={[styles.spot, styles.none]}>
                                <Avatar size="60px" source={{ uri: `https://api.hatch.social/api/feeds/avatar?activeProfileKey=${profile.key}&feedKey=${profile.catalogs[index].key}&d=${Date.now()}`, headers: { 'Authorization': 'Bearer ' + _context.token } }} />
                            </Box>}
                        {profile.catalogs[index].catalogType == 1 &&
                            <Box style={[styles.spot, profile.catalogs[index].privacy == 0 ? styles.private : styles.public]}>
                                <Avatar size="60px" source={{ uri: `https://api.hatch.social/api/bubbles/avatar?activeProfileKey=${profile.key}&bubbleKey=${profile.catalogs[index].key}&d=${Date.now()}`, headers: { 'Authorization': 'Bearer ' + _context.token } }} />
                            </Box>}

                        <Text style={{ fontSize: 10, position: 'absolute', bottom: -10, color: 'black', zIndex: 4002 }}>{profile.catalogs[index].name}</Text>
                        <Text style={{ fontSize: 16, position: 'absolute', top: 10, color: 'black', zIndex: 4002 }}>{profile.catalogs[index].catalogType == 2 ? 'FEED' : 'BUBBLE'}</Text>
                    </Center>

                </TapGestureHandler>
            </TapGestureHandler>
        </LongPressGestureHandler>
    </Center>
    )

})

const styles = StyleSheet.create({
    catalog: {
        position: 'absolute'
    },
    none: {
        borderColor: 'white'
    },
    private: {
        borderColor: 'red'
    },
    public: {
        borderColor: 'green'
    },
    spot: {
        height: 64,
        width: 64,
        borderWidth: 2,
        backgroundColor: 'green',
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 4001
    }
});

