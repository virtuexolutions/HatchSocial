import React, { useRef, useState, useContext } from 'react';
import { View, StyleSheet, I18nManager, TouchableOpacity, Image, Text, Dimensions, Alert } from 'react-native';
import { Box, Avatar, Center } from 'native-base';
import { WP, pointOnCircle, calculateRadius, calculateAngleBetweenTwoPoints } from './services';
import { PanGestureHandler, LongPressGestureHandler, TapGestureHandler, State } from 'react-native-gesture-handler';
import { ProfileContext } from '..';
import { useNavigation } from '@react-navigation/native';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const RotatingMenu = ({ size = WP('100'), contentContainerStyle, centerContent, centerContentSize = size / 4, rotateCenterImage, backgroundColor }) => {
    const _context = useContext(ProfileContext);
    const navigation = useNavigation();
    const touchEvent = useRef({ x: undefined, y: undefined });
    const touchEventPrev = useRef({ x: undefined, y: undefined });
    const touchStart = useRef(undefined);
    const doubleTapRefP = useRef();
    const doubleTapRefC = useRef();
    const center = { x: size / 2, y: size / 2 };
    const radius = size / 3;
    const divisionAngle = !_context.profile.catalogs ? 0 : _context.profile.catalogs.length > 0 ? 360 / _context.profile.catalogs.length : 0;
    const [offsetAngle, setOffsetAngle] = useState(0);
    const handleGesture = (e) => {
        touchEvent.current = e.nativeEvent;
        if (!touchStart.current) {
            touchStart.current = {
                touchEvent: e.nativeEvent,
                angle: offsetAngle
            };
            touchEventPrev.current = e.nativeEvent;
            return;
        }
        const touchDistanceFromCenter = calculateRadius(center, touchEvent.current);
        if (touchDistanceFromCenter > radius * 0.3 && touchDistanceFromCenter < radius * 1.5) {
            const angleMoved = calculateAngleBetweenTwoPoints(center, touchEventPrev.current, touchEvent.current);
            touchEventPrev.current = e.nativeEvent;
            setOffsetAngle(offsetAngle + (I18nManager.isRTL ? -angleMoved : angleMoved));
        }
    };
    const onTouchRelease = (e) => {
        if (e.nativeEvent.oldState === 4) {
            touchEventPrev.current = undefined;
            touchStart.current = undefined;
        }
    };



    const onLongPressP = () => {
        // let dto = {
        //     key: _context.profile.key ?? undefined,
        //     displayName: profile.displayName,
        //     description: profile.description,
        //     privacy: profile.privacy,
        //     backgroundColor: profile.backgroundColor,
        //     tags: profile.catalogs.map((i) => { return i.name })
        // }
        navigation.navigate('ProfileInfo', {});
    };

    const onSingleTapP = (event) => {
        if (event.nativeEvent.state === State.ACTIVE) {
            navigation.navigate('ProfilePosts');
        }
    };

    const onDoubleTapP = (event) => {
        if (event.nativeEvent.state === State.ACTIVE) {
            Alert.alert('DOUBLE TAP');
        }
    };


    const onLongPressC = (index) => {
        console.log(_context.profile.catalogs[index]);
        if (_context.profile.catalogs[index].catalogType == 2)
            navigation.navigate('FeedInfo', { feedKey: _context.profile.catalogs[index].key });
        else if (_context.profile.catalogs[index].catalogType == 1)
            navigation.navigate('BubbleInfo', { bubbleKey: _context.profile.catalogs[index].key });
        else
            Alert.alert('Mistakes were made.');
    };

    const onSingleTapC = (event, index) => {
        if (event.nativeEvent.state === State.ACTIVE) {
            if (_context.profile.catalogs[index].catalogType == 2)
                navigation.navigate('Activity', { catalog: _context.profile.catalogs[index] });
            else if (_context.profile.catalogs[index].catalogType == 1)
                navigation.navigate('BubbleHome');
            else
                Alert.alert('Mistakes were made.');

        }
    };

    const onDoubleTapC = (event) => {
        if (event.nativeEvent.state === State.ACTIVE) {
            Alert.alert('Double Tap');
        }
    };






    return (React.createElement(View, null,
        React.createElement(PanGestureHandler, { onHandlerStateChange: onTouchRelease, onGestureEvent: handleGesture },
            React.createElement(View, { style: styles({ size, backgroundColor }).container },
            _context.profile.catalogs && _context.profile.catalogs.map((el, i) => {
                    const [x, y] = pointOnCircle({
                        radius,
                        angle: divisionAngle * (i + 1) + offsetAngle,
                        cx: center.x,
                        cy: center.y
                    });
                    const elContainerSize = size / 4;

                    return (React.createElement(TouchableOpacity, {
                        key: i, activeOpacity: 1, style: [
                            styles({ elContainerSize, elContainerCoOrdinates: { x, y } }).elContainer
                        ]
                    },
                        <>
                            <LongPressGestureHandler
                                onHandlerStateChange={({ nativeEvent }) => {
                                    if (nativeEvent.state === State.ACTIVE) {
                                        onLongPressC(i);
                                    }
                                }}
                                minDurationMs={800}>
                                <TapGestureHandler
                                    onHandlerStateChange={(event) => onSingleTapC(event, i)}
                                    waitFor={doubleTapRefC}>
                                    <TapGestureHandler
                                        ref={doubleTapRefC}
                                        onHandlerStateChange={onDoubleTapC}
                                        numberOfTaps={2}>
                                        <Center>
                                        <Box style={{ width: x / 100 * 20, height: x / 100 * 20, borderWidth: 3, borderRadius: x / 100 * 20 / 2, borderColor: _context.profile.catalogs[i].catalogType != 2 && _context.profile.catalogs[i].privacy == 1 ? 'red' : 'green' }}>
                                            {_context.profile.catalogs[i].catalogType == 2 && <Avatar size={x / 100 * 20-6} source={{ uri: `https://api.hatch.social/api/feeds/avatar?activeProfileKey=${_context.profile.key}&feedKey=${_context.profile.catalogs[i].key}&d=${Date.now()}`, headers: { 'Authorization': 'Bearer ' + _context.token } }} />}
                                            {_context.profile.catalogs[i].catalogType == 1 && <Avatar size={x / 100 * 20-6} source={{ uri: `https://api.hatch.social/api/bubbles/avatar?activeProfileKey=${_context.profile.key}&bubbleKey=${_context.profile.catalogs[i].key}&d=${Date.now()}`, headers: { 'Authorization': 'Bearer ' + _context.token } }} />}

                                            </Box>

                                            <Text style={{ fontSize: 10, position: 'absolute', bottom: -10, color: 'black', zIndex: 4002 }}>{_context.profile.catalogs[i].name}</Text>
                                            <Text style={{ fontSize: 16, position: 'absolute', top: 10, color: 'black', zIndex: 4002 }}>{_context.profile.catalogs[i].catalogType == 2 ? 'FEED' : 'BUBBLE'}</Text>
                                        </Center>

                                    </TapGestureHandler>
                                </TapGestureHandler>
                            </LongPressGestureHandler>


                        </>
                    ));
                }),
                React.createElement(View, {
                    style: {
                        //transform: rotateCenterImage ? [{ rotate: I18nManager.isRTL ? (-offsetAngle + 'deg') : (offsetAngle + 'deg') }] : 'none',
                        left: center.x - centerContentSize / 2,
                        top: center.x - centerContentSize / 2,
                        width: centerContentSize,
                        height: centerContentSize,
                        position: "absolute",
                        justifyContent: 'center',
                        alignItems: 'center'
                    }
                },
                    <>
                        <LongPressGestureHandler
                            onHandlerStateChange={({ nativeEvent }) => {
                                if (nativeEvent.state === State.ACTIVE) {
                                    onLongPressP();
                                }
                            }}
                            minDurationMs={700}>
                            <TapGestureHandler
                                onHandlerStateChange={onSingleTapP}
                                waitFor={doubleTapRefP}>
                                <TapGestureHandler
                                    ref={doubleTapRefP}
                                    onHandlerStateChange={onDoubleTapP}
                                    numberOfTaps={2}>
                                    <Box style={{ width: DEVICE_WIDTH / 2, height: DEVICE_WIDTH / 2, borderWidth: 4, borderRadius: DEVICE_WIDTH / 2 / 2, borderColor: _context.profile.privacy == 0 ? 'green' : 'red' }}>
                                        <Avatar size={(DEVICE_WIDTH / 2) - 8} source={{
                                            uri: 'https://api.hatch.social/api/profiles/avatar?activeProfileKey=' + _context.profile.key + '&d=' + Date.now(),
                                            headers: {
                                                'Authorization': 'Bearer ' + _context.token
                                            }
                                        }} />
                                    </Box>

                                </TapGestureHandler>
                            </TapGestureHandler>
                        </LongPressGestureHandler>
                    </>)))));
};
export default RotatingMenu;
const styles = ({ size, elContainerSize, elContainerCoOrdinates = { x: 0, y: 0 }, backgroundColor }) => StyleSheet.create({
    container: {
        width: size ? size : WP('100'),
        height: size ? size : WP('100'),
        backgroundColor,
    },
    textStyle: {
        marginTop: 10,
        textAlign: 'center',
        color: "#000000",
        overflow: 'visible',
    },
    imageStyle: {
        width: '100%',
        height: '100%'
    },
    elContainer: {
        position: "absolute",
        left: elContainerCoOrdinates.x - elContainerSize / 2,
        top: elContainerCoOrdinates.y - elContainerSize / 2,
        width: elContainerSize,
        height: elContainerSize,
        justifyContent: 'center',
        alignItems: 'center',
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
        alignItems: 'center'
    },
    wheel: {
        width: 600,
        height: 600,
        borderWidth: 3,
        backgroundColor: 'red'
    }
});