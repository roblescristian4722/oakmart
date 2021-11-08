import React, { Component } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
// Componentes
import Input from '../Components/Input';
import colors from '../Components/colors';

export default class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      password_val: false,
      password_conf: '',
      password_regex: RegExp('.{8,25}'),
      email: '',
      email_val: false,
      email_regex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      phone: '',
      phone_val: false, 
      phone_regex: RegExp('(\\+(\\d){1,3})?\\d{10}'),
      username_failed: null,
      register_failed: null,
      password_failed: null,
      endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/register.php',
    }
  }
 
  register = async () => {
    if (this.state.password !== this.state.password_conf) {
      this.setState({ password_failed: 'Las contraseñas no coinciden' })
    } else if (this.state.password_val === true && this.state.email_val === true
      && (this.state.phone === '' || (this.state.phone !== '' && this.state.phone_val === true))) {
      await fetch(this.state.endpoint, {
        method: 'POST',
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
          username: this.state.username,
          phone: this.state.phone === '' ? null : this.state.phone,
        })
      }).then(res => res.json())
        .then(res => {
          if (parseInt(res) === 1) {
            alert('Registro realizado de manera exitosa, vuelva al menú e inicie sesión')
            this.props.navigation.replace('Login')
          } else if (parseInt(res) === 0)
            this.setState({ register_failed: 'El email ya se encuentra en uso' })
        })
        .catch(_ => alert('Error con el servidor, vuelva a intentarlo más tarde'))
    } else {
      this.setState({
        username_failed: this.state.username === '' ? 'Dato requerido' : null,
        register_failed: this.state.email === '' ? 'Dato requerido' : null,
        password_failed: this.state.password === '' ? 'Dato requerido' : null,
      })
    }
}

  password_val = (e) => { this.setState({ password_val: e }) }
  email_val = (e) => { this.setState({ email_val: e }) }
  phone_val = (e) => { this.setState({ phone_val: e }) }

  render() {
    return (
      <ScrollView style={style.container}>
        <Text style={style.title}>Registro de usuario</Text>
        <Input
          style={style.input}
          placeholder='Nombre de usuario'
          throwable={this.state.username_failed}
          onChangeText={e => this.setState({ username: e, username_failed: null })}/>

        <Input
          style={style.input}
          placeholder='Email'
          keyboardType='email-address'
          validate={this.state.email_regex}
          is_validated={this.email_val}
          throwable={this.state.register_failed}
          error_msg='Email no válido'
          onChangeText={e => this.setState({ email: e, register_failed: null })}/>

        <Input
          style={style.input}
          placeholder='Contraseña'
          validate={this.state.password_regex}
          is_validated={this.password_val}
          secureTextEntry={true}
          throwable={this.state.password_failed}
          error_msg='Contraseña no válida'
          onChangeText={e => this.setState({ password: e, password_failed: null })}/>

        <Input
          style={style.input}
          placeholder='Confirmar contraseña'
          validate={this.state.password_regex}
          secureTextEntry={true}
          error_msg='Confirmación de contraseña no válida'
          onChangeText={
            e => this.setState({ password_conf: e, password_failed: null })}/>

        <Input
          style={style.input}
          placeholder='Número de teléfono (opcional)'
          keyboardType='phone-pad'
          validate={this.state.phone_regex}
          is_validated={this.phone_val}
          error_msg='Número de teléfono no válido'
          onChangeText={e => this.setState({ phone: e })}/>

        <TouchableOpacity
          style={style.btn}
          onPress={this.register}>
          <Text
            style={style.btn_text}>Registrarse</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const style = StyleSheet.create({
  container: {
    backgroundColor: colors.secondaryBg,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginTop: '5%',
    marginBottom: '5%',
    color: colors.text,
  },
  input: {
  },
  btn: {
    backgroundColor: colors.btnBg,
    width: '25%',
    alignSelf: 'center',
    borderRadius: 10,
    borderWidth: 1,
    padding: '1%',
    marginTop: '5%',
  },
  btn_text: {
    color: colors.text,
    textAlign: 'center',
  },
})
