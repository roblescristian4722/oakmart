import React, { Component } from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Views
import Home from '../Views/MenuViews/Home';
import Settings from '../Views/MenuViews/Settings';
import CartMenu from '../Views/MenuViews/CartMenu';
import Sell from '../Views/MenuViews/Sell';

// Custom components
import storage from '../Components/storage';

const Tab = createBottomTabNavigator();

export default class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  
  removeUserData = () => {
    storage.remove({ key: 'userData' })
    this.props.navigation.replace('Login')
  }

  setData = (res) => {
    this.setState({res: res})
  }

  render() {
    const data = this.props.route.params.data
    if (!data)
      return (
        <Text>Cargando...</Text>
      );
    return (
      <Tab.Navigator
        screenOptions={ ({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            switch (route.name) {
              case 'Inicio':
                iconName = focused ? 'home' : 'home-outline';
                break
              case 'Carrito de compras':
                iconName = focused ? 'cart' : 'cart-outline';
                break
              case 'Configuraciones':
                iconName = focused ? 'cog' : 'cog-outline';
                break
              case 'Vender':
                iconName = focused ? 'pricetag' : 'pricetag-outline';
                break
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        })}
      >
        <Tab.Screen name='Inicio' children={() => <Home navigation={this.props.navigation}/> }/>
        <Tab.Screen name='Vender' children={() => <Sell data={data}
                                                    navigation={this.props.navigation}/>} />
        <Tab.Screen name='Carrito de compras' component={CartMenu} />
        <Tab.Screen name='Configuraciones' children={() => <Settings
                                                              data={data}
                                                              navigation={this.props.navigation}/>} />
      </Tab.Navigator>
    )
  }
}
