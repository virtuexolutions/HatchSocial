//React base
import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';
import { StyleSheet, Alert, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Box, Text, FlatList, HStack, VStack, Spacer, Spinner, Center, FormControl, Button, Modal, AlertDialog, Avatar, Input, TextArea, Switch, Pressable, Radio } from 'native-base';

//Hatch stuffs
import { ProfileService, StorageService, ProfileContext, HatchButton, HideKeyboard } from '../index.js';

//Libs
import Icon from 'react-native-vector-icons/FontAwesome5';
import Config from 'react-native-config';
import * as ImagePicker from 'react-native-image-picker';
import { SwipeListView } from 'react-native-swipe-list-view';



export default ProfileInfo = ({ navigation, route }) => {
    const _context = useContext(ProfileContext);

    const [profile, setProfile] = useState(null);
    const [errors, setErrors] = useState({});
    const [privacy, setPrivacy] = useState(0);
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [mediaLibOpen, setMediaLibOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const cancelRef = useRef(null);


    useEffect(() => {
        loadProfile();
    }, []);


    const loadProfile = useCallback(async () => {
        let dto = {}
        if (!route.params.newProfile && Object.keys(_context.profile).length > 0) {
            dto = {
                activeProfileKey: _context.profile.key,
                displayName: _context.profile.displayName,
                description: _context.profile.description,
                privacy: _context.profile.privacy
            };

            setPrivacy(_context.profile.privacy);
        }
        else {
            dto = {
                displayName: '',
                description: '',
                privacy: 0,
                tags: []
            }
        }

        setProfile(dto);

    });

    const preloadContext = useCallback(async () => {
        console.log('LOAD PROFILE');
        let profiles = await ProfileService.GetProfiles();
            console.log('got profiles ', profiles);
            if (profiles && profiles.length > 0) {
                profiles[0].catalogs = await ProfileService.GetCatalogs(profiles[0].key);
                _context.updateProfile(profiles[0]);
      
            } else {
                _context.updateProfile(null);
            }
      
        
      
      
      })

    const reloadContext = async (key) => {
        console.log('RELOAD PROFILE');
        let p = await ProfileService.GetProfile(key);
        console.log('got profile ', p);
        p.catalogs = await ProfileService.GetCatalogs(p.key);
        _context.updateProfile(p);
    };


    const saveP = async () => {
        setLoading(true);
        let x = profile;
        x.privacy = privacy;
        //setProfile(x);

        var prof = await ProfileService.Save(x);
        if (avatar !== null)
            await ProfileService.UploadAvatar(prof.activeProfileKey, avatar);

        await reloadContext(prof.activeProfileKey);

        setTimeout(async () => {
            setLoading(false);
            navigation.navigate('Home');
        }, 2000);

    }

    const cancel = async () => {
        navigation.goBack();
    }

    const deleteP = async () => {
        await ProfileService.Delete(profile.activeProfileKey);
        await preloadContext();
        navigation.navigate('Home');
    }



    const updateProfile = async (prop, val) => {
        let x = { ...profile };
        x[prop] = val;
        setProfile(x);
    }

    const onImageLibraryPress = async () => {
        const options = {
            maxHeight: 300,
            maxWidth: 300,
            mediaType: 'photo',
            includeBase64: true,
        };
        ImagePicker.launchImageLibrary(options, async (response) => {
            if (!response.didCancel)
                setAvatar(response.assets[0]);

            setMediaLibOpen(false);
        });
    };

    const onCameraPress = async () => {
        const options = {
            maxHeight: 300,
            maxWidth: 300,
            saveToPhotos: false,
            mediaType: 'photo',
            includeBase64: true,
        };
        ImagePicker.launchCamera(options, async (response) => {
            if (!response.didCancel)
                setAvatar(response.assets[0]);

            setMediaLibOpen(false);
        });
    };

    const gotoInterests = async () => {
        let p = profile;
        p.privacy = privacy;
        // //setProfile(p);

        // console.log('WOOFERS ', p);
        navigation.navigate('ProfileInterests', { profile: p, avatar: avatar });
    }



    return <>
        {!profile && (<Center flex={1}><Spinner size="lg" /></Center>)}
        {profile && (<HideKeyboard>
            <Box p="5" flex={1}>
                <VStack flex={1}>
                    <Box alignItems="center" mt="20">
                        <TouchableOpacity onPress={() => setMediaLibOpen(true)}>
                            <Box style={[styles.avatar, privacy == 0 ? styles.public : styles.private]}>
                                {!profile.activeProfileKey &&
                                    <>
                                        {!avatar && <Icon name="plus" size={80} />}
                                        {avatar && <Avatar size={174} source={{ uri: `data:image/png;base64,${avatar.base64}` }} />}
                                    </>
                                }
                                {profile.activeProfileKey &&
                                    <>
                                        {!avatar && <Avatar size={174} source={{ uri: 'https://api.hatch.social/api/profiles/avatar?activeProfileKey=' + profile.activeProfileKey + '&d=' + Date.now(), headers: { 'Authorization': 'Bearer ' + _context.token } }} />}
                                        {avatar && <Avatar size={174} source={{ uri: `data:image/png;base64,${avatar.base64}` }} />}
                                    </>
                                }
                            </Box>
                            <Icon name="edit" size={24} style={{ position: 'absolute', bottom: 0, right: 25, color: 'black' }} />
                        </TouchableOpacity>
                    </Box>

                    <Box alignItems="center" mt="10">
                        <Box style={{ width: 338, height: 274, borderRadius: 24, backgroundColor: '#ffffff', opacity: .25 }}>
                        </Box>
                        <Box style={{ position: 'absolute', width: 338, padding: 20 }}>
                            <FormControl isRequired isInvalid={'displayName' in errors}>
                                <FormControl.Label _text={{
                                    bold: true
                                }}>Display Name</FormControl.Label>

                                <Input value={profile.displayName} onChangeText={value => updateProfile('displayName', value)} />


                                {'displayName' in errors ? <FormControl.ErrorMessage>{errors.displayName}</FormControl.ErrorMessage> : <></>}
                            </FormControl>
                            <FormControl isRequired>
                                <FormControl.Label _text={{
                                    bold: true
                                }}>Description</FormControl.Label>

                                <TextArea h="20" value={profile.description} onChangeText={value => updateProfile('description', value)} />


                                {'description' in errors ? <FormControl.ErrorMessage>{errors.description}</FormControl.ErrorMessage> : <></>}
                            </FormControl>

                            <FormControl p="10px">
                                <HStack>
                                    <FormControl.Label flex={1} _text={{ bold: true }}>Privacy Setting</FormControl.Label>
                                    <Box flex={1}>
                                        <Radio.Group name="privacyGroup" accessibilityLabel="Privacy" value={privacy} onChange={value => setPrivacy(value)}>
                                            <HStack space={5} justifyContent='center'>
                                                <Radio value={0} colorScheme="green" size="md" my={1}>
                                                    Public
                                                </Radio>
                                                <Radio value={1} colorScheme="red" size="md" my={1}>
                                                    Private
                                                </Radio>
                                            </HStack>
                                        </Radio.Group>
                                        {/* <Switch name="privtog" isChecked={privacy > 0} colorScheme="emerald" onToggle={() => { var x = privacy; if (x == 0) x = 1; else x = 0; setPrivacy(x) }} /> */}
                                    </Box>

                                </HStack>

                            </FormControl>

                        </Box>
                    </Box>


                    <Box pb="5" style={{ position: 'absolute', bottom: 10, left: 0, right: 0 }} flex={1}>
                        {loading && (<Center flex={1}><Spinner size="lg" /></Center>)}
                        {!loading && (
                            <>
                                <HStack>
                                    <Center flex={1}>
                                        <Button w="60%" variant="outline" _text={{ color: '#2f4858' }} onPress={() => { cancel() }}>Cancel</Button>
                                    </Center>
                                    <Center flex={1}>
                                        <Button w="60%" bg="#2f4858" onPress={() => { saveP() }}>Save</Button>
                                    </Center>


                                </HStack>
                                {!route.params.newProfile && (<Center style={{ position: 'absolute', bottom: -10, left: 0, right: 0 }}>
                                    <Text color="red.500" underline onPress={() => setAlertOpen(!alertOpen)}>Delete</Text>
                                </Center>)}

                            </>
                        )}

                    </Box>
                </VStack>
                <Modal isOpen={mediaLibOpen} onClose={() => setMediaLibOpen(false)} closeOnOverlayClick={true} style={styles.modal}>
                    <Box style={styles.buttons}>
                        <Pressable style={styles.button} onPress={onImageLibraryPress}>
                            <Icon size={24} name="user" />
                            <Text style={styles.buttonText}>Library</Text>
                        </Pressable>
                        <Pressable style={styles.button} onPress={onCameraPress}>
                            <Icon size={24} name="camera" />
                            <Text style={styles.buttonText}>Camera</Text>
                        </Pressable>
                    </Box>
                </Modal>

                <AlertDialog leastDestructiveRef={cancelRef} isOpen={alertOpen} onClose={() => setAlertOpen(false)}>
                    <AlertDialog.Content>
                        <AlertDialog.CloseButton />
                        <AlertDialog.Header>Delete Profile</AlertDialog.Header>
                        <AlertDialog.Body>
                            This will remove the profile and all data related to it including configured bubbles. This action cannot be
                            reversed and deleted data can not be recovered.
                        </AlertDialog.Body>
                        <AlertDialog.Footer>
                            <Button.Group space={2}>
                                <Button variant="unstyled" style={{ width: '50%', backgroundColor: 'white', color: 'black', borderColor: 'blue' }} onPress={() => setAlertOpen(false)} ref={cancelRef}>
                                    Cancel
                                </Button>
                                <Button style={{ width: '50%', backgroundColor: 'red' }} onPress={() => deleteP()}>
                                    Delete
                                </Button>
                            </Button.Group>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                </AlertDialog>
            </Box>
        </HideKeyboard>
        )}






    </>

}



const styles = StyleSheet.create({
    private: {
        borderColor: 'red'
    },
    public: {
        borderColor: 'green'
    },
    avatar: {
        height: 180,
        width: 180,
        borderWidth: 3,
        backgroundColor: 'white',
        borderRadius: 90,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    buttonIcon: {
        width: 48,
        height: 48,
        margin: 5,
    },
    buttons: {
        backgroundColor: 'white',
        flexDirection: 'row',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        padding: 5
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'black'
    },
});
