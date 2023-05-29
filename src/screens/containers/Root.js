//React base
import React, { useState } from 'react';

//Hatch stuffs
import { Login, Main, ProfileContext, Splash } from '../../index';

//Libs
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


export default Root = () => {
  const Stack = createNativeStackNavigator();
const navTheme = DefaultTheme;
navTheme.colors.background = 'transparent';
  const [obj,setObj] = useState({profile:{},token:''});
  // const [p, setProfile] = useState({});
  // const [t,setToken] = useState('');

  updateProfile = (profile) => {
    const o = { ...obj, profile };
    setObj(o);
  }

  updateToken = (token) => {
    const o = { ...obj, token };
    setObj(o);
  }

  const profileSetters = {
    updateProfile,
    updateToken
  }

  return (
    
      <NavigationContainer>
        <ProfileContext.Provider value={{ ...obj, ...profileSetters }}>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash}></Stack.Screen>
          <Stack.Screen name="Login" component={Login}></Stack.Screen>
          <Stack.Screen name="Main" component={Main}></Stack.Screen>
        </Stack.Navigator>
        </ProfileContext.Provider>
      </NavigationContainer>
    

  )
}