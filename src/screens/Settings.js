//React base
import React, { useState, useContext } from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Box, Text, Heading, FlatList, HStack, Spacer } from 'native-base';

//Hatch stuffs
import { AuthService, StorageService, ProfileContext } from '../index';

//Libs
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';


export default Settings = () => {
  const _context = useContext(ProfileContext);
  const [items,setItems] = useState([
    {
      id: 1,
      icon: 'beer',
      name: 'Logout',
      onClick: () => { logout()}
    }, 
    // {
    //   id: 6,
    //   icon: 'beer',
    //   name: 'Wipe Data',
    //   onClick: async () => { await StorageService.DestroyAll() }
    // },
    // {
    //   id: 2,
    //   icon: 'beer',
    //   name: 'Support',
    //   onClick: async () => { await StorageService.GetAllItems('HS_') }
    // }, {
    //   id: 3,
    //   icon: 'beer',
    //   name: 'Privacy Policy',
    //   onClick: () => { }
    // }, {
    //   id: 4,
    //   icon: 'beer',
    //   name: 'Terms of use',
    //   onClick: () => { }
    // }, {
    //   id: 5,
    //   icon: 'beer',
    //   name: 'Logout',
    //   onClick: () => { logout()}
    // }
  ]);



  const logout = () => {
    AuthService.Logout();
  }

  return (
    <LinearGradient start={{x:0,y:0}} end={{x:1,y:0}} colors={['#ffffff', _context.profile.backgroundColor]} style={{ flex: 1 }}>
    <Box pt="5" px="5" flex={1}>
      <Heading>Settings</Heading>
      <FlatList data={items} renderItem={({
        item
      }) => <TouchableWithoutFeedback onPress={() => { item.onClick(item) }}><Box borderBottomWidth="1" borderColor="coolGray.200" pl="4" pr="5" py="4">
          <HStack space={6} justifyContent="space-between">
            <Icon name={item.icon} color="#ff8b3d" />

            <Text color="white">
              {item.name}
            </Text>
            <Spacer />
          </HStack>
        </Box></TouchableWithoutFeedback>} keyExtractor={item => item.id} />
    </Box>
    </LinearGradient>
)
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6edd9',
    padding: 10
  },

  border: {
    borderWidth: 1,
    borderColor: '#20232a',
  },

  headerStyle: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '100'
  },

  elementsContainer: {
    flex: 1
  },

  subText: {
    textAlign: 'center',
    fontSize: 24,
  },
});
