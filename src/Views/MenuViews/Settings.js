import React, { Component } from 'react'
import { Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import storage from '../../Components/storage'
import colors from '../../Components/colors'

export default class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  removeUserData = () => {
    storage.remove({ key: 'userData' })
    this.props.navigation.replace('Login')
  }

  render() {
    return (
      <ScrollView
        style={{backgroundColor: colors.secondaryBg}}>
        <TouchableOpacity
          style={style.logout_btn}
          onPress={this.removeUserData}>
          <Text>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const style = StyleSheet.create({
  container: {
  },
})
