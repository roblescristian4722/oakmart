import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Picker } from '@react-native-picker/picker';

import colors from '../../Components/colors'

export default class OrderByPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <View style={style.picker_container}>
        <Text style={style.picker_text}>
          Ordernar por 
        </Text>
        <View style={style.picker}>
          <Picker
            selectedValue={this.props.value}
            onValueChange={ (e) => { this.props.onValueChange(e) } }
            >
            <Picker.Item label='Rating' value='rating' />
            <Picker.Item label='Menor precio' value='lower_price' />
            <Picker.Item label='Mayor precio' value='higher_price' />
            <Picker.Item label='Popularidad' value='popularity' />
          </Picker>
        </View>
      </View>
    )
  }
}

const style = StyleSheet.create({
  picker_container: {
    width: '60%',
    paddingLeft: '2%',
    marginTop: '3%',
    marginLeft: '35%',
    flexDirection: 'row',
  },
  picker_text: {
    color: colors.text,
    alignSelf: 'center',
    textAlign: 'center',
    flex: 2.5,
  },
  picker: {
    borderWidth: 1,
    borderRadius: 10,
    flex: 7,
    alignSelf: 'center',
    backgroundColor: colors.bg,
  },
})
