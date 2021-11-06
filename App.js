import React, { Component } from 'react'
import { SafeAreaView } from 'react-native'
// Componentes
import storage from './src/Components/storage';
// Vistas
import Home from './src/Views/Home';
import Login from './src/Views/Login';
import Register from './src/Views/Register';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      path: '',
      endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/index.php',
      res: null,
    }
  }

  componentDidMount() {
    if (!this.state.res) {
      storage.load({ key: 'userData' })
        .then(ret => {
          this.setState({res: ret})
          this.redirect('Home')
        })
        .catch(_ => this.redirect('Login'))
    }
  }

  isAuth = async () => {
    await fetch(this.state.endpoint, {
      method: 'POST',
      body: JSON.stringify({
        email: this.state.res.email,
        password: this.state.res.password,
      })
    }).then(res => res.json())
      .then(res => {
        if (parseInt(res) !== 0){
          this.setState({res: res})
        } else {
          this.setState({res: null})
        }
      });
  }

  // Función que es pasada las vistas por props y que toma una "ruta" por parámetro,
  // dicha ruta será la que se renderizará
  redirect = (path) => {
    this.setState({path: path})
  }

  getView = () => {
    switch (this.state.path) {
      case 'Home':
        return <Home redirect={this.redirect} />
      case 'Login':
        return <Login redirect={this.redirect} />
      case 'Register':
        return <Register redirect={this.redirect} />
    }
  }

  render() {
    return (
      <SafeAreaView>
        {this.getView()}
      </SafeAreaView>
    )
  }
}
