//React base
import React, { useContext, useEffect } from 'react';
import { StyleSheet, Alert, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Box, Text, Center, Avatar, Image } from 'native-base';

//Hatch stuffs
import { StorageService, ProfileContext } from '../index';

//Libs
import LinearGradient from 'react-native-linear-gradient';
import { ItemClick } from 'native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types';

export default HatchProfileBg = ({ children }) => {
    const _context = useContext(ProfileContext);

    useEffect(()=>{console.log('giggles ',children,_context.profile.displayName)})

    return (
        <Box style={{flex: 1,overflow: 'hidden'}}>
            <Image alt="sdf" source={{ uri: 'https://api.hatch.social/api/profiles/avatar?activeProfileKey=' + _context.profile.key + '&d=' + Date.now(), headers: { 'Authorization': 'Bearer ' + _context.token } }} size="100%" resizeMode="cover" position="absolute" />
            <Box style={{ flex: 1, backgroundColor: 'black', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, opacity: .85 }}></Box>
            <Box style={[styles.outer, styles.middleLeft]}>
                <Box style={styles.middle}>
                    <Box style={styles.inner}></Box>
                </Box>
            </Box>
            {children}
        </Box>
    )
}
const DEVICE_WIDTH = Dimensions.get('window').width;
const styles = StyleSheet.create({
    outer: {
        width: 792,
        height: 792,
        borderRadius: 396,
        position: 'absolute',
        backgroundColor: '#8ddee4',
        opacity: .9
    },
    middle: {
        width: 612,
        height: 612,
        borderRadius: 306,
        position: 'absolute',
        backgroundColor: '#96dde4',
        left: 90,
        top: 80
    },
    inner: {
        width: 448,
        height: 448,
        borderRadius: 224,
        position: 'absolute',
        backgroundColor: '#96d8e0',
        left: 75,
        top: 80
    },
    topRight: {
        top: -120,
        right: -120,
    },
    bottomLeft: {
        bottom: -140,
        left: -140,
    },
    middleLeft: {
        left: -420,
        top: -110
    }
})