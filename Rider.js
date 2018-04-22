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
  ListView,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  TextInput,
  ScrollView,
  FlatList,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import ReactNative from 'react-native';
import * as firebase from 'firebase';
import StatusBar from './StatusBar'
import MapViewDirections from 'react-native-maps-directions';
const styles = require('./styles.js');
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps'

const firebaseDbh = require ( './firebaseconfig');


type Props = {};
export default class Rider extends Component<Props> {

  static navigationOptions = {
    header: null,
    headerLeft: null
    };

    constructor(props) {
        super(props);
        this.state = {
          
          toColby: false,
          driverLatitude: 0,
          driverLongitude: 0,
          latitude: 0,
          longitude: 0,
          error: null,
          modalVisible: false,
          name: "random thing",
          destination: null,
          pickupLocation: null,
          key: null,
          requested: false,
          temp: false,
          arr: []
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
            this.itemsRef.child("riders").once('value', (snap)=>{
              snap.forEach((rider)=>{
                if (rider.child("name").val()===this.state.name){
                  rider.ref.update({longitude: this.state.longitude});
                  rider.ref.update({latitude: this.state.latitude});
                }
              });
            });
          },
          (error) => this.setState({error: error.message}),
          {enableHighAccuracy: false, timeout: 2000, maximumAge: 20}
        );
        this.listenForItems(this.itemsRef);
      }
      
      
      listenForItems(itemsRef) {
        itemsRef.on('value', (snap) => {
    
          // get children as an array
          var items = [];
          snap.child("acceptedQueue").forEach((child) => {
          items.push(child);
          });
          this.setState({arr: items});
          var dir = snap.child("toColby");
          this.setState({toColby: dir.val()});
          var driver = snap.child("driverLocation");
          var longitude = driver.child("longitude");
          var latitude = driver.child("latitude");
          this.setState({driverLatitude: latitude.val()});
          this.setState({driverLongitude: longitude.val()});
          this.itemsRef.child("riders").once('value', (snp)=>{
            snp.forEach((children)=>{
              if (children.child("name").val()===this.state.name){
                if (!this.state.requested)
                this.setState({requested: true});
              }
            });
          });
          this.itemsRef.child("acceptedQueue").once('value', (snp)=>{
            snp.forEach((children)=>{
              if (children.child("name").val()===this.state.name){
                if (!this.state.requested)
                this.setState({requested: true});
              }
            });
          });
        });
      }

      getLocation(){}

      sendRequest(){
        var riders = firebase.database().ref("riders");
        this.setState({
          key: riders.push({
            name: this.state.name,
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            pickupLocation: this.state.pickupLocation,
            destination: this.state.destination,
          })
        });
        this.setModalVisible(false);
      }
      setModalVisible(visible) {
        this.setState({modalVisible: visible});
      }
      cancelRequest(){
        this.itemsRef.child("riders").once('value', (snp)=>{
          snp.forEach((children)=>{
            var a = false;
            if (children.child("name").val()===this.state.name){
              children.ref.remove();
            }
          });
        });
        this.setState({requested: false});
      }
      getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

      routeMarkers(){
        this.state.arr.forEach((mark)=>{
          return(
            <Marker coordinate= {{latitude: mark.child("latitude").val(), longitude: mark.child("longitude").val()}} pinColor= '#A52A2A'/>
          );
        });
      }
      getWaypoints(){
        var waypoints = [];
        this.state.arr.forEach((way)=>{
          waypoints.push({longitude: way.child("longitude").val(), latitude: way.child("latitude").val()})
        });
      }

  render() {
    
    const lat = this.state.driverLatitude;
    const long = this.state.driverLongitude;
    const GOOGLE_MAPS_APIKEY = 'AIzaSyAgDkRyYx3uERuAKbeeB6iINW3nuMDBjEA';
    const text = this.state.toColby ? (<Text>The jitney is going towards colby</Text>): 
    (<Text>The jitney is going away from colby</Text>);
    const requestButton = this.state.requested ? (<TouchableOpacity onPress= {()=>this.cancelRequest()}><Text>Cancel Request</Text></TouchableOpacity>):
    (<TouchableOpacity onPress= {()=> this.setModalVisible(true)}><Text>Request ride</Text></TouchableOpacity>);
          return (
         <View style={styles.container}>
            
         <View >
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{width:500,height:500,position:'relative',top: 0, left: 0}}
          region={{
            latitude: lat,
            longitude: long,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
          
          <Marker coordinate= {{latitude: this.state.driverLatitude, longitude: this.state.driverLongitude}} pinColor= '#00FFFF'/>
          
           {this.state.arr.map((item,index) => 
            <Circle center={{latitude: item.child("latitude").val(), longitude: item.child("longitude").val()}} radius= {30} fillColor= {this.getRandomColor()}/>
           )}
          </MapView>
        </View>
        <View>
         <View>
         
            {text}
            <Text>{String(this.state.driverLatitude)}</Text>
            <Text>{String(this.state.driverLongitude)}</Text>
            
            <Text>{String(this.state.latitude)}</Text>
            <Text>{String(this.state.longitude)}</Text>
            </View>
            <View>
            <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={{marginTop: 22}}>
            <View>
              <Text>Enter your name</Text>
            <TextInput
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(text) => this.setState({name: text})}
        value={this.state.text}
        />
        <Text>Where do you want to be picked up?</Text>
            <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.setState({pickupLocation: text})}
          value={this.state.text}
        />
        <Text>Where do you want to go?</Text>
            <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.setState({destination: text})}
          value={this.state.text}
        />
            <TouchableOpacity onPress= {()=> this.sendRequest()}><Text>Request</Text></TouchableOpacity>

              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        </View>
        <View>
        {requestButton}
        </View>
        <View>
        <Text>Route: </Text>
        <ScrollView>
              <FlatList
                data = {this.state.arr}
                renderItem={({ item }) => (
                  <View>
                      <View>
                          <Text>
                              {item.child("destination").val()}
                          </Text>
                      </View>
                      <View>
                      </View>
                </View>
                  )}
              />
        </ScrollView>
        </View>
        </View>
        
            </View>
     );
     
          
    }

}


