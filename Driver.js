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
import StatusBar from './StatusBar'
import ActionButton from './ActionButton'
const styles = require('./styles.js');

const firebaseDbh = require ( './firebaseconfig');


type Props = {};
export default class Driver extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
          dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
          }),
          toColby: false,
        };
        this.itemsRef = firebase.database().ref();
      }

      componentDidMount() {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows([{ title: this.state.toColby, key: 'something' }])
        });
        this.listenForItems(this.itemsRef);
      }
      
      listenForItems(itemsRef) {
        itemsRef.on('value', (snap) => {
    
          // get children as an array
          var items = [];
          var dir = snap.child("toColby");
          this.setState({toColby: dir.val()});
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows([{ title: this.state.toColby}])
          });
    
        });
      }
      
      setAway() {
        this.itemsRef.set({toColby: false});
        }

      setTo() {
        this.itemsRef.set({toColby: true});
        }

    

  render() {
    return (
        <View style={styles.container}>

        <StatusBar title="Driver View"/>

        <View>
        <ActionButton title="Going to Colby" onPress= {() => this.setTo()}/>
        <ActionButton title="Picking people up" onPress = {() => this.setAway()}/>
        </View>
         </View>
    );
  }
}


