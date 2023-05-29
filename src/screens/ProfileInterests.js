//React base
import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Box, Text, FlatList, HStack, Center, Button, Spinner } from 'native-base';

//Hatch stuffs
import { ProfileService, OnboardInterests } from '../index';
import tagfile from '../config/tags.json';

//Libs
import Icon from 'react-native-vector-icons/FontAwesome5';
import { CommonActions } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';


export default ProfileInterests = ({ navigation, route }) => {
    // useLayoutEffect(() => {
    //     navigation.setOptions({
    //         headerTitle: 'Interests'
    //     })
    // })
    const [tags, setTags] = useState(tagfile);
    const [profile, setProfile] = useState(route.params.profile);
    const [feed, setFeed] = useState(route.params.feed);
    const [bubbles, setBubble] = useState(route.params.bubble);
    const [avatar, setAvatar] = useState(route.params.avatar);
    const [loading, setLoading] = useState(false);
    const height = Dimensions.get('screen').height;
    const width = Dimensions.get('screen').width;



    const onSelected = (item, index) => {
        let p = profile;
        let i = p.tags.findIndex(x => item.tag === x);
        if (i > -1)
            p.tags.splice(i, 1);
        else
            p.tags.push(item.tag);

        setProfile(p);

    }

    const saveP = async () => {
        setLoading(true);
        setTimeout(async () => {
            console.log('GIGGLES ', profile);
            var prof = await ProfileService.Save(profile);
            if (avatar !== null)
                await ProfileService.UploadAvatar(prof.activeProfileKey, avatar);

            setLoading(false);
            navigation.popToTop();
        }, 2000);


    }

    const cancel = async () => {
        navigation.popToTop();
    }



    return (
        <Box flex={1}>
            <Box style={{ height: height - 300 }}>
                <FlatList
                    horizontal
                    keyExtractor={item => item.id}
                    decelerationRate={0}
                    snapToInterval={width}
                    snapToAlignment='center'
                    data={tags}
                    extraData={tags}
                    renderItem={({ item, index }) => <OnboardInterests item={item} onSelected={onSelected} />}
                    showsHorizontalScrollIndicator={false}
                />
            </Box>

            <Box p="10px" style={{ position: 'absolute', bottom: 40, left: 0, right: 0 }}>
                {loading && (<Center flex={1}><Spinner size="lg" /></Center>)}
                {!loading && (<HStack w="100%">
                    <Center flex={1}>
                        <Button w="60%" variant="outline" _text={{ color: '#2f4858' }} onPress={() => { cancel() }}>Cancel</Button>
                    </Center>
                    <Center flex={1}>
                        <Button w="60%" bg="#2f4858" onPress={() => { saveP() }}>Save</Button>
                    </Center>


                </HStack>)}

            </Box>
        </Box>
    );



}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
