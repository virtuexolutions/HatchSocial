//React base
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Box, Center, Button, Image, Text, Spinner, HStack, useTheme, Heading } from 'native-base';

//Hatch stuffs
import { AuthService, StorageService, AccountService, HatchButton, ProfileContext } from '../index';

//Libs
import { CommonActions } from '@react-navigation/native';
import { Alert } from 'react-native';




export default Login = ({ navigation, route }) => {
  const _context = useContext(ProfileContext);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {

    checkStorageForToken();
  }, [checkStorageForToken]);

  const checkStorageForToken = useCallback(async () => {
    let token = await StorageService.Retrieve('hatch-auth0-access-token');
    if (token) {
      gotToken(token);
      //await AuthService.Logout();     // <------ nuclear option for auth loop
    }
    else
      setLoading(false);
  });


  const login = async () => {
    setLoading(true);
    if (!await AuthService.Login(gotToken))
      setLoading(false);
  }


  const gotToken = async (token, storageToken = true) => {
    _context.updateToken(token);
    if (!storageToken)
      await StorageService.Stash('hatch-auth0-access-token', token);

    console.log('token --> ',token);
    let authUser = await AuthService.GetAuthUser(token);
    if (authUser) {
      let account = await AccountService.CheckExistingAccount(token);
      if (!account) {
        account = await AccountService.AddNewAccount(authUser);
      }
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Main' }]
        })
      );
    } else {
      setLoading(false);
    }
  }




  return (

    <Box style={{ flex: 1, alignItems: 'center' }}>
      <Box style={{ position: 'absolute', top: 20, right: 20 }}><Text>Version 1.1.8</Text></Box>
      <Box alignItems="center" justifyContent="center" style={{flex:1}}>
        <Image source={require('../assets/hatch_social_logo.png')} alt='LOGO' style={{width:200}} />
      </Box>
      <Box style={{position: 'absolute', bottom: 20}}>
      {loading && (<HStack space={2} justifyContent="center">
          <Spinner color="#ffffff" accessibilityLabel="Loading Account" />
          <Heading color="#ffffff" fontSize="md">
            Loading
          </Heading>
        </HStack>)}
        {!loading && (
          <HatchButton pressed={() => login()} label="Log In" alt="login"></HatchButton>

        )}
      </Box>

      {/* <Box flex={1}>
        <Text w="76%">By using this application, you agree to our Terms of Service</Text>
      </Box> */}
      {/* <Box flex={1}>
        {loading && (<HStack space={2} justifyContent="center">
          <Spinner color="#ffffff" accessibilityLabel="Loading Account" />
          <Heading color="#ffffff" fontSize="md">
            Loading
          </Heading>
        </HStack>)}
        {!loading && (
          <HatchButton pressed={() => login()} label="Log In" alt={true}></HatchButton>

        )}
      </Box> */}

    </Box>
    // <LinearGradient start={{x:0,y:0}} end={{x:1,y:0}} colors={['#01E8E3', '#1296AF']}>

    // </LinearGradient>
  )
}