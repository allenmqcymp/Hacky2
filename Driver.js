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
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps'
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
        this.itemsRef.child("acceptedQueue").push({name: "Colby College", destination: "Colby", latitude: 44.563834695219676, longitude: 69.66263065869515});
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
        getRandomColor() {
          var letters = '0123456789ABCDEF';
          var color = '#';
          for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
          }
          return color;
        }

  render() {
    const lat = this.state.latitude;
    const long = this.state.longitude;
    const {longitude}= this.state;
    const {latitude} = this.state;
    return (
        <View style={styles.container}>

        <MapView
          provider={PROVIDER_GOOGLE}
          style={{width:500,height:500,position:'relative',top: 0, left: 0}}
          region={{
            latitude: lat,
            longitude: long,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
          <Marker coordinate= {{latitude: this.state.latitude, longitude: this.state.longitude}} pinColor= '#00FFFF'/>
          
           {this.state.acc.map((item,index) => 
            <Circle center={{latitude: item.child("latitude").val(), longitude: item.child("longitude").val()}} radius= {30} fillColor= {this.getRandomColor()}/>
           )}
          </MapView>
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


