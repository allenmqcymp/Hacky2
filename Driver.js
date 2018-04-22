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
  Image,
  Dimensions
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
        // <View style={styles.container}>

        // <MapView
        //   provider={PROVIDER_GOOGLE}
        //   style={{width:500,height:500,position:'relative',top: 0, left: 0}}
        //   region={{
        //     latitude: lat,
        //     longitude: long,
        //     latitudeDelta: 0.015,
        //     longitudeDelta: 0.0121,
        //   }}>
        //   <Marker coordinate= {{latitude: this.state.latitude, longitude: this.state.longitude}} pinColor= '#00FFFF'/>
          
        //    {this.state.acc.map((item,index) => 
        //     <Circle center={{latitude: item.child("latitude").val(), longitude: item.child("longitude").val()}} radius= {30} fillColor= {this.getRandomColor()}/>
        //    )}
        //   </MapView>
        // <View>
        // <ActionButton title="Going to Colby" onPress= {() => this.setTo()}/>
        // <ActionButton title="Picking people up" onPress = {() => this.setAway()}/>
        // <Text>{String(this.state.latitude)}</Text>
        // <Text>{String(this.state.longitude)}</Text>
        // <Text>Requested queue</Text>
        // <ScrollView>
        //       <FlatList
        //         data = {this.state.req}
        //         renderItem={({ item }) => (
        //           <View>
        //               <View>
        //                   <Text>
        //                       Name: {item.child("name").val()}, Going to: {item.child("destination").val()}, Pickup location: {item.child("pickupLocation").val()}
        //                   </Text>
        //               </View>
        //               <View>
        //                   <TouchableOpacity title="Approve" onPress= {() => this.approve(item)}>
        //                       <Text>APPROVE</Text>
        //                   </TouchableOpacity>
        //               </View>
        //         </View>
        //           )}
        //       />
        // </ScrollView>
        // <Text>Accepted queue</Text>
        // <ScrollView>
        //       <FlatList
        //         data = {this.state.acc}
        //         renderItem={({ item }) => (
        //           <View>
        //               <View>
        //                   <Text>
        //                       Name: {item.child("name").val()}, Going to: {item.child("destination").val()}, Pickup location: {item.child("pickupLocation").val()}
        //                   </Text>
        //               </View>
        //               <View>
        //                   <TouchableOpacity title="Approve" onPress= {() => {item.ref.remove()}}>
        //                       <Text>Finished ride</Text>
        //                   </TouchableOpacity>
        //               </View>
        //         </View>
        //           )}
        //       />
        // </ScrollView>
        // </View>
        //  </View>
        <View style={styles.container}>

        <View style={styles.mapPlaceholder}>
          
         <MapView
         customMapStyle={[
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#1d2c4d"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#8ec3b9"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#1a3646"
              }
            ]
          },
          {
            "featureType": "administrative.country",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#4b6878"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#64779e"
              }
            ]
          },
          {
            "featureType": "administrative.province",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#4b6878"
              }
            ]
          },
          {
            "featureType": "landscape.man_made",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#334e87"
              }
            ]
          },
          {
            "featureType": "landscape.natural",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#023e58"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#283d6a"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#6f9ba5"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#1d2c4d"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#023e58"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#3C7680"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#304a7d"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#98a5be"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#1d2c4d"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#2c6675"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#255763"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#b0d5ce"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#023e58"
              }
            ]
          },
          {
            "featureType": "transit",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#98a5be"
              }
            ]
          },
          {
            "featureType": "transit",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#1d2c4d"
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#283d6a"
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#3a4762"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#0e1626"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#4e6d70"
              }
            ]
          }
        ]}
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

        </View>

    <View style={styles.InfoContainer}>
    <TouchableOpacity style={styles.AddColbyButton} title="Approve" onPress= {() => this.setTo()}>
        <Text style={styles.requestJitneyText}>ADD COLBY TO QUEUE</Text>
    </TouchableOpacity>
    
    <ScrollView style={{marginTop:20}}>
    <Text style={styles.SectionHeader}>REQUESTS</Text>
                  <View style={{flex: 1, flexDirection: 'row',height:40,width:'100%'}}>
                        <View style={{alignSelf:'flex-start'}}>
                                <View style={{flexDirection: 'row',width:'100%',fontSize:16,padding:8,paddingLeft:20,width: Dimensions.get('window').width-34}}>
                                <View style={{flex: 0.3}}><Text style={{fontWeight:'bold',color:'black'}}>Name</Text></View>
                                <View style={{flex: 0.4}}><Text style={{fontWeight:'bold',color:'black'}}>Pickup</Text></View>
                                <View style={{flex: 0.3}}><Text style={{fontWeight:'bold',color:'black'}}>Destination</Text></View>
                                </View>
                        </View>
                        <View style={{alignSelf:'flex-end',width:90,paddingBottom:3,paddingRight:15}}>
                        </View>
                  </View>
                <FlatList
                  data={this.state.req}
                  renderItem={({ item }) => (
                    <View style={{flex: 1, flexDirection: 'row',height:40,width:'100%'}}>
                        <View style={{alignSelf:'flex-start',}}>
                                <View style={{flexDirection: 'row',width:'100%',fontSize:16,padding:8,paddingLeft:20,width: Dimensions.get('window').width-34}}>
                                    <View style={{flex: 0.3}}><Text>{item.child("name").val()}</Text></View>
                                    <View style={{flex: 0.4}}><Text>{item.child("pickupLocation").val()}</Text></View>
                                    <View style={{flex: 0.3}}><Text>{item.child("destination").val()}</Text></View>
                                </View>
                        </View>
                        <View style={{alignSelf:'flex-end',width:34,paddingBottom:3,paddingRight:15}}>
                            <TouchableOpacity style={styles.ApproveButton} title="Approve" onPress= {() => this.approve(item)}>
                                <Text style={styles.ApproveButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                  </View>
                    )}
                />
            <Text style={styles.SectionHeader}>QUEUE</Text>
                  <View style={{flex: 1, flexDirection: 'row',height:40,width:'100%'}}>
                        <View style={{alignSelf:'flex-start'}}>
                                <View style={{flexDirection: 'row',width:'100%',fontSize:16,padding:8,paddingLeft:20,width: Dimensions.get('window').width-34}}>
                                <View style={{flex: 0.3}}><Text style={{fontWeight:'bold',color:'black'}}>Name</Text></View>
                                <View style={{flex: 0.4}}><Text style={{fontWeight:'bold',color:'black'}}>Pickup</Text></View>
                                <View style={{flex: 0.3}}><Text style={{fontWeight:'bold',color:'black'}}>Destination</Text></View>
                                </View>
                        </View>
                        <View style={{alignSelf:'flex-end',width:90,paddingBottom:3,paddingRight:15}}>
                        </View>
                  </View>
                <FlatList
                  data={this.state.acc}
                  renderItem={({ item }) => (
                    <View style={{flex: 1, flexDirection: 'row',height:40,width:'100%'}}>
                        <View style={{alignSelf:'flex-start',}}>
                                <View style={{flexDirection: 'row',width:'100%',fontSize:16,padding:8,paddingLeft:20,width: Dimensions.get('window').width-34}}>
                                    <View style={{flex: 0.3}}><Text>{item.child("name").val()}</Text></View>
                                    <View style={{flex: 0.4}}><Text>{item.child("pickupLocation").val()}</Text></View>
                                    <View style={{flex: 0.3}}><Text>{item.child("destination").val()}</Text></View>
                                </View>
                        </View>
                        <View style={{alignSelf:'flex-end',width:34,paddingBottom:3,paddingRight:15}}>
                            <TouchableOpacity style={styles.ApproveButton} title="Approve" onPress= {() => {item.ref.remove()}}>
                                <Text style={styles.ApproveButtonText}>-</Text>
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