import React, { Component } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import Input from '../Components/Input';
import storage from '../Components/storage';

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
      login_failed: null,
    }
  }

  componentDidMount() {
    storage.load({ key: 'userData' })
      .then(ret => {
        console.log(ret)
        this.props.navigation.replace('Home', { data: ret })
      })
      .catch(_ => {})
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
          // Almacena los datos del usuario en el almacenamiento del dispositivo
          storage.save({
            key: 'userData',
            data: res
          })
          console.log(res)
          this.props.navigation.replace('Home', { data: res })
        } else
          this.setState({login_failed: 'Email y/o contraseña incorrectos'})
      });
  }

  render() {
    return (
      <ScrollView>
        <Text>OakMart</Text>
        <Input
          placeholder='Email'
          keyboardType='email-address'
          validate={this.state.email_regex}
          error_msg='Email no válido'
          throwable={this.state.login_failed}
          validated={this.enableBtn}
          onChangeText={e => this.setState({email: e, login_failed: null})}/>

        <Input
          style={style.input}
          placeholder = 'Contraseña'
          validate={this.state.password_regex}
          error_msg='Contraseña no válida, debe de contener de entre 8 a 25 caracteres'
          secureTextEntry = {true}
          throwable={this.state.login_failed}
          onChangeText={e => this.setState({password: e, login_failed: null})}/>

        <TouchableOpacity
          style={style.btn}
          onPress={this.login}>
          <Text style={style.btn_text}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <View style={style.create_account_container}>
          <Text>¿No tienes una cuenta? </Text>
          <TouchableOpacity
            style={style.create_account_btn}
            onPress={() => this.props.navigation.navigate('Register')}>
            <Text style={style.create_account_btn_text}>¡Crea una cuenta ahora!</Text>
          </TouchableOpacity>
        </View>
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
  create_account_container: {
    flexDirection: 'row',
  },
  create_account_btn_text: {
    flex: 1,
    color: 'blue',
  },
  create_account_btn: {
    flex: 1,
  }
})
