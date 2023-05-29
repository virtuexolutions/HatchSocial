//React base
import React, { useState, useEffect, useContext } from 'react';
import { Box, Text, Heading, HStack, VStack, FlatList, Avatar, Spacer } from 'native-base';

//Hatch stuffs
import { ProfileContext } from '../index';

//Libs
import Icon from 'react-native-vector-icons/FontAwesome5';


export default BubbleHome = ({ navigation }) => {
  const _context = useContext(ProfileContext);

  return (
    <Box>
      <VStack>
        <Box style={{height:300, backgroundColor: 'yellow'}}>

        </Box>
        <Box style={{height:300, backgroundColor: 'green'}}>

        </Box>
        <Box>

        </Box>
      </VStack>

    </Box>
  )
}

