/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ListView,
  Image
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import ReactNative from 'react-native';
import * as firebase from 'firebase';
const StatusBar = require('./StatusBar');
const ActionButton = require('./ActionButton');
const styles = require('./styles.js');

const firebaseDbh = require ( './firebaseconfig');







type Props = {};
export default class StartScreen extends Component<Props> {
  static navigationOptions = {
    header: null,
    headerLeft: null
    };
  



    navigate = (targetRoute)=> {
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: targetRoute }),
          ],
        });
        this.props.navigation.dispatch(resetAction);
      }

    NavigateDriver = ()=>{
        this.navigate('Driver');
      }

      NavigateRider = ()=>{
        this.navigate('Rider');
      }

      

  render() {
    return (
      //   <View style={styles.container}>
      // <View style={styles.container}>
      // <TouchableOpacity onPress= {this.NavigateDriver}>
      // <Text>Go To driver Screen</Text>
      //     </TouchableOpacity >
      //     </View>
      //     <View style={styles.container}>
      //     <TouchableOpacity onPress= {this.NavigateRider}>
      // <Text>Go To rider Screen</Text>
      //     </TouchableOpacity >
      //     </View>
      // </View>
      <View style={styles.container}>
      <Image style={{width: 300, height: 300}} source={require('./MuleRides.png')} />
      <TouchableOpacity onPress= {this.NavigateDriver} style={styles.DriverButton}>
          <Text style={{color: '#ffffff',fontSize:40,}}>DRIVER</Text>
      </TouchableOpacity >
      <TouchableOpacity onPress= {this.NavigateRider} style={styles.RiderButton}>
          <Text style={{color: '#002878',fontSize:40,fontWeight:'900',borderColor:'#002878'}}>RIDER</Text>
      </TouchableOpacity >
</View>
    );
  }
}


