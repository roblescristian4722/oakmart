import React, { Component } from 'react';
import { ScrollView, Text } from 'react-native';
import Logout from '../Components/Logout';

export default class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  setData = (res) => {
    this.setState({res: res})
  }

  render() {
    return (
      <ScrollView>
        <Text>Home</Text>
        <Logout redirect={this.props.redirect} />
      </ScrollView>
    )
  }
}
