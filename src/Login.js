import React, { Component } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/login.php',
      res: null,
    }
  }

  login = async () => {
    await fetch(this.state.endpoint, {
      method: 'POST',
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      })
    }).then(res => res.json())
      .then(res => {
        this.setState({res: res})
      });
  }

  render() {
    console.log(this.state.res);
    return (
      <ScrollView>
        <Text>OakMart</Text>
        <TextInput
          style={style.input}
          placeholder = 'Email'
          keyboardType = 'email-address'
          onChangeText={e => this.setState({email: e})}/>
        <TextInput
          style={style.input}
          placeholder = 'Contraseña'
          secureTextEntry = {true}
          onChangeText={e => this.setState({password: e})}/>
        <TouchableOpacity
          style={style.btn}
          onPress={this.login}>
          <Text style={style.btn_text}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const style = StyleSheet.create({
  input: {
    borderWidth: 1,
  },
  btn: {
    borderWidth: 1,
  },
  btn_text: {
    textAlign: 'center',
  },
})
