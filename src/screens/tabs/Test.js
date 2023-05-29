import React, { Component, useEffect, useContext, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, FlatList, Image, Dimensions } from 'react-native';
import { Box, Avatar, Center } from 'native-base';
import { RotatingMenu, ProfileContext } from '../..';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


export default Test = () => {
  const _context = useContext(ProfileContext);
  const keyGenerator = () => '_' + Math.random().toString(36).substr(2, 9);
  // const [cheeks, setCheeks] = useState([]);
  // const radius = 200;
  // // const width = Dimensions.get('window').width;
  // // const height = Dimensions.get('window').height;
  // const width = 500;
  // const height = 500;

  // let angle = 0;
  // let step = (2 * Math.PI) / _context.profile.catalogs.length;

  // useEffect(() => {
  //   spreadThoseCheeks();
  // }, [])

  // const spreadThoseCheeks = () => {


  //   let c = [];
  //   _context.profile.catalogs.forEach((element, i) => {
  //     //console.log(element);

  //     let x = Math.round(width / 2 + radius * Math.cos(angle) - 25);
  //     let y = Math.round(height / 2 + radius * Math.sin(angle) - 25);

  //     c.push(
  //       <Box key={keyGenerator()} style={[styles.catalog, { left: x, top: y }]}>
  //         <Text>
  //           {element.name}
  //         </Text>
  //       </Box>
  //     )

  //     angle = angle + step;
  //   });

  //   setCheeks(c);
  // }

  // const content = [
  //   <Image source={'https://cdn-icons-png.flaticon.com/512/45/45113.png?w=1060&t=st=1676265944~exp=1676266544~hmac=7914fe3839170f1e01bfde6d30ce36f1b16ae4692b2f175840362f1351833b28'} resizeMode="contain" style={styles.icon} />,
  //   <Image source={'https://cdn-icons-png.flaticon.com/512/45/45113.png?w=1060&t=st=1676265944~exp=1676266544~hmac=7914fe3839170f1e01bfde6d30ce36f1b16ae4692b2f175840362f1351833b28'} resizeMode="contain" style={styles.icon} />,
  //   <Image source={'https://cdn-icons-png.flaticon.com/512/45/45113.png?w=1060&t=st=1676265944~exp=1676266544~hmac=7914fe3839170f1e01bfde6d30ce36f1b16ae4692b2f175840362f1351833b28'} resizeMode="contain" style={styles.icon} />,
  //   <Image source={'https://cdn-icons-png.flaticon.com/512/45/45113.png?w=1060&t=st=1676265944~exp=1676266544~hmac=7914fe3839170f1e01bfde6d30ce36f1b16ae4692b2f175840362f1351833b28'} resizeMode="contain" style={styles.icon} />,
  // ]

  // const content = [
  //   <Box key={keyGenerator()} style={styles.catalog}>
  //     <Text>
  //       TITS
  //     </Text>
  //   </Box>
  // ]

  return (
    <Box style={{ flex: 1 }}>
      <RotatingMenu />
    </Box>

    // <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //   <RoundMenu centerContentSize={500}
    //     centerContent={<Avatar size={(DEVICE_WIDTH / 2) - 8} source={{
    //       uri: 'https://api.hatch.social/api/profiles/avatar?activeProfileKey=' + _context.profile.key + '&d=' + Date.now(),
    //       headers: {
    //         'Authorization': 'Bearer ' + _context.token
    //       }
    //     }} />}
    //     content={content} />


    //   {/* <Box style={styles.container}>
    //   {cheeks}
    // </Box> */}
    // </Box>
    // // <Box style={{flex: 1,justifyContent: 'center', alignItems: 'center'}}>
    // // <Box style={styles.container}>
    // //   {cheeks}
    // // </Box>
    // // </Box>

  )
}

const styles = StyleSheet.create({
  icon: {
    width: 50,
    height: 50,
  },
  centerImage: {
    width: 200,
    height: 200
  },
  container: {
    width: 500,
    height: 500
  },
  catalog: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'green'
  }
})