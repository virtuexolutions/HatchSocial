//React base
import React, { useState, useEffect, useCallback, useRef, useContext, useLayoutEffect } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Center, Box, Text, ScrollView, FormControl, TextArea, HStack, IconButton, VStack, Switch, Button, Input, Select, Radio, Modal, CheckIcon, Spinner, Image, Menu, Pressable, HamburgerIcon, useToast } from 'native-base';

//Hatch stuffs
import { ActivityService, BubbleService, MediaService, ProfileContext, HatchButton } from '../../index';

//Libs
//import FontAwesome, { SolidIcons, RegularIcons, BrandIcons, parseIconFromClassName } from 'react-native-fontawesome';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'react-native-image-picker';
import Config from 'react-native-config';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';


const screen = Dimensions.get('window');
export default NewPost = ({ navigation, route }) => {
  const _context = useContext(ProfileContext);
  const [title, setTitle] = useState(null);
  const [body, setBody] = useState(null);
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [privacy, setPrivacy] = useState(0);
  const [interestsOpen, setInterestsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [tags, setTags] = useState([]);

  const keyGenerator = () => '_' + Math.random().toString(36).substr(2, 9);

  const [list, setList] = React.useState(selectedItems);
  const [inputValue, setInputValue] = React.useState("");
  const toast = useToast();

  const bref = useRef(null);
  const tref = useRef(null);

  useEffect(() => {
    //getTags();

  }, [])

  const getTags = useCallback(async () => {
    let x = await BubbleService.GetAllTags();
    var arr = [];
    x.data.forEach((val, i) => {
      arr.push({
        id: i,
        name: val
      });
    })

    setTags(arr);
  })




  const mediaSelected = value => {
    switch (value) {
      case "lib":
        ImagePicker.launchImageLibrary({ mediaType: 'mixed', maxHeight: 300, maxWidth: 300 }, async (response) => {
          if (!response.didCancel) {
            setMedia(response.assets[0]);
          }

        })
        break;
      case "cam":
        ImagePicker.launchCamera({ saveToPhotos: false, mediaType: 'mixed', maxHeight: 300, maxWidth: 300 }, (response) => {
          if (!response.didCancel)
            setMedia(response.assets[0]);
        });
        break;
      default:
        break;
    }
  }


  const sendPost = async () => {
    setLoading(true);

    let dto = {
      activeProfileKey: _context.profile.key,
      title: '',
      body: body,
      privacy: privacy
    }

    //setPost(p);
    let np = await ActivityService.Save(dto, media);

    setTimeout(async () => {
      setLoading(false);
      navigation.goBack();
    }, 3000);

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



  return (
    <Box style={{ flex: 1, alignItems: 'center' }}>
      <VStack w="94%" space="4">
        {/* <FormControl>
          <FormControl.Label _text={{
            bold: true
          }}>Title</FormControl.Label>
          <Input variant="filled" value={title} onChangeText={value => setTitle(value)} />
        </FormControl> */}
        <FormControl>
          <FormControl.Label _text={{
            bold: true
          }}>Body</FormControl.Label>
          <TextArea h={20} value={body} onChangeText={value => setBody(value)} />
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
            </Box>

          </HStack>

        </FormControl>


        {/* <FormControl>
          <FormControl.Label _text={{
            bold: true
          }}>Tags</FormControl.Label>
          <Box><Text>{selectedItems.length} selected</Text><Text style={{ color: 'blue', textDecorationStyle: 'solid' }} onPress={() => setInterestsOpen(true)}>Edit</Text></Box>

        </FormControl> */}

        <FormControl p="10px">
          <FormControl.Label _text={{
            bold: true
          }}>Upload Media</FormControl.Label>
          <Select bg="white" minWidth="200" accessibilityLabel="Upload Media" label="fsdfdf" _selectedItem={{
            bg: "teal.600", endIcon: <CheckIcon size="5" />
          }} mt={1} onValueChange={value => { mediaSelected(value) }}>
            <Select.Item label="Library" value="lib" key={keyGenerator()} />
            <Select.Item label="Camera" value="cam" key={keyGenerator()} />
          </Select>
        </FormControl>



      </VStack>
      <Center style={{ position: 'absolute', bottom: 140, left: 0, right: 0 }} flex={1}>
        {loading && (<Center flex={1}><Spinner size="lg" /></Center>)}
        {!loading && (
          <HatchButton pressed={sendPost} label="Post" />
        )}

      </Center>



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
    </Box>
  );
}
const styles = StyleSheet.create({
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