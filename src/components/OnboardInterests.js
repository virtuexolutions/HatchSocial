//React base
import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Box, Text, Heading, FlatList } from 'native-base';

//Hatch stuffs
import { AuthService, StorageService, ProfileService } from '../index';

//Libs
import { useNavigation } from '@react-navigation/native';



export default OnboardInterests = ({ item, onSelected}) => {
    const keyGenerator = () => '_' + Math.random().toString(36).substr(2, 9);
    const width = Dimensions.get('screen').width;
    const [selected, setSelected] = useState(false);
    const [kids, setKids] = useState(item.children);

    useEffect(() => {
        init();
    },[init]);

    const init = () => {
        let k = kids;
        k.map(i => {
            i.selected = false;
            i.selClass = styles.unselected;
        })

        setKids(k);
    }

    const interestSelected = (item,index) => {
        let k = kids;
        k[index].selected = !k[index].selected;
        k[index].selClass = k[index].selected ? styles.selected : styles.unselected;
        setKids(k);
        setSelected((prev)=>!prev);
        onSelected(item,index);
    }

    const renderInterest = (item,index) => {
        return (
            <TouchableWithoutFeedback onPress={() => { interestSelected(item,index) }}>
                <Box width={100} height={135} flex={1} m={4} style={[{backgroundColor: 'lightblue'},item.selClass]} pl="4" pr="5" py="2">
                    <Text color="black" bold>
                        {item.tag}
                    </Text>
                </Box>
            </TouchableWithoutFeedback>
        )
    }




    return (
        <Box w={width} flex={1} >
            <Heading>{item.label}</Heading>
            <FlatList
                data={kids}
                renderItem={({item,index}) => renderInterest(item,index)}
                keyExtractor={item=>item.id}
                extraData={kids}
                showsHorizontalScrollIndicator={false}
                numColumns={3}
            />            
        </Box>

    )
}

const styles = StyleSheet.create({
    unselected: {
        backgroundColor: 'lightblue'
    },
    selected: {
        backgroundColor: 'darkblue'
    }
})