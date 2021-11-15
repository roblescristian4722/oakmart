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
          <Text style={style.logout_text}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const style = StyleSheet.create({
  container: {
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
})
