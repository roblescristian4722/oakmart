import React, { Component } from 'react'
import { TextInput, FlatList, Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';

import OrderByPicker from './OrderByPicker'
import SearchProduct from './SearchProduct';
import colors from '../../Components/colors'
import globalStyle from '../../Components/globalStyle'

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      order: 'rating',
      home_data: null,
      search: '',
      search_icon: 'search',
      show_search: false,
      search_res: null,
      endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/search_product.php?',
      img_endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/get_product_images.php?',
    }
    this.search_bar = React.createRef();
  }
  
  componentDidMount() {
    this.getAllProducts()
  }
  
  searchProduct = async () => {
    if (this.state.search !== '')
      this.setState({ show_search: true })
  }

  // Obtiene todos los productos de la tienda para mostrarlos en el Home
  getAllProducts = async () => {
    try {
      // Obtiene los productos
      const res = await fetch(this.state.endpoint + new URLSearchParams({
        order: this.state.order,
      }))
      const res_json = await res.json()
      // Obtiene sus imágenes
      for (let i = 0; i < res_json.length; i++) {
        const res = await fetch(this.state.img_endpoint + new URLSearchParams({
          product_id: res_json[i].id
        }))
        const res_img_json = await res.json()
        if (res_img_json.length > 0)
          res_json[i].images = res_img_json
      }
      this.setState({ home_data: res_json })
    } catch(e) {
      console.log (`Error al obtener productos de página principal: ${e}`)
    }
  }

  onChangeText = (e) => {
    if (this.state.search !== '') {
      this.setState({ search: e, search_icon: 'close' })
    } else 
      this.setState({ search: e, earch_icon: 'search' })
  }

  searchButtonPressed = () => {
    if (this.state.search !== '') {
      this.setState({ search: '', search_icon: 'search', show_search: false })
      this.search_bar.current.clear()
    }
  }

  renderHomeProducts = ({ item }) => {
    return (
      <TouchableOpacity
        style={globalStyle.item_container}
        onPress={() => {this.props.navigation.navigate('Product', { id: item.id })}}>
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
    this.setState({ order: e }, async () => {
      await this.getAllProducts()
    })
  }

  render() {
    return (
      <View
        style={{backgroundColor: colors.secondaryBg, height: '100%'}}>

        <View style={style.search_container}>
          <TextInput
            ref={this.search_bar}
            placeholder='Buscar un producto'
            placeholderTextColor='black'
            style={style.search_bar}
            returnKeyType='search'
            onChangeText={this.onChangeText}
            onSubmitEditing={this.searchProduct}/>
          <TouchableOpacity
            onPress={this.searchButtonPressed}
            style={style.search_icon}>
            <Ionicons name={this.state.search_icon} style={{color: 'black'}} size={20} />
          </TouchableOpacity>
        </View>

      { this.state.show_search === true
          ? <SearchProduct
              data={this.state.search_res}
              search={this.state.search}
              navigation={this.props.navigation}/>
          :
            <View>
              <OrderByPicker
                value={this.state.order}
                onValueChange={this.pickerChangeValue}/>

              <FlatList
                data={this.state.home_data}
                style={style.res}
                renderItem={ this.renderHomeProducts }/>
            </View>
        }

      </View>
    )
  }
}

const style = StyleSheet.create({
  res: {
    width: '90%',
    alignSelf: 'center',
    marginTop: '4%',
    marginBottom: '10%',
    flexGrow: 0,
  },
  search_container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    width: '90%',
    alignSelf: 'center',
    marginTop: '5%',
  },
  search_bar: {
    color: 'black',
    flex: 8,
    paddingLeft: '4%',
  },
  search_icon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
