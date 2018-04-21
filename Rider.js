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
  ListView
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import ReactNative from 'react-native';
import * as firebase from 'firebase';
import StatusBar from './StatusBar'
const styles = require('./styles.js');

const firebaseDbh = require ( './firebaseconfig');


type Props = {};
export default class Rider extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
          dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
          }),
          toColby: "something else",
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


  render() {
      if (this.state.toColby == true)
      {
          return (
         <View style={styles.container}>

         <StatusBar title="Rider View"/>
            <Text>The jitney is going towards colby</Text>
        
            </View>
     );
      }else{
        return (
            <View style={styles.container}>
   
            <StatusBar title="Rider View"/>
               <Text>The jitney is going away from colby</Text>
           
               </View>
        );
      }
          
    }

}


