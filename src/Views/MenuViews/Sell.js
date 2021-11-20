import React, { Component } from 'react'
import { ScrollView, Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import {Picker} from '@react-native-picker/picker';
import Carousel from 'react-native-snap-carousel';
import { Dimensions } from 'react-native'
const SCREEN_WIDTH = Dimensions.get("window").width;

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
      images: [ null, null, null, null, null ]
    }
  }

  uploadImageToSever = async (uri, product_id, index) => {
    const image = await fetch(uri).catch((err) => console.log(err))
    const blob = await image.blob()
    var reader = new FileReader()
    reader.onload = () => {
      var insert_API = 'https://cristianrobles4722.000webhostapp.com/oakmart/upload_photo.php'
      var data = { img: reader.result }
      var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application.json'
      }
      fetch(insert_API, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
      })
      .then(res => res.text())
      .then(res => {
        fetch('https://cristianrobles4722.000webhostapp.com/oakmart/upload_product_photo.php', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application.json'
          },
          body: JSON.stringify({
            'image': 'https://cristianrobles4722.000webhostapp.com/' + res,
            'product_id': product_id
          })
        })
          .then(_ => {
            let tmp = [...this.state.images]
            tmp[index] = null
            this.setState({images: tmp})
          })
        .catch(err => console.log("Error al subir imagen: ", err))
      })
      .catch( (err) => console.log("error: ", err) )
    }
    reader.readAsDataURL(blob)
  }

  renderImage = ({item, index}) => {
    return <ImgPicker
      style={style.empty_img}
      img={item}
      getUrl={e => {
        let tmp = [...this.state.images]
        tmp[index] = e
        this.setState({images: tmp})
      }}/>
  }

  throwEmpty = () => {
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
          user_id: this.props.data.id,
        })
      })
      .then(res => res.json())
      .then(res => {
        if (parseInt(res) === 0)
          this.throwEmpty()
        else {
          for (let i = 0; i < this.state.images.length; i++) {
              if (this.state.images[i] !== null)
                this.uploadImageToSever(this.state.images[i], parseInt(res), i)
            }
          alert("¡Artículo publicado de manera exitosa!")
        }
      })
      .catch(err => console.log("Error: ", err))
    } else
      this.throwEmpty()
  }

  render() {
    console.log("urls: ", this.state.images)
    return (
      <ScrollView
        style={{backgroundColor: colors.secondaryBg}}>

        <Text style={style.title}>¡Publica tu producto ahora!</Text>
        <Input
          placeholder='Nombre del producto'
          throwable={this.state.name_empty}
          onChangeText={ e => this.setState({ name: e, name_empty: null }) }
        />

        <View style={style.carousel_container}>
          <Text style={style.carousel_title}>Imágenes del producto</Text>
          <Carousel
            sliderWidth={SCREEN_WIDTH * 0.8}
            itemWidth={SCREEN_WIDTH * 0.25}
            data={this.state.images}
            renderItem={this.renderImage}>
          </Carousel>
        </View>

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
            selectedValue={this.state.category}
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
    alignSelf: 'center',
    marginTop: '3%',
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
    width: '80%',
    borderWidth: 1,
    marginTop: '2%',
    paddingLeft: '2%',
    alignSelf: 'center',
    borderRadius: 10,
  },
  btn: {
    alignSelf: 'center',
    borderWidth: 1,
    width: '25%',
    backgroundColor: colors.btnBg,
    padding: 2,
    borderRadius: 10,
    marginTop: '5%',
    marginBottom: '5%',
  },
  btn_text: {
    color: colors.text,
    textAlign: 'center',
  },
  img: {

  },
  carousel_container: {
    width: '80%',
    marginTop: '3%',
    borderRadius: 5,
    backgroundColor: colors.btnBg,
    paddingBottom: '2%',
    alignSelf: 'center',
  },
  empty_text: {
    textAlign: 'center',
    color: colors.placeholder,
  },
  carousel_title: {
    color: colors.text,
    textAlign: 'center',
    fontSize: 20,
    marginBottom: '2%',
  },
})
