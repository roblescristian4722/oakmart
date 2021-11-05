import React, { Component } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Input from '../Components/Input';

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/login.php',
      res: null,
      input_style: style.input,
      email_regex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      password_regex: RegExp(".{8,25}"),
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
        // Si el usuario se loggea exitosamente entonces retornamos sus datos
        if (parseInt(res) !== 0) {
          this.setState({input_style: style.input})
          this.props.callback(res)
        } else {
          this.setState({input_style: style.input_error})
        }
      });
  }

  render() {
    console.log(this.state.email)
    return (
      <ScrollView>
        <Text>OakMart</Text>
        <Input
          placeholder='Email'
          keyboardType='email-address'
          validate={this.state.email_regex}
          error_msg='Email no válido'
          onChangeText={e => this.setState({email: e})}/>
        <Input
          style={style.input}
          placeholder = 'Contraseña'
          validate={this.state.password_regex}
          error_msg='Contraseña no válida, debe de contener de entre 8 a 25 caracteres'
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
  input_error: {
    borderColor: 'red',
  },
  btn: {
    borderWidth: 1,
  },
  btn_text: {
    textAlign: 'center',
  },
})
