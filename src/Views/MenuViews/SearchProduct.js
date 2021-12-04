import React, { Component } from 'react'
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';

import colors from '../../Components/colors';
import globalStyle from '../../Components/globalStyle'
import OrderByPicker from './OrderByPicker'

export default class SearchProduct extends Component {
  constructor(props) {
    super(props)
    this.state = {
      order: 'rating',
      data: null,
      endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/search_product.php?',
      img_endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/get_product_images.php?',
    }
  }

  componentDidMount() {
    this.searchProduct()
    if (this.state.order == 'rating')
      this.setState({ data: this.props.data })
  }

  searchProduct = async () => {
    try {
      const res = await fetch(this.state.endpoint + new URLSearchParams({
        search: this.props.search,
        order: this.state.order,
      }))
      const data = await res.json()
      if (parseInt(data) !== 0) {
          for (let i = 0; i < data.length; i++) {
            try{
              const img = await fetch(this.state.img_endpoint + new URLSearchParams({
                product_id: data[i].id
              }))
              const img_res = await img.json()
                if (img_res[0] !== undefined) {
                  data[i].images = img_res
                }
            } catch {
              err => console.log(`error al obtener las imágenes (${err})`)
            }
          }
          this.setState({ data: data })
          }
    } catch{
      res => alert(`Error: ingrese un dato válido (${res})`)
    }
  }

  renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={globalStyle.item_container}
        onPress={() => {this.props.navigation.navigate('Product', { data: item })}}>
        <View style={globalStyle.item_img_container}>
          {item.images
            ? <Image source={{uri: item.images[0]}} style={globalStyle.item_img}/>
            : <Ionicons name='eye-off' style={globalStyle.item_img_mis}/>}
        </View>
        <View style={globalStyle.item_info}>
            <Text style={globalStyle.item_name}>
              { item.name }
            </Text>
            <Text style={globalStyle.item_price}>
              ${ item.price }
            </Text>
            <Text style={globalStyle.item_extra}>
              calificación de clientes: { item.rating }
            </Text>
            <Text style={globalStyle.item_extra}>
              { item.category }
            </Text>
        </View>
      </TouchableOpacity>
    )
  }

  pickerChangeValue = (e) => {
    this.setState({order: e}, async () => {
      await this.searchProduct()
    })
  }

  render() {
    const data = this.props.data
    // Si no hubieron resultados exitosos
    if (data === 0 || data === undefined)
      return (
        <View style={style.no_res}>
          <Text style={style.no_res_text}>
            Lo sentimos... Su búsqueda no generó resultados
          </Text>
        </View>
      )
    return (
      <View style={style.container}>
        <OrderByPicker
          value={this.state.order}
          onValueChange={this.pickerChangeValue}/>
        <FlatList
          style={style.res}
          data={this.state.data}
          renderItem={ this.renderItem }/>
      </View>
    )
  }
}

const style = StyleSheet.create({
  res: {
    width: '90%',
    alignSelf: 'center',
    marginTop: '4%',
    flexGrow: 0,
  },
  no_res: {
    width: '90%',
    backgroundColor: 'white',
    alignSelf: 'center',
    marginTop: '45%',
    padding: '4%',
    borderRadius: 30,
  },
  no_res_text: {
    fontSize: 24,
    textAlign: 'center',
    color: 'black',
  },
})
