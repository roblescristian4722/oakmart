import React, { Component } from 'react'
import { ScrollView } from 'react-native'
import storage from '../../Components/storage'
import colors from '../../Components/colors'

export default class Sell extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <ScrollView
        style={{backgroundColor: colors.secondaryBg}}>
      </ScrollView>
    )
  }
}
