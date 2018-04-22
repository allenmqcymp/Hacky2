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
  ScrollView,
  FlatList,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import ReactNative from 'react-native';
import * as firebase from 'firebase';
import StatusBar from './StatusBar'
import ActionButton from './ActionButton'
const styles = require('./styles.js');
import ListItem from './ListItem.js';

const firebaseDbh = require ( './firebaseconfig');


type Props = {};
export default class Driver extends Component<Props> {

  static navigationOptions = {
    header: null,
    headerLeft: null
    };

    constructor(props) {
        super(props);
        this.state = {
          toColby: false,
          latitude: 0,
          longitude: 0,
          error: null,
          req: [],
          acc: []
        };
        this.itemsRef = firebase.database().ref();
      }


      componentDidMount() {
        this.watchID = navigator.geolocation.watchPosition(
          (position) => {
            this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
            });
            this.itemsRef.update({driverLocation: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }});
          },
          (error) => this.setState({error: error.message}),
          
        );
        
        this.listenForItems(this.itemsRef);
      }
      
      componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchId);
      }

      listenForItems(itemsRef) {
        itemsRef.on('value', (snap) => {
    
          // get children as an array
          var items = [];
          snap.child("riders").forEach((child) => {
          items.push(child);
          });
          this.setState({req: items});

          var accepted = [];
          snap.child("acceptedQueue").forEach((child) => {
          accepted.push(child);
          });
          this.setState({acc: accepted});
          
          var dir = snap.child("toColby");
          this.setState({toColby: dir.val()});
          
    
        });
      }
      
      setAway() {
        this.itemsRef.update({toColby: false});
        }

      setTo() {
        this.itemsRef.child("acceptedQueue").push({destination: "Colby"});
        }

        _renderItem(item) {
          return (
            <ListItem item={item} onpress={() => {}} />
          );
        }
        approve(kid){
          this.itemsRef.child("acceptedQueue").push({
            name: kid.child("name").val(),
            latitude: kid.child("latitude").val(),
            longitude: kid.child("longitude").val(),
            destination: kid.child("destination").val(),
            pickupLocation: kid.child("pickupLocation").val(),
          });
          kid.ref.remove();
        }

  render() {
    const {longitude}= this.state;
    const {latitude} = this.state;
    return (
        <View style={styles.container}>

        <StatusBar title="Driver View"/>

        <View>
        <ActionButton title="Going to Colby" onPress= {() => this.setTo()}/>
        <ActionButton title="Picking people up" onPress = {() => this.setAway()}/>
        <Text>{String(this.state.latitude)}</Text>
        <Text>{String(this.state.longitude)}</Text>
        <Text>Requested queue</Text>
        <ScrollView>
              <FlatList
                data = {this.state.req}
                renderItem={({ item }) => (
                  <View>
                      <View>
                          <Text>
                              Name: {item.child("name").val()}, Going to: {item.child("destination").val()}, Pickup location: {item.child("pickupLocation").val()}
                          </Text>
                      </View>
                      <View>
                          <TouchableOpacity title="Approve" onPress= {() => this.approve(item)}>
                              <Text>APPROVE</Text>
                          </TouchableOpacity>
                      </View>
                </View>
                  )}
              />
        </ScrollView>
        <Text>Accepted queue</Text>
        <ScrollView>
              <FlatList
                data = {this.state.acc}
                renderItem={({ item }) => (
                  <View>
                      <View>
                          <Text>
                              Name: {item.child("name").val()}, Going to: {item.child("destination").val()}, Pickup location: {item.child("pickupLocation").val()}
                          </Text>
                      </View>
                      <View>
                          <TouchableOpacity title="Approve" onPress= {() => {item.ref.remove()}}>
                              <Text>Finished ride</Text>
                          </TouchableOpacity>
                      </View>
                </View>
                  )}
              />
        </ScrollView>
        </View>
         </View>
    );
  }
}


