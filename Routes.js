import React from 'react';
import { StackNavigator} from 'react-navigation';
import StartScreen from './StartScreen';
import Driver from './Driver.js';
import Rider from './Rider.js';


  export const Navigator = StackNavigator({
    StartScreen: {
      screen: StartScreen
    },
    Driver: {
      screen: Driver
    },
    Rider: {
        screen: Rider
      },
  },{headerMode: 'screen'},
);