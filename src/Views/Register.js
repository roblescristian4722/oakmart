import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// Componentes
import Input from '../Components/Input';

export default class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      password_regex: RegExp('.{8,25}'),
      email: '',
      email_regex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      phone: '',
      phoneRegex: RegExp('(\\+(\\d){1,3})?\\d{10}'),
      regiter_failed: false,
    }
  }
  
  render() {
    return (
      <View>
        <Input
          style={style.input}
          placeholder='Nombre de usuario'
          onChangeText={e => this.setState({username: e})}/>

        <Input
          style={style.input}
          placeholder='Contraseña'
          validate={this.state.password_regex}
          secureTextEntry={true}
          throwable={this.state.register_failed}/>
      </View>
    )
  }
}

const style = StyleSheet.create({
  input: {

  },
})
