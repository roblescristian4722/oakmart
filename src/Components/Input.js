import React, { Component } from 'react'
import { TextInput, View, Text, StyleSheet } from 'react-native';

export default class Input extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: ''
    }
  }

  validate = () => {
    let validate = this.props.validate
    if (this.props.throwable) {
      return <Text style={style.error_msg}>{this.props.throwable}</Text>
    } else if (validate && this.state.text !== '') {
      if (validate.test(this.state.text.toLowerCase()) === false)
        return <Text style={style.error_msg}>{this.props.error_msg}</Text>
    }
    return null
  }

  changeText = (e) => {
    this.props.onChangeText(e)
    this.setState({text: e})
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
        {this.validate()}
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
