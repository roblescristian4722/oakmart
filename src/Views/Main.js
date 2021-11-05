import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import Login from './Login';

export default class Main extends Component {
  constructor(props) {
    super(props)

    this.state = {
      endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/index.php',
      res: null,
    }
  }

  isAuth = async () => {
    await fetch(this.state.endpoint, {
      method: 'POST',
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      })
    }).then(res => res.json())
      .then(res => {
        if (parseInt(res) === 0){
          console.log("no che pudo")
        }
        this.setState({res: res})
      });
  }

  setData = (res) => {
    this.setState({res: res})
  }

  render() {
    return (
      <ScrollView>
        {/*TODO: Crear una función que retorne la página principal de la tienda
          en lugar de un null*/}
        {this.state.res ? null : <Login callback={this.setData}/>}
      </ScrollView>
    )
  }
}
