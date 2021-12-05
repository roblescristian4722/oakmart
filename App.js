import React, { Component } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Vistas
import Menu from './src/Views/Menu';
import Register from './src/Views/Register';
import Login from './src/Views/Login';
import Product from './src/Views/MenuViews/Product'

const Stack = createStackNavigator();

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      path: '',
      endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/index.php',
      res: null,
    }
  }

  // Función que es pasada las vistas por props y que toma una "ruta"
  // por parámetro, dicha ruta será la que se renderizará
  redirect = (path) => {
    this.setState({path: path})
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={'Login'}
          screenOptions= {{
            headerShown: false,
          }}>

          <Stack.Screen
            name='Login'
            options={{
              title: 'OakMart',
            }}
            component={Login}
          />

          <Stack.Screen
            name='Register'
            options={{
              title: 'OakMart',
            }}
            component={Register}
          />
          
          <Stack.Screen
            name='Menu'
            options={{
              title: 'OakMart',
            }}
            component={Menu}
          />
  
          <Stack.Screen
            name='Product'
            options={{
              title: 'OakMart',
            }}
            component={Product}
            />

        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}
