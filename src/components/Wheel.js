//React base
import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { StyleSheet, Alert, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Box, Avatar, Center } from 'native-base';

//Hatch stuffs
import { Catalog, StorageService, ProfileContext, RotatingMenu } from '../index';

//Libs
import { LongPressGestureHandler, TapGestureHandler, State } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Svg, { G, Text, TextPath, TSpan, Circle } from 'react-native-svg';


const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export default Wheel = ({prof}) => {
    const _context = useContext(ProfileContext);
    const [profile,setProfile] = useState(prof);
    const keyGenerator = () => '_' + Math.random().toString(36).substr(2, 9);
    const [radius, setRadius] = useState(DEVICE_WIDTH/2.75);
    const [renderCatalogs, setRenderCatalogs] = useState([]);
    const [theta, setTheta] = useState(0.0);
    const [token, setToken] = useState(null);
    const doubleTapRef = useRef(null);
    const navigation = useNavigation();


    useEffect(() => {
        buildCatalogs();
    }, [buildCatalogs]);


    const buildCatalogs = useCallback(async () => {
        if (profile) {
            let centerOfWheel = {
                x: DEVICE_WIDTH/6,
                y: DEVICE_WIDTH/6
            };

            let newCatalogs = [];
            let x = profile.catalogs;
            for (let i = 0; i < x.length; i++) {
                newCatalogs.push(
                    <Catalog key={keyGenerator()} profile={profile} index={i} theta={(Math.PI / 4.0) * i} radius={radius} center={centerOfWheel} />
                )
            }

            setRenderCatalogs(newCatalogs);
        }


    });

    const onLongPress = () => {
        let dto = {
            key: profile.key ?? undefined,
            displayName: profile.displayName, 
            description: profile.description, 
            privacy: profile.privacy, 
            backgroundColor: profile.backgroundColor, 
            tags: profile.catalogs.map((i)=>{return i.name})
        }
        navigation.navigate('ProfileInfo', {});
    };

    const onSingleTap = (event) => {
        if (event.nativeEvent.state === State.ACTIVE) {
            navigation.navigate('ProfilePosts');
        }
    };

    const onDoubleTap = (event) => {
        Alert.alert('doub');
        if (event.nativeEvent.state === State.ACTIVE) {
            Alert.alert('DOUBLE TAP');
        }
    };

    // const SvgComponent = props => (
    //     <Svg position="absolute" height="200" width="200" viewBox="60 60 300 300">
    //         <G id="circle">
    //             <Circle r={105} x={210} y={210}
    //                 fill="none"
    //                 transform="rotate(+90)"
    //             />
    //         </G>
    //         <Text fill="#fff" fontSize="24">
    //             <TextPath href="#circle" startOffset="50%">
    //                 <TSpan textAnchor="middle">
    //                     {props.profile.displayName}
    //                 </TSpan>
    //             </TextPath>
    //         </Text>
    //     </Svg>
    // );


    return (<Box ref={ref_id => (wheel = ref_id)} style={[styles.wheel, profile.privacy == 0 ? styles.private : styles.public]}>
            {/* <SvgComponent profile={profile} /> */}
            <LongPressGestureHandler
                onHandlerStateChange={({ nativeEvent }) => {
                    if (nativeEvent.state === State.ACTIVE) {
                        onLongPress();
                    }
                }}
                minDurationMs={700}>
                <TapGestureHandler
                    onHandlerStateChange={onSingleTap}
                    waitFor={doubleTapRef}>
                    <TapGestureHandler
                        ref={doubleTapRef}
                        onHandlerStateChange={onDoubleTap}
                        numberOfTaps={2}>
                            <RotatingMenu />
                        {/* <Avatar size={(DEVICE_WIDTH/2)-8} source={{
                            uri: 'https://api.hatch.social/api/profiles/avatar?activeProfileKey='+profile.key+'&d='+Date.now(),
                            headers: {
                                'Authorization': 'Bearer ' + _context.token
                            }
                        }} /> */}
                    </TapGestureHandler>
                </TapGestureHandler>
            </LongPressGestureHandler>

            {/* {renderCatalogs} */}

        </Box>)






}

const styles = StyleSheet.create({
    modal: {
        display: 'flex',
        justifycontent: 'center',
        alignItems: 'center'
    },
    private: {
        borderColor: 'red'
    },
    public: {
        borderColor: '#33dd50'
    },
    wheel: {
        height: DEVICE_WIDTH/2,
        width: DEVICE_WIDTH/2,
        borderWidth: 4,
        borderRadius: (DEVICE_WIDTH/2)/2,
        justifyContent: 'center',
        alignItems: 'center'
    }
});