//React base
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Box, Text, HStack, VStack, Avatar, useTheme, Fab, Spacer } from 'native-base';

//Hatch stuffs
import { ProfileService, StorageService} from '../index';

//Libs
//import FontAwesome, { SolidIcons, RegularIcons, BrandIcons, parseIconFromClassName } from 'react-native-fontawesome';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Config from 'react-native-config';
import Moment from 'moment';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';

const screen = Dimensions.get('screen');


export default ProfileList = ({ navigation, route }) => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        getData();
    }, [getData]);


    const getData = useCallback(async () => {
        //setLoading(true);
        let profs = await ProfileService.GetAllProfiles();

        if(profs) {            
            setProfiles(profs);
            //setLoading(false);
        } else {
            setProfiles([]);
        }
        
    }, [])


    const newProfile = () => {
        navigation.navigate('ProfileInfo', { profile: null });
    }

    const editProfile = (item) => {
        navigation.navigate('ProfileInfo', { profile: item });
    }

    const dragEnded = async (data) => {
        setProfiles(data);
        let order = []
        data.map((item)=>{
            order.push(item.key);
        });
        await ProfileService.SetProfileOrder(order);
    }


    const renderItem = ({ item }) => {
        return (
            <ScaleDecorator>
                <TouchableOpacity
                    onPress={() => {editProfile(item)}}
                    onLongPress={drag}
                    disabled={isActive}
                    style={[
                        styles.rowItem
                        // { backgroundColor: isActive ? 'lime' : 'blue' },
                    ]}
                >
                    <Box>
                        <HStack space={3} justifyContent="space-between">
                            <Box style={[styles.wheel, item.privacy == 0 ? styles.private : styles.public]}>
                                <Avatar size="44px" source={{ uri: 'https://api.hatch.social/api/profiles/avatar?activeProfileKey=' + profile.activeProfileKey + '&d=' + Date.now(), headers: { 'Authorization': 'Bearer ' + _context.token } }} />
                            </Box>

                            <VStack>
                                <Text _dark={{
                                    color: "warmGray.50"
                                }} color="black" bold>
                                    {item.displayName}
                                </Text>
                                <Text color="black" _dark={{
                                    color: "warmGray.200"
                                }}>
                                    {item.description}
                                </Text>
                            </VStack>
                            <Spacer />
                            <VStack>
                                <Text fontSize="xs" _dark={{
                                    color: "warmGray.50"
                                }} color="black" alignSelf="flex-start">
                                    {Moment(item.createdAt).format('MM/DD/YYYY')}
                                </Text>
                                <Text fontSize="xs" _dark={{
                                    color: "warmGray.50"
                                }} color="black" alignSelf="flex-start">
                                    {item.catalogs.length} catalogs
                                </Text>
                            </VStack>

                        </HStack>
                    </Box>
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };


    return (
        <Box flex={1} bg="#ffffff">
            <DraggableFlatList
                data={profiles}
                onDragEnd={({ data }) => dragEnded(data)}
                keyExtractor={(item) => item.key}
                renderItem={renderItem}
            />
            <Fab onPress={() => { navigation.navigate('ProfileInfo', {profile:null}) }} renderInPortal={false} shadow={2} size={16} icon={
                
            <Icon color="white" name="add" size={24} />
            } />

        </Box>


    )


}

const styles = StyleSheet.create({

    private: {
        borderColor: 'red'
    },
    public: {
        borderColor: 'green'
    },
    wheel: {
        height: 48,
        width: 48,
        borderWidth: 5,
        backgroundColor: 'white',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowItem: {
        padding: 10
    },

});