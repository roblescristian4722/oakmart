import React, { Component } from 'react'
import { ScrollView, Text, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native'
import {Picker} from '@react-native-picker/picker';

import ImgPicker from '../../Components/ImgPicker'
import Input from '../../Components/Input'
import colors from '../../Components/colors'

export default class Sell extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name_empty: null,
      name: '',
      stock: '',
      stock_valid: false,
      stock_empty: null,
      stock_reg: RegExp('^[0-9]+$'),
      category: 'Familia y el hogar',
      description: '',
      description_empty: null,
      price: '',
      price_reg: RegExp('^[0-9]+(\\.[0-9]+)?$'),
      price_valid: false,
      price_empty: null,
      location: '',
      location_empty: null,
      image: '',
      endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/publish.php',
    }
  }

  throw_empty = () => {
    if (this.state.name === '')
      this.setState({ name_empty: 'Campo requerido' })
    if (this.state.description === '')
      this.setState({ description_empty: 'Campo requerido' })
    if (this.state.location === '')
      this.setState({ location_empty: 'Campo requerido' })
    if (this.state.stock_valid === false)
      this.setState({ stock_empty: 'Campo requerido' })
    if (this.state.price_valid === false)
      this.setState({ price_empty: 'Campo requerido' })
  }

  publish = async () => {
    if (this.state.price_valid === true && this.state.stock_valid === true &&
    this.state.name !== '' && this.state.description !== '' &&
    this.state.location !== '') {
      await fetch(this.state.endpoint, {
        method: 'POST',
        body: JSON.stringify({
          name: this.state.name,
          stock: this.state.stock,
          category: this.state.category,
          description: this.state.description,
          price: this.state.price,
          location: this.state.location,
          user_id: this.props.data.id
        })
      })
      .then(res => res.json())
      .then(res => {
        if (parseInt(res) === 1)
          alert("¡Artículo publicado de manera exitosa!")
        else
          this.throw_empty()
      })
      .catch(err => console.log("Error: ", err))
    } else
      this.throw_empty()
  }

  render() {
    return (
      <ScrollView
        style={{backgroundColor: colors.secondaryBg}}>

        <Text style={style.title}>¡Publica tu producto ahora!</Text>
        <Input
          placeholder='Nombre del producto'
          throwable={this.state.name_empty}
          onChangeText={ e => this.setState({ name: e, name_empty: null }) }
        />

        <Input
          placeholder='Estado, País'
          throwable={this.state.location_empty}
          onChangeText={ e => this.setState({ location: e, location_empty: null }) }
        />

        <Input
          placeholder='Cantidad en stock'
          keyboardType='number-pad'
          error_msg='Cantidad no válida'
          is_validated={e => this.setState({stock_valid: e})}
          validate={this.state.stock_reg}
          throwable={this.state.stock_empty}
          onChangeText={ e => this.setState({ stock: e, stock_empty: null }) }
        />

        <View style={style.picker_container}>
          <Text style={style.picker_text}>Categoría</Text>
          <Picker
            style={style.picker}
            onValueChange={ e => this.setState({ category: e }) }
          >
            <Picker.Item label='Familia y hogar' value='Familia y hogar' />
            <Picker.Item label='Comida' value='Comida' />
            <Picker.Item label='Videojuegos' value='Videojuegos' />
            <Picker.Item label='Electrónica y computación'
              value='Electrónica y computación' />
            <Picker.Item label='Libros' value='Libros' />
            <Picker.Item label='Películas' value='Películas' />
          </Picker>
      </View>

      <Input
        placeholder='Precio'
        keyboardType='number-pad'
        error_msg='Cantidad no válida'
        validate={this.state.price_reg}
        is_validated={e => this.setState({price_valid: e})}
        throwable={this.state.price_empty}
        onChangeText={ e => this.setState({ price: e, price_empty: null }) }
      />

      <Input
        style={style.input}
        placeholder='Descripción del producto'
        multiline={true}
        throwable={this.state.description_empty}
        onChangeText={e => this.setState({description: e, description_empty: null})}
      />

      <TouchableOpacity
        style={style.btn}
        onPress={this.publish}>
        <Text style={style.btn_text}>Publicar producto</Text>
      </TouchableOpacity>

      </ScrollView>
    )
  }
}

const style = StyleSheet.create({
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginTop: '5%',
    marginBottom: '5%',
    color: colors.text,
  },
  picker: {
    backgroundColor: colors.text,
    borderWidth: 1,
    marginTop: '2%',
    alignSelf: 'center',
    paddingLeft: '2%',
    flex: 3,
  },
  picker_container: {
    alignSelf: 'center',
    width: '80%',
    flexDirection: 'row',
  },
  picker_text: {
    textAlignVertical: 'center',
    marginLeft: '2%',
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  input: {
    backgroundColor: colors.text,
    borderWidth: 1,
    marginTop: '2%',
    width: '80%',
    alignSelf: 'center',
    borderRadius: 10,
    paddingLeft: '2%',
  },
  btn: {
    alignSelf: 'center',
    borderWidth: 1,
    width: '25%',
    backgroundColor: colors.btnBg,
    padding: 2,
    borderRadius: 10,
    marginTop: '5%',
  },
  btn_text: {
    color: colors.text,
    textAlign: 'center',
  }
})
