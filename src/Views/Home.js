import React, { Component } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import storage from '../Components/storage';

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
    if (data)
      return (
        <ScrollView>
          <Text>Bienvenido: {data.username}</Text>
          <TouchableOpacity
            onPress={this.removeUserData}>
            <Text>Cerrar Sesión</Text>
          </TouchableOpacity>
        </ScrollView>
      )
    else
      return (
        <Text>Cargando...</Text>
      );
  }
}
