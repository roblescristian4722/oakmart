import React, { Component } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Views
import Home from '../Views/MenuViews/Home';
import Settings from '../Views/MenuViews/Settings';
import Cart from '../Views/MenuViews/Cart';
import Sell from '../Views/MenuViews/Sell';

// Custom components
import storage from '../Components/storage';
import colors from '../Components/colors';

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
        <Tab.Screen name='Inicio' component={Home} />
        <Tab.Screen name='Vender' component={Sell} />
        <Tab.Screen name='Carrito de compras' component={Cart} />
        <Tab.Screen name='Configuraciones' component={Settings} />
      </Tab.Navigator>
    )
  }
}

const style = StyleSheet.create({
  container: {
    backgroundColor: colors.secondaryBg,
  },
  welcome_text: {
    fontSize: 28,
    textAlign: 'center',
    alignSelf: 'center',
    color: colors.text,
    marginTop: '2%',
  },
  logout_btn: {
    alignSelf: 'center',
    borderWidth: 1,
    width: '25%',
    backgroundColor: '#C84C31',
    padding: 2,
    borderRadius: 10,
    marginTop: '5%',
  },
  logout_text: {
    textAlign: 'center',
    color: colors.text,
  },
});
