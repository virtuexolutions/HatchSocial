//React base
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Box, Text, FormControl, Switch, HStack, VStack, Center, Avatar, AlertDialog } from 'native-base';

//Hatch stuffs
import { ProfileService, StorageService} from '../index';

//Libs
//import FontAwesome, { SolidIcons, RegularIcons, BrandIcons, parseIconFromClassName } from 'react-native-fontawesome';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Config from 'react-native-config';
import * as ImagePicker from 'react-native-image-picker';



export default ProfileInfo = ({ navigation, route }) => {
    const [profile, setProfile] = useState(route.params.profile ?? { displayName: '', description: '', privacy: 0, tags: [] });
    const [errors, setErrors] = useState({});
    const [privacy, setPrivacy] = useState(route.params.profile ? route.params.profile.privacy : 0);
    const [token, setToken] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const cancelRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const bgs = ['#f6ae2d', '#33658a', 'f26419', '#55dde0']


    useEffect(() => {
        console.log('Profile Info');
        getToken();
    }, [getToken]);



    const onClose = () => setIsOpen(false);



    const getToken = useCallback(async () => {
        let t = await StorageService.Retrieve('hatch-auth0-access-token');
        setToken(t);
    });

    const saveP = async () => {
        setLoading(true);
        setTimeout(async () => {
            let x = profile;
            x.privacy = privacy;
            setProfile(x);
            var prof = await ProfileService.Save(x);
            console.log('added profile this is the key ', prof);
            if (avatar !== null)
                await ProfileService.UploadAvatar(prof.key, avatar);

            setLoading(false);
            navigation.goBack();
        }, 2000);

    }

    const cancel = async () => {
        navigation.goBack();
    }

    const deleteP = async () => {
        await ProfileService.Delete(profile);
        navigation.goBack();
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

            setIsVisible(false);
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
        });
    };

    const gotoInterests = async () => {
        let p = profile;
        p.privacy = privacy;
        setProfile(p);
        navigation.navigate('ProfileInterests', { profile: p, avatar: avatar })
    }


    return token && (
        <Box bg="#f6ae2d" p="5" flex={1}>
            {loading && <Center flex={1}><Spinner size="lg" /></Center>}
            {!loading && <>
                <VStack space={2} flex={1}>


                    <HStack>
                        <Box bg="green" flex={1}>
                            <TouchableOpacity onPress={() => setIsVisible(true)}>
                                <Box style={[styles.avatar, privacy === 0 ? styles.private : styles.public]}>
                                    {!profile.key &&
                                        <>
                                            {!avatar && 
                                            <Icon name="person" size={100} onPress={() => setIsVisible(true)} />
                                            }
                                            {avatar && <Avatar size="90px" source={{ uri: `data:image/png;base64,${avatar.base64}` }} />}
                                        </>
                                    }
                                    {profile.key &&
                                        <>
                                            {!avatar && token !== '' && <Avatar size="90px" source={{ uri: 'https://api.hatch.social/api/profiles/' + profile.key + '/avatar', headers: { 'Authorization': 'Bearer ' + token } }} />}
                                            {avatar && <Avatar size="90px" source={{ uri: `data:image/png;base64,${avatar.base64}` }} />}
                                        </>
                                    }
                                </Box>
                                <Icon name="create" size={28} style={{ position: 'absolute', bottom: 0, right: 25, color: 'white' }} />
                            </TouchableOpacity>
                        </Box>
                        <Box bg="blue" flex={2}>
                            <FormControl isRequired isInvalid={'displayName' in errors}>
                                <FormControl.Label _text={{
                                    bold: true
                                }}>Display Name</FormControl.Label>
                                <Input value={profile.displayName} backgroundColor="light.100" onChangeText={value => updateProfile('displayName', value)} />
                                {'displayName' in errors ? <FormControl.ErrorMessage>{errors.displayName}</FormControl.ErrorMessage> : <></>}
                            </FormControl>
                        </Box>
                    </HStack>


                    <FormControl isRequired>
                        <FormControl.Label _text={{
                            bold: true
                        }}>Description</FormControl.Label>
                        <TextArea h="20" value={profile.description} backgroundColor="light.100" onChangeText={value => updateProfile('description', value)} />
                        {'description' in errors ? <FormControl.ErrorMessage>{errors.description}</FormControl.ErrorMessage> : <></>}
                    </FormControl>
                    <FormControl p="10px">
                        <HStack>
                            <FormControl.Label flex={1} _text={{ bold: true }}>Public Profile</FormControl.Label>
                            <Box flex={1}>
                                <Switch name="privtog" isChecked={privacy > 0} colorScheme="emerald" onToggle={(x) => { var x = privacy; if (x == 0) x = 1; else x = 0; setPrivacy(x) }} />
                            </Box>

                        </HStack>

                    </FormControl>

                    <Box pb="5" style={{ position: 'absolute', bottom: 10, left: 0, right: 0 }} flex={1}>
                        {profile.key &&
                            <HStack>
                                <Center flex={1}>
                                    <Button w="60%" variant="outline" _text={{ color: '#2f4858' }} onPress={() => { cancel() }}>Cancel</Button>
                                </Center>
                                <Center flex={1}>
                                    <Button w="60%" bg="#2f4858" onPress={() => { saveP() }}>Save</Button>
                                </Center>


                            </HStack>
                        }

                        {!profile.key &&
                            <Center>
                                <Button bg="#2f4858" onPress={() => { gotoInterests() }} w="90%">Add Interests</Button>
                            </Center>
                        }
                        {profile.key &&
                            <Center style={{ position: 'absolute', bottom: -10, left:0,right:0 }}>
                                <Text color="red.500" underline onPress={() => setIsOpen(!isOpen)}>Delete</Text>
                            </Center>
                        }
                    </Box>



                    
                </VStack>
            </>}
            <Modal isOpen={isVisible} onClose={() => setIsVisible(false)} closeOnOverlayClick={true} style={styles.modal}>
                        <Box style={styles.buttons}>
                            <Pressable style={styles.button} onPress={onImageLibraryPress}>
                                <Icon size={24} name="person" />
                                <Text style={styles.buttonText}>Library</Text>
                            </Pressable>
                            <Pressable style={styles.button} onPress={onCameraPress}>
                                <Icon size={24} name="alarm" />
                                <Text style={styles.buttonText}>Camera</Text>
                            </Pressable>
                        </Box>
                    </Modal>

                    <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={() => onClose()}>
                        <AlertDialog.Content>
                            <AlertDialog.CloseButton />
                            <AlertDialog.Header>Delete Profile</AlertDialog.Header>
                            <AlertDialog.Body>
                                This will remove the profile and all data related to it including configured bubbles. This action cannot be
                                reversed and deleted data can not be recovered.
                            </AlertDialog.Body>
                            <AlertDialog.Footer>
                                <Button.Group space={2}>
                                    <Button colorScheme="coolGray" onPress={() => onClose()} ref={cancelRef}>
                                        Cancel
                                    </Button>
                                    <Button colorScheme="danger" onPress={() => deleteP()}>
                                        Delete
                                    </Button>
                                </Button.Group>
                            </AlertDialog.Footer>
                        </AlertDialog.Content>
                    </AlertDialog>
        </Box>
        
    );
}

const styles = StyleSheet.create({
    private: {
        borderColor: 'red'
    },
    public: {
        borderColor: 'green'
    },
    avatar: {
        height: 96,
        width: 96,
        borderWidth: 3,
        backgroundColor: 'white',
        borderRadius: 48,
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