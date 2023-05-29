//React base
import React, { useState, useContext } from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Box, Text, Heading, FlatList, HStack, VStack, Spacer, useToast, Center, IconButton, Input, Button, Alert } from 'native-base';

//Hatch stuffs
import { AuthService, StorageService, ProfileContext } from '../index';

//Libs
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { getStyleAndFilteredProps } from 'native-base/lib/typescript/theme/styled-system';


export default InterestAdder = ({selectedItems, closed}) => {
  // const instState = [{
  //   title: "Code",
  //   isCompleted: true
  // }, {
  //   title: "Meeting with team at 9",
  //   isCompleted: false
  // }, {
  //   title: "Check Emails",
  //   isCompleted: false
  // }, {
  //   title: "Write an article",
  //   isCompleted: false
  // }];
  //const init = 
  const [list, setList] = React.useState(selectedItems);
  const [inputValue, setInputValue] = React.useState("");
  const toast = useToast();

  const addItem = item => {
    console.log(item);
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

  // const handleStatusChange = index => {
  //   setList(prevList => {
  //     const newList = [...prevList];
  //     newList[index].isCompleted = !newList[index].isCompleted;
  //     return newList;
  //   });
  // };

  return <Center w="100%">
      <Box maxW="300" w="100%">
        {/* <Heading mb="2" size="md">
          Wednesday
        </Heading> */}
        <VStack space={4}>
          <HStack space={2}>
            <Input flex={1} onChangeText={v => setInputValue(v)} value={inputValue} autoFocus={true} placeholder="Add Tag" onSubmitEditing={() => {
              // addItem(inputValue.charAt(0)=='#' ? inputValue.toLowerCase() : '#'+inputValue.toLowerCase());
              setInputValue("");
            }} />
            <IconButton borderRadius="sm" variant="solid" icon={<Icon as={FontAwesome5Icon} name="plus" size={24} color="warmGray.50" />} onPress={() => {
              addItem('dick');
            // addItem(inputValue.charAt(0)=='#' ? inputValue.toLowerCase() : '#'+inputValue.toLowerCase());
            setInputValue("");
          }} />
          </HStack>
          <VStack space={2}>
            {list.map((item, itemI) => <HStack w="100%" justifyContent="space-between" alignItems="center" key={item}>
                {/* <Checkbox isChecked={item.isCompleted} onChange={() => handleStatusChange(itemI)} value={item.title}></Checkbox> */}
                <Text width="100%" flexShrink={1} textAlign="left" mx="2" _light={{
              color: "coolGray.800"
            }} _dark={{
              color: "coolGray.50"
            }} onPress={() => handleStatusChange(itemI)}>
                  {item}
                </Text>
                <IconButton size="sm" colorScheme="trueGray" icon={<Icon as={FontAwesome5Icon} name="minus" size={16} color="trueGray.400" />} onPress={() => handleDelete(itemI)} />
              </HStack>)}
          </VStack>

        </VStack>
      </Box>
    </Center>;
};

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
