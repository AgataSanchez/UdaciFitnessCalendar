import 'react-native-gesture-handler'
import React from 'react';
import { View, Platform, StatusBar } from 'react-native';
import AddEntry from './components/AddEntry.js'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import reducer from './reducers'
import History from './components/History.js'
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {purple, white} from './utils/colors.js'
import {FontAwesome, Ionicons} from '@expo/vector-icons'
import Constants from 'expo-constants'
import { createStackNavigator } from '@react-navigation/stack'
import Live from './components/Live.js'
import EntryDetails from './components/EntryDetails.js'
import { setLocalNotification } from './utils/helpers'


function UdaciStatusBar ({backgroundColor, ...props}) {
  return (
    <View style={{ backgroundColor, height: Constants.StatusBarHeight }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  )
}
const RouteConfigs = {
  History:{
    name: "History",
    component: History,
    options: {tabBarIcon: ({tintColor}) => <Ionicons name='ios-bookmarks' size={30} color={tintColor} />, title: 'History'}
  }, 
  AddEntry:{
    name: "Add Entry",
    component: AddEntry,
    options: {tabBarIcon: ({tintColor}) => <FontAwesome name='plus-square' size={30} color={tintColor} />, title: 'Add Entry'}
  },
  Live:{ 
    name: "Live",
    component: Live,
    options: {tabBarIcon: ({tintColor}) => <Ionicons name='ios-speedometer' size={30} color={tintColor} />, title: 'Live'}
  }
}

const TabNavigatorConfig = {
  navigationOptions: {
    header: null
  },
  tabBarOptions: {
    activeTintColor: Platform.OS === "ios" ? purple : white,
    style: {
      height: 56,
      backgroundColor: Platform.OS === "ios" ? white : purple,
      shadowColor: "rgba(0, 0, 0, 0.24)",
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 6,
      shadowOpacity: 1
    }
  }
  };
  const Tabs =
    Platform.OS === "ios"
      ? createBottomTabNavigator()
      : createMaterialTopTabNavigator();

    const TabNav = () =>(
      <Tab.Navigator {...TabNavigatorConfig}>
          <Tab.Screen {...RouteConfigs['History']} />
          <Tab.Screen {...RouteConfigs['AddEntry']} />
          <Tab.Screen {...RouteConfigs['Live']} />
      </Tab.Navigator>
    )
    const StackNavigatorConfig = {
      headerMode: "screen"
    }
    const StackConfig = {
      TabNav:{
        name: "Home",
        component: History,
        options: {headerShown: false}
      }, 
      EntryDetail:{
        name: "EntryDetail",
        component: EntryDetails,
        options: {
          headerTintColor: white,
          headerStyle:{
            backgroundColor: purple
          }
        }
      }
    }
    const Stack = createStackNavigator();
    const MainNav = () =>(
      <Stack.Navigator {...StackNavigatorConfig}>
        <Stack.Screen {...StackConfig['TabNav']} />
        <Stack.Screen {...StackConfig['EntryDetail']} />
      </Stack.Navigator>
    )
    
export default class App extends React.Component {
  componentDidMount() {
    setLocalNotification()
  }
  render(){
    const store = createStore(reducer)
    return (
      <Provider store={store}>
        <View style={{flex:1}}>
        <UdaciStatusBar backgroundColor={purple} barStyle='light-content' />
          <NavigationContainer >
              <MainNav />
          </NavigationContainer>
        </View>
      </Provider>    
    );
  }
}
