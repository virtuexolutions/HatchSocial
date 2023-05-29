//React base
import React, { useEffect, useState, useCallback, useContext, useLayoutEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Box, Heading, HStack, VStack, Button, Text, FlatList, Center, useTheme, Spinner, Image, Menu, Pressable, HamburgerIcon, Modal, ScrollView, Alert, Avatar, Spacer } from 'native-base';

//Hatch stuffs
import { AccountService, ProfileService, AuthService } from '../../index';

//Libs
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import Moment from 'moment';



export default Account = ({ navigation }) => {
  const _context = useContext(ProfileContext);
  const [account, setAccount] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const keyGenerator = () => '_' + Math.random().toString(36).substr(2, 9);
  // useLayoutEffect(() => {
  //   let pnav = navigation.getParent();

  //   pnav.setOptions({
  //     title: 'ACCOUNT',
  //     headerLeft: () => <Image source={require('../../assets/hatch_social_logo_app.png')} alt='LOGO' style={{ width: 35, height: 41 }} />,
  //     headerRight: () => (
  //       <Menu w="190" trigger={triggerProps => {
  //         return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
  //           <HamburgerIcon size={8} />
  //         </Pressable>;
  //       }}>
  //         <Menu.Item onPress={() => { navigation.navigate('FeedInfo', { feedKey: null }) }}>New Feed</Menu.Item>
  //         <Menu.Item onPress={() => { navigation.navigate('BubbleInfo', { bubbleKey: null }) }}>New Bubble</Menu.Item>
  //       </Menu>
  //     ),
  //   });
  // });

  useEffect(() => {
    getAccount();
    getProfiles();
  }, [getAccount, getProfiles]);

  const getAccount = useCallback(async () => {
    let account = await AccountService.CheckExistingAccount();
    setAccount(account);
  });

  const getProfiles = useCallback(async () => {
    let profiles = await ProfileService.GetProfiles();
    console.log('got profiles ', profiles);
    setProfiles(profiles);

  });

  const logout = () => {
    AuthService.Logout();
  }

  const switchProfile = (profile) => {
    setModalVisible(false);
    _context.updateProfile(profile);
    navigation.navigate('Home', {profile: profile});
  }

  const renderItem = (item) => {
    console.log('HELLO ',item);
    return (
      <TouchableOpacity key={item.key} onPress={() => { switchProfile(item) }}>
        <Box mt={5} style={_context.profile.key == item.key ? styles.active : styles.inactive}>
          <HStack space={3} justifyContent="space-between">
            <Box style={[styles.avatar, item.privacy == 0 ? styles.private : styles.public]}>
              <Avatar size="44px" source={{ uri: 'https://api.hatch.social/api/profiles/avatar?activeProfileKey=' + item.key + '&d=' + Date.now(), headers: { 'Authorization': 'Bearer ' + _context.token } }} />
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
            </VStack>

          </HStack>
        </Box>
      </TouchableOpacity>
    );
  };

  return profiles && (
    <Box pt="25" px="5" flex={1}>
      <Box>
        <Heading>Account Details</Heading>
        <Text>Email Address: {account.email}</Text>
      </Box>
      {/* <Box style={{ position: 'absolute', left: 10, top: -180 }}>
                <Image resizeMode='contain' width={100} source={require('../assets/hatchlogo.png')} alt='LOGO' />
            </Box> */}
      <VStack space={5}>
        <HatchButton pressed={() => setModalVisible(true)} label="Switch Profile" />
        <HatchButton pressed={() => navigation.navigate('ProfileInfo', { newProfile: true, profileKey: null })} label="New Profile" />
        {/* <HatchButton pressed={() => navigation.navigate('ProfileList')} label="Profile List"></HatchButton> */}
        <HatchButton pressed={() => logout()} label="Logout" />
      </VStack>

      <Modal isOpen={modalVisible} onClose={setModalVisible} size="full">
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Body>
            
            <Box flex={1} mt="30" height="500">
              {profiles.map(p => renderItem(p))}
              {/* <FlatList data={profiles} keyExtractor={(item) => item.key} renderItem={renderItem} /> */}
              </Box>
            
            
            
          </Modal.Body>
        </Modal.Content>
      </Modal>

    </Box>
  )
}

const styles = StyleSheet.create({
  avatar: {
    height: 44,
    width: 44,
    borderWidth: 3,
    backgroundColor: 'white',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center'
  },
  private: {
    borderColor: 'red',
  },
  public: {
    borderColor: 'green'
  },
  active: {
    backgroundColor: 'green'
  },
  inactive: {

  }
})