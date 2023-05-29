//React base
import React from 'react';
import { Dimensions } from 'react-native';
import { Box, Text } from 'native-base';

import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
export default ProfilePosts = () => {
  return (
    <Box flex={1}>
      <LinearGradient style={{flex:1}} colors={["#ffffff00", "rgba(40, 40, 43,.5)"]}>
        <Text>This widwdwfile</Text>

      </LinearGradient>

    </Box>

  )
}