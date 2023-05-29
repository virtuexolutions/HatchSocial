//React base
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Box, Stack, Fab, useTheme } from 'native-base';

//Hatch stuffs
import { FeedService, StorageService } from '../index';

//Libs
//import FontAwesome, { SolidIcons, RegularIcons, BrandIcons, parseIconFromClassName } from 'react-native-fontawesome';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Moment from 'moment';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';



export default FeedList = ({ navigation, route }) => {
    const [feeds, setFeeds] = useState([]);
    const [token, setToken] = useState(null);
    const { colors } = useTheme();

    useEffect(() => {
        console.log('TURDS ', route.params.profileKey);
        getToken();
        loadFeeds();

        navigation.addListener('focus', () => {
            console.log('got some focus');
            loadFeeds();
        });

    }, [getToken, loadFeeds]);

    const getToken = useCallback(async () => {
        let t = await StorageService.Retrieve('hatch-auth0-access-token');
        setToken(t);
    });

    const loadFeeds = useCallback(async () => {
        let bubs = await FeedService.GetFeedsByProfileId(route.params.profileKey);
        console.log('dookie ',bubs);
        setFeeds(bubs);
    }, [])


    const newFeed = () => {
        console.log('DUDE ', route.params.profileKey);
        navigation.navigate('FeedInfo', { feed: null, profileKey: route.params.profileKey });
    }

    const editFeed = (item) => {
        console.log('SWEET ', route.params.profileKey);
        navigation.navigate('FeedInfo', { feed: item, profileKey: route.params.profileKey });
    }

    const dragEnded = async (data) => {
        setFeeds(data);
        let order = []
        data.map((item) => {
            order.push(item.key);
        });
        await FeedService.SetFeedOrder(order, route.params.profileKey);
    }

    const renderItem = ({ item, drag, isActive }) => {
        return (
            <ScaleDecorator>
                <TouchableOpacity
                    onPress={() => { editFeed(item) }}
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
                                <Avatar size="44px" source={{
                                    uri: 'https://api.hatch.social/api/bubbles/' + item.key + '/avatar',
                                    headers: {
                                        'Authorization': 'Bearer ' + token
                                    }
                                }} />
                            </Box>

                            <VStack>
                                <Text _dark={{
                                    color: "warmGray.50"
                                }} color="white" bold>
                                    {item.name}
                                </Text>
                                <Text color="white" _dark={{
                                    color: "warmGray.200"
                                }}>
                                    {item.description}
                                </Text>
                            </VStack>
                            <Spacer />
                            <VStack>
                                <Text fontSize="xs" _dark={{
                                    color: "warmGray.50"
                                }} color="white" alignSelf="flex-start">
                                    {Moment(item.created).format('MM/DD/YYYY')}
                                </Text>
                                <Text fontSize="xs" _dark={{
                                    color: "warmGray.50"
                                }} color="white" alignSelf="flex-start">
                                    {item.tags.length} tags
                                </Text>
                            </VStack>

                        </HStack>
                    </Box>
                    
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };



    return token && (
        <Box bg="#ffffff" flex={1}>
            <DraggableFlatList
                data={feeds}
                onDragEnd={({ data }) => dragEnded(data)}
                keyExtractor={(item) => item.key}
                renderItem={renderItem}
            />
            <Fab onPress={() => { newFeed() }} renderInPortal={false} shadow={2} size={16} icon={
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
