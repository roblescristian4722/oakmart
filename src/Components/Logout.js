import React, { Component } from 'react'
import { TouchableOpacity, Text, View } from 'react-native';
import storage from '../Components/storage';

export default class Logout extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  removeUserData = () => {
    storage.remove({ key: 'userData' })
    this.props.navigation.navigate('Login')
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={this.removeUserData}>
          <Text>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
