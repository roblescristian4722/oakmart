import React, { Component } from 'react'
import { SafeAreaView } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
// Componentes
import storage from './src/Components/storage';
// Vistas
import Home from './src/Views/Home';
import Login from './src/Views/Login';
import Register from './src/Views/Register';
import Logout from './src/Components/Logout';

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

  componentDidMount() {
    this.readUserData()
  }

  readUserData = () => {
    if (!this.state.res) {
      storage.load({ key: 'userData' })
        .then(ret => {
          this.setState({ res: ret })
        })
        .catch(_ => {
          this.setState({ res: null })
        })
    }
  }

  // Función que es pasada las vistas por props y que toma una "ruta" por parámetro,
  // dicha ruta será la que se renderizará
  redirect = (path) => {
    this.setState({path: path})
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={'Login'}
          screenOptions= {{
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
            name='Logout'
            options={{
              title: 'OakMart',
            }}
            component={Logout}
          />

          <Stack.Screen
            name='Home'
            options={{
              title: 'OakMart',
            }}
            component={Home}
          />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}
