import React, { Component } from 'react'
import { Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../../Components/colors'

export default class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null
    }
    this.getUserData()
  }

  removeUserData = async () => {
    try {
      await AsyncStorage.removeItem('@user_data')
      this.props.navigation.replace('Login')
    } catch (e) {
      console.log(`Error al eliminar datos de usuario almacenados (${e})`)
    }
  }

  getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_data')
      this.setState({ user: JSON.parse(jsonValue) })
    } catch (e) {
      console.log(`Error al obtener datos del usuario (${e})`)
    }
  }

  render() {
    console.log(this.state.user)
    if (this.state.user !== null)
      return (
        <ScrollView
          style={{backgroundColor: colors.secondaryBg}}>

          {
            this.state.user.image
            ? <Image source={{uri: this.state.user.image}} style={style.img}/>
            : <Image source={require('../../../imgs/user.png')} style={style.img}/>
          }

          <Text
            style={style.username}>
            Usuario: {this.state.user.username}
          </Text>

          <TouchableOpacity
            style={style.logout_btn}
            onPress={this.removeUserData}>
            <Text style={style.logout_text}>Cerrar Sesión</Text>
          </TouchableOpacity>

        </ScrollView>
      )
    return null
  }
}

const style = StyleSheet.create({
  empty_img: {
    fontSize: 100,
    color: colors.placeholder,
  },
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
    marginTop: '10%',
  },
  logout_text: {
    textAlign: 'center',
    color: colors.text,
  },
  username: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  img: {
    marginTop: '5%',
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
})
