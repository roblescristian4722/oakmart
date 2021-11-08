import React, { Component } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import storage from '../Components/storage';
import colors from '../Components/colors';

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
        <ScrollView style={style.container}>
          <Text style={style.welcome_text}>Bienvenido: {data.username}</Text>
          <TouchableOpacity
            style={style.logout_btn}
            onPress={this.removeUserData}>
            <Text style={style.logout_text}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </ScrollView>
      )
    else
      return (
        <Text>Cargando...</Text>
      );
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
