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
  Image
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
              else{
                if (this.state.requested)
                this.setState({requested: false});
              }
            });
          });
          this.itemsRef.child("acceptedQueue").once('value', (snp)=>{
            snp.forEach((children)=>{
              if (children.child("name").val()===this.state.name){
                if (!this.state.requested)
                this.setState({requested: true});
              }
              else{
                if (this.state.requested)
                this.setState({requested: false});
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
        this.itemsRef.child("acceptedQueue").once('value', (snp)=>{
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
            <Marker coordinate= {{latitude: mark.child("latitude").val(), longitude: mark.child("longitude").val()}} image='./marker.png'/>
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
    const requestButton = this.state.requested ? (<TouchableOpacity  style={styles.requestJitney} onPress= {()=> this.cancelRequest()}>
    <Text style={styles.requestJitneyText}>CANCEL</Text>
</TouchableOpacity >):
    (<TouchableOpacity  style={styles.requestJitney} onPress= {()=> this.setModalVisible(true)}>
    <Text style={styles.requestJitneyText}>REQUEST</Text>
</TouchableOpacity >);
          return (
        //  <View style={styles.container}>
            
        //  <View >
        // <MapView
        //   provider={PROVIDER_GOOGLE}
        //   style={{width:500,height:500,position:'relative',top: 0, left: 0}}
        //   region={{
        //     latitude: lat,
        //     longitude: long,
        //     latitudeDelta: 0.015,
        //     longitudeDelta: 0.0121,
        //   }}>
          
        //   <Marker coordinate= {{latitude: this.state.driverLatitude, longitude: this.state.driverLongitude}} pinColor= '#00FFFF'/>
          
        //    {this.state.arr.map((item,index) => 
        //     <Circle center={{latitude: item.child("latitude").val(), longitude: item.child("longitude").val()}} radius= {30} fillColor= {this.getRandomColor()}/>
        //    )}
        //   </MapView>
        // </View>
        // <View>
        //  <View>
         
        //     {text}
        //     <Text>{String(this.state.driverLatitude)}</Text>
        //     <Text>{String(this.state.driverLongitude)}</Text>
            
        //     <Text>{String(this.state.latitude)}</Text>
        //     <Text>{String(this.state.longitude)}</Text>
        //     </View>
        //     <View>
        //     <Modal
        //   animationType="slide"
        //   transparent={false}
        //   visible={this.state.modalVisible}
        //   onRequestClose={() => {
        //     alert('Modal has been closed.');
        //   }}>
        //   <View style={{marginTop: 22}}>
        //     <View>
        //       <Text>Enter your name</Text>
        //     <TextInput
        // style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        // onChangeText={(text) => this.setState({name: text})}
        // value={this.state.text}
        // />
        // <Text>Where do you want to be picked up?</Text>
        //     <TextInput
        //   style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        //   onChangeText={(text) => this.setState({pickupLocation: text})}
        //   value={this.state.text}
        // />
        // <Text>Where do you want to go?</Text>
        //     <TextInput
        //   style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        //   onChangeText={(text) => this.setState({destination: text})}
        //   value={this.state.text}
        // />
        //     <TouchableOpacity onPress= {()=> this.sendRequest()}><Text>Request</Text></TouchableOpacity>

        //       <TouchableHighlight
        //         onPress={() => {
        //           this.setModalVisible(!this.state.modalVisible);
        //         }}>
        //         <Text>Hide Modal</Text>
        //       </TouchableHighlight>
        //     </View>
        //   </View>
        // </Modal>
        // </View>
        // <View>
        // {requestButton}
        // </View>
        // <View>
        // <Text>Route: </Text>
        // <ScrollView>
        //       <FlatList
        //         data = {this.state.arr}
        //         renderItem={({ item }) => (
        //           <View>
        //               <View>
        //                   <Text>
        //                       {item.child("destination").val()}
        //                   </Text>
        //               </View>
        //               <View>
        //               </View>
        //         </View>
        //           )}
        //       />
        // </ScrollView>
        // </View>
        // </View>
        
        //     </View>
        <View style={styles.container}>
        <View style={styles.mapPlaceholder}>
         <MapView
          provider={PROVIDER_GOOGLE}
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
          style={{width:500,height:500,position:'relative',top: 0, left: 0}}
          region={{
            latitude: lat,
            longitude: long,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
          
          <Marker coordinate= {{latitude: this.state.driverLatitude, longitude: this.state.driverLongitude}} image= {require('./marker.png')} />
          
           {this.state.arr.map((item,index) => 
            <Circle center={{latitude: item.child("latitude").val(), longitude: item.child("longitude").val()}} radius= {30} fillColor= {this.getRandomColor()}/>
           )}
          </MapView>
        </View>
        <View style={styles.InfoContainer}>
        
        <View style={styles.requestcontainer}>
                {requestButton}
            </View>
            <Text style={styles.SectionHeader}>JITNEY INFORMATION</Text>
            <Text style={styles.JitneyInfoHeader}>Current Stops:</Text>
            <ScrollView>
            <FlatList
                data={this.state.arr}
                renderItem={({item}) => <Text style={styles.JitneyInfo}>{item.child("destination").val()}</Text>}
            />
            </ScrollView>
        </View>
        <Modal
          style={{alignSelf:'center'}}
          animationType="slide"
          transparent={false}
          presentationStyle = "pageSheet"
          visible={this.state.modalVisible}
          onRequestClose={() => {this.setModalVisible(false);
        }}>
            <View style={{marginTop: 22,width:'90%',padding:10,alignContent:'center',justifyContent:'center',alignSelf:'center'}}>
                <View>
                <Text style={{alignSelf:'center',color:'black',fontSize:19,paddingLeft:10,fontWeight:"900",marginTop:30,marginBottom:15}}>Enter your name</Text>
                    <TextInput
                      style={{height: 50, borderColor: 'gray', borderWidth: 0,fontSize:18,textAlign:'center'}}
                      onChangeText={(text) => this.setState({name: text})}
                      value={this.state.text}
                    />
                    <Text style={{alignSelf:'center',color:'black',fontSize:19,paddingLeft:10,fontWeight:"900",marginTop:30,marginBottom:15}}>Where do you want to be picked up?</Text>
                    <TextInput
                      style={{height: 50, borderColor: 'gray', borderWidth: 0,fontSize:18,textAlign:'center'}}
                      onChangeText={(text) => this.setState({pickupLocation: text})}
                      value={this.state.text}
                    />
                    <Text style={{alignSelf:'center',color:'black',fontSize:19,paddingLeft:10,fontWeight:"900",marginTop:30,marginBottom:15}}>Where do you want to go?</Text>
                    <TextInput
                      style={{height: 50, borderColor: 'gray', borderWidth: 0,fontSize:18,textAlign:'center'}}
                        onChangeText={(text) => this.setState({destination: text})}
                      value={this.state.text}
                    />
                    <TouchableOpacity style={{height:45,borderWidth:2,borderColor:'#2d4ea4',width:170,borderRadius: 80,alignItems:'center',justifyContent:'center',alignSelf:'center',margin:20}} onPress= {()=> this.sendRequest()}>
                        <Text style={{color:'#2d4ea4',fontSize:19,fontWeight:"900"}}>Request</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{height:45,borderWidth:2,borderColor:'#2d4ea4',width:170,borderRadius: 80,alignItems:'center',justifyContent:'center',alignSelf:'center',margin:10}} onPress={() => {this.setModalVisible(!this.state.modalVisible);}}>
                        <Text style={{color:'#2d4ea4',fontSize:19,fontWeight:"900"}}>Hide Modal</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    </View>
     );
     
          
    }

}