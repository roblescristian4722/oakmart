import React, { Component } from 'react'
import { View } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();

import Cart from './Cart'
import Purchases from './Purchases'

export default class CartMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      <Tab.Navigator
        screenOptions={ ({route}) => ({
          headerShown: false,
        })}>

        <Tab.Screen name='Carrito' children={() => <Cart navigation={this.props.navigation}/>}/>
        <Tab.Screen name='Historial de Compras' children={() => <Purchases navigation={this.props.navigation}/>}/>
      </Tab.Navigator>
    )
  }
}
