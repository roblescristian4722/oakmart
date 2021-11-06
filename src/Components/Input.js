import React, { Component } from 'react'
import { TextInput, View, Text, StyleSheet } from 'react-native';

export default class Input extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      validated: false,
    }
  }

  validate = (e) => {
    let validate = this.props.validate
    if (validate && e !== '') {
      if (validate.test(e.toLowerCase()) === false)
        this.setState({ validated: false })
      else
        this.setState({ validated: true })
    } else
      this.setState({ validated: true })
  }

  changeText = (e) => {
    this.props.onChangeText(e)
    this.setState({text: e}, this.validate(e))
  }

  render() {
    return (
      <View style={[style, this.props.style]}>
        <TextInput
          placeholder={this.props.placeholder}
          keyboardType={this.props.keyboardType}
          secureTextEntry={this.props.secureTextEntry}
          onChangeText={this.changeText}
        />
        {/*Mensaje throwable que tiene prioridad por sobre el mensaje de error*/}
        {this.props.throwable ?
          <Text style={style.error_msg}>{this.props.throwable}</Text> : null}
        {/*Mensaje de error que se muestra cuando la función validate no se cumple*/}
        {(this.state.validated === false && this.state.text !== '') ?
          <Text style={style.error_msg}>{this.props.error_msg}</Text> : null}
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {

  },
  error_msg : {
    color: 'red',
  },
})
