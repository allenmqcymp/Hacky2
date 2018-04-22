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
  ListView
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
        <View style={styles.container}>
      <View style={styles.container}>
      <TouchableOpacity onPress= {this.NavigateDriver}>
      <Text>Go To driver Screen</Text>
          </TouchableOpacity >
          </View>
          <View style={styles.container}>
          <TouchableOpacity onPress= {this.NavigateRider}>
      <Text>Go To rider Screen</Text>
          </TouchableOpacity >
          </View>
      </View>
    );
  }
}


