const React = require('react-native')
const {StyleSheet} = React
const constants = {
  actionColor: '#24CE84'
};

var styles = StyleSheet.create({
  ApproveButton:{
    height:34,
    borderWidth:2,
    borderColor:'#2d4ea4',
    width:34,
    borderRadius: 70,
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'flex-end',
  },
  AddColbyButton:{
    width:350,
    alignItems: 'center',
    height:70,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:15,
    alignSelf:'center',
    backgroundColor:'#002878',
    borderRadius: 50,
    color:'#fff',
  },
  AddColbyText:{
    color:'#2d4ea4',
    fontSize:20,
    fontWeight:"600",
  },
  ApproveButtonText:{
    color:'#2d4ea4',
    fontSize:16,
    fontWeight:"900",
  },
  JitneyInfoHeader:{
    color:'black',
    paddingLeft:20,
    fontSize:16,
    fontWeight:"600",
  },
  SectionHeader:{
    color:'#2d4ea4',
    fontSize:19,
    paddingLeft:10,
    fontWeight:"900",
    paddingLeft:20,
    paddingTop:10,
    paddingBottom:5,
  },
  JitneyInfoTitle:{
    color:'black',
    fontSize:19,
    paddingLeft:10,
    fontWeight:"900",
    paddingLeft:10,
    paddingTop:30,
    paddingBottom:20,
  },
  JitneyInfo:{
    width:'100%',
    fontSize:16,
    paddingLeft:20,
    paddingBottom:10,
    paddingTop:2,
  },
  requestcontainer:{
    width:'100%',
    alignItems: 'center',
    height:90,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop:20,
  },
  requestJitney:{
    width:260,
    alignItems: 'center',
    height:70,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'center',
    backgroundColor:'#002878',
    borderRadius: 50,
    color:'#fff',
  },
  InfoContainer:{
    width:'100%',
    height:'50%',
    color:'#fff',
  },
  mapPlaceholder:{
    width:'100%',
    alignItems: 'center',
    height:'50%',
    justifyContent: 'center',
    alignItems: 'center',
    color:'#fff',
  },
  RiderButton:{
    width:300,
    borderColor:'#002878',
    height:70,
    fontSize:40,fontWeight:'900',
    alignItems: 'center',
    borderRadius:60,
    borderWidth:5,
    margin:20,
    color:'#fff',
    justifyContent: 'center',
  },
  DriverButton:{
    width:302.2,
    height:72.5,
    fontSize:40,fontWeight:'900',
    alignItems: 'center',
    borderRadius:60,
    borderWidth:0,
    margin:20,
    backgroundColor:'#002878',
    color:'#fff',
    justifyContent: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems:'center',
    position:'absolute',
    height:'100%',
    width:'100%',
    backgroundColor: '#ECF0F1',
    flex: 1,
  },
  listview: {
    flex: 1,
  },
  li: {
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  liContainer: {
    flex: 2,
  },
  liText: {
    color: '#333',
    fontSize: 16,
  },
  navbar: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderColor: 'transparent',
    borderWidth: 1,
    justifyContent: 'center',
    height: 44,
    flexDirection: 'row'
  },
  requestJitneyText:{
      color: '#fff',fontSize:25,fontWeight:'900',alignSelf:'center',alignItems:'center',justifyContent:'center',textAlign:'center'}
  ,
  navbarTitle: {
    color: '#444',
    fontSize: 14,
    fontWeight: "500"
  },
  statusbar: {
    backgroundColor: '#fff',
    height: 22,
  },
  center: {
    textAlign: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  action: {
    backgroundColor: constants.actionColor,
    borderColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
})

module.exports = styles
module.exports.constants = constants;