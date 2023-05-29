//React base
import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';
import { StyleSheet, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { Box, Text, VStack, HStack, FormControl, Center, Button, Modal, Pressable, IconButton, useToast, Avatar, Input, TextArea, AlertDialog, Spinner, ScrollView } from 'native-base';

//Hatch stuffs
import { FeedService, StorageService, ProfileService, BubbleService, ProfileContext, InterestAdder, HideKeyboard } from '../index';

//Libs
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Config from 'react-native-config';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const screen = Dimensions.get('window');

export default FeedInfo = ({ navigation, route }) => {
    const _context = useContext(ProfileContext);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({});
    const [avatar, setAvatar] = useState(null);
    const [mediaLibOpen, setMediaLibOpen] = useState(false);
    const [interestsOpen, setInterestsOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const cancelRef = useRef(null);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const keyGenerator = () => '_' + Math.random().toString(36).substr(2, 9);
    const ref = useRef(null);

    const [list, setList] = React.useState(selectedItems);
    const [inputValue, setInputValue] = React.useState("");
    const toast = useToast();



    useEffect(() => {
        console.log('feed info');
        //getTags();
        getFeed();
        setLoading(false);
    }, [getFeed]);


    const getTags = useCallback(async () => {
        console.log('tags');
        let x = await BubbleService.GetAllTags();
        var arr = [];
        x.data.forEach((val, i) => {
            arr.push({
                id: i,
                name: val
            });
        })

        setTags(arr);
    });

    const getFeed = useCallback(async () => {
        console.log('feed');
        let f = await FeedService.GetFeed(route.params.feedKey, _context.profile.key);
        if (f) {
            setName(f.name);
            setDescription(f.description);
            setSelectedItems(f.tags);
            setList(f.tags);
        }
    });

    const reloadContext = async (key) => {
        console.log('RELOAD PROFILE');
        let p = await ProfileService.GetProfile(key);
        console.log('got profile ', p);
        p.catalogs = await ProfileService.GetCatalogs(p.key);
        _context.updateProfile(p);
    };


    const saveFeed = async () => {
        setLoading(true);

        let dto = {
            activeProfileKey: _context.profile.key,
            name: name,
            description: description,
            tags: selectedItems.length > 0 ? selectedItems : ['#hatch']
        }

        if (route.params.feedKey)
            dto.feedKey = route.params.feedKey;



        var f = await FeedService.Save(dto);
        if (avatar !== null)
            await FeedService.UploadAvatar(f, avatar);

        await reloadContext(_context.profile.key);

        setTimeout(async () => {
            setLoading(false);
            navigation.navigate('Home');
        }, 2000);



    }

    const cancel = async () => {
        navigation.goBack();
        //console.log(selectedItems);
    }

    const deleteB = async () => {
        await FeedService.Delete(route.params.feedKey, _context.profile.key);
        navigation.goBack();
    }




    const onImageLibraryPress = async () => {
        const options = {
            maxHeight: 300,
            maxWidth: 300,
            mediaType: 'photo',
            includeBase64: true,
        };
        ImagePicker.launchImageLibrary(options, async (response) => {
            if (!response.didCancel) {
                setAvatar(response.assets[0]);
            }


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
        setInterestsOpen(true);
    }



    const addItem = item => {
        if (item === "") {
            toast.show({
                title: "Please Enter Text",
                status: "warning"
            });
            return;
        }


        setList(prevList => {
            return [...prevList, item];
        });
    };

    const handleDelete = index => {
        setList(prevList => {
            const temp = prevList.filter((_, itemI) => itemI !== index);
            return temp;
        });
    };



    return <>
        {loading && (<Center flex={1}><Spinner size="lg" /></Center>)}
        {!loading && (<HideKeyboard>
            <Box p="5" flex={1}>
                <VStack flex={1}>
                    <Box alignItems="center" mt="20">
                        <TouchableOpacity onPress={() => setMediaLibOpen(true)}>
                            <Box style={[styles.avatar, styles.public]}>
                                {!route.params.feedKey &&
                                    <>
                                        {!avatar && <Icon name="plus" size={80} />}
                                        {avatar && <Avatar size={174} source={{ uri: `data:image/png;base64,${avatar.base64}` }} />}
                                    </>
                                }
                                {route.params.feedKey &&
                                    <>
                                        {!avatar && <Avatar size={174} source={{ uri: `https://api.hatch.social/api/feeds/avatar?activeProfileKey=${_context.profile.key}&feedKey=${route.params.feedKey}&d=${Date.now()}`, headers: { 'Authorization': 'Bearer ' + _context.token } }} />}
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
                            <FormControl isRequired isInvalid={'name' in errors}>
                                <FormControl.Label _text={{
                                    bold: true
                                }}>Display Name</FormControl.Label>
                                <Input value={name} onChangeText={value => setName(value)} />
                                {'name' in errors ? <FormControl.ErrorMessage>{errors.name}</FormControl.ErrorMessage> : <></>}
                            </FormControl>
                            <FormControl isRequired>
                                <FormControl.Label _text={{
                                    bold: true
                                }}>Description</FormControl.Label>
                                <TextArea h="20" value={description}  onChangeText={value => setDescription(value)} />
                                {'description' in errors ? <FormControl.ErrorMessage>{errors.description}</FormControl.ErrorMessage> : <></>}
                            </FormControl>
                            <FormControl>
                                <FormControl.Label _text={{
                                    bold: true
                                }}>Tags</FormControl.Label>
                                <Box><Text>{selectedItems.length} selected</Text><Text style={{ color: 'blue', textDecorationStyle: 'solid' }} onPress={() => setInterestsOpen(true)}>Edit</Text></Box>
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
                                        <Button w="60%" bg="#2f4858" onPress={() => { saveFeed() }}>Save</Button>
                                    </Center>


                                </HStack>

                                {route.params.feedKey && (<Center style={{ position: 'absolute', bottom: -10, left: 0, right: 0 }}>
                                    <Text color="red.500" underline onPress={() => setAlertOpen(!alertOpen)}>Delete</Text>
                                </Center>)}


                            </>
                        )}

                    </Box>
                </VStack>


                <Modal isOpen={interestsOpen} onClose={() => setInterestsOpen(false)} size={'xl'}>
                    <Modal.Content height={600}>
                        <Modal.CloseButton />
                        <Modal.Header>Add/Remove Interests</Modal.Header>
                        <Modal.Body>
                            <ScrollView>
                                <Box maxW="300" w="100%">
                                    <VStack space={4}>
                                        <HStack space={2}>
                                            <Input flex={1} onChangeText={v => setInputValue(v)} value={inputValue.toLowerCase()} autoFocus={true} placeholder="Add Tag" onSubmitEditing={() => {
                                                addItem(inputValue.charAt(0) == '#' ? inputValue.toLowerCase() : '#' + inputValue.toLowerCase());
                                                setInputValue("");
                                            }} />
                                            <IconButton borderRadius="sm" variant="solid" icon={<Icon as={FontAwesome5Icon} name="plus" size={24} color="warmGray.50" />} onPress={() => {
                                                addItem(inputValue.charAt(0) == '#' ? inputValue.toLowerCase() : '#' + inputValue.toLowerCase());
                                                setInputValue("");
                                            }} />
                                        </HStack>
                                        <VStack space={2}>
                                            {list.map((item, itemI) => <HStack w="100%" justifyContent="space-between" alignItems="center" key={item}>
                                                <Text width="100%" flexShrink={1} textAlign="left" mx="2" _light={{
                                                    color: "coolGray.800"
                                                }} _dark={{
                                                    color: "coolGray.50"
                                                }}>
                                                    {item}
                                                </Text>
                                                <IconButton size="sm" colorScheme="trueGray" icon={<Icon as={FontAwesome5Icon} name="minus" size={16} color="trueGray.400" />} onPress={() => handleDelete(itemI)} />
                                            </HStack>)}
                                        </VStack>

                                    </VStack>
                                </Box>
                            </ScrollView>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                    setInterestsOpen(false);
                                }}>
                                    Cancel
                                </Button>
                                <Button bg="amber.300" onPress={() => {
                                    console.log(selectedItems.length);
                                    setSelectedItems(list);
                                    setInterestsOpen(false);
                                }}>
                                    Save
                                </Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>



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
                        <AlertDialog.Header>Delete Feed</AlertDialog.Header>
                        <AlertDialog.Body>
                            This will remove the feed and all data related to it including configured interests. This action cannot be
                            reversed and deleted data can not be recovered.
                        </AlertDialog.Body>
                        <AlertDialog.Footer>
                            <Button.Group space={2}>
                                <Button variant="unstyled" style={{ width: '50%', backgroundColor: 'white', color: 'black', borderColor: 'blue' }} onPress={() => setAlertOpen(false)} ref={cancelRef}>
                                    Cancel
                                </Button>
                                <Button style={{ width: '50%', backgroundColor: 'red' }} onPress={() => deleteB()}>
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
        borderColor: '#33dd50'
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
    SplashLayout: {
        flex: 1,
    },
    inputLayout: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    textDanger: {
        color: "#dc3545"
    },
    MediaLayout: {
        paddingHorizontal: 20,
        width: screen.width - 40,
        flex: 1,
        flexDirection: 'row',
        alignItems: "center"
    },
    Media: {
        width: (screen.width - 120) / 2,
        height: (screen.width - 120) / 2,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#fff",
        justifyContent: "center",
        alignItems: "center"
    }
});