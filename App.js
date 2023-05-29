import React from 'react';
import { TouchableWithoutFeedback, Keyboard, SafeAreaView, ImageBackground } from 'react-native';
import { NativeBaseProvider, extendTheme, Text } from 'native-base';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

//Hatch stuffs
import { Root } from './src/index';

export default App = () => {
  console.log('Hello. I am the Hatch Console.');

  const theme = extendTheme({
    components: {
      Input: {
        baseStyle: {
        },
        defaultProps: {
          color: 'black',
          bg: 'light.200',
          _focus: {
            bg: 'light.50'
          }
        }
      },
      TextArea: {
        baseStyle: {
        },
        defaultProps: {
          color: 'black',
          bg: 'light.200',
          _focus: {
            bg: 'light.50'
          }
        }
      },
      Text: {
        defaultProps: {
          color: 'black'
        }
      },
      Box: {
        defaultProps: {

        }
      },
      Button: {
        baseStyle: {
          borderRadius: 45,
          height: 49,
          width: 200,
          
        },
        defaultProps: {
          backgroundColor: 'transparent'
        }
      }
    }
  })

  return (
    <NativeBaseProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          {/* <SplashScreen /> */}
        <ImageBackground source={require('../Allentown/src/assets/hatchbg.png')} resizeMode="cover" style={{ flex:1, width: '100%', height: '100%' }}>
             <Root />
      </ImageBackground>

        </SafeAreaView>
      </GestureHandlerRootView>
    </NativeBaseProvider>
  )
};
