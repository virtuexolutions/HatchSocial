//React base
import React from 'react';
import { StyleSheet, Alert, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Box, Text, Center, Avatar } from 'native-base';

//Hatch stuffs
import { StorageService } from '../index';

//Libs
import LinearGradient from 'react-native-linear-gradient';

export default HatchButton = ({ pressed, label, alt }) => {
    return (<>
        {!alt && 
        <TouchableWithoutFeedback onPress={() => {pressed()}}>
            <LinearGradient start={{x:0,y:0}} end={{x:1,y:0}} colors={['#01E8E3', '#1296AF']} style={styles.gradient}>
            <Text style={styles.text}>{label}</Text>
            </LinearGradient>
        </TouchableWithoutFeedback>
}
        {alt && 
        <TouchableWithoutFeedback onPress={() => pressed()}>
            <LinearGradient start={{x:0,y:0}} end={{x:1,y:0}} colors={['#ffffff', '#ffffff']} style={styles.gradient}>
            <Text style={styles.altText}>{label}</Text>
            </LinearGradient>
        </TouchableWithoutFeedback>
    }
        
        </>
    )
}
const DEVICE_WIDTH = Dimensions.get('window').width;
const styles = StyleSheet.create({
    gradient: {
        borderRadius: 45,
        height: 50,
        width: DEVICE_WIDTH*.70,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: 'white',
        fontWeight: '500',
        fontSize: 16
    },
    altText: {
        color: '#1296AF',
        fontWeight: '500',
        fontSize: 16
    }
})