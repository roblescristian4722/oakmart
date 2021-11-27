import React, { Component } from 'react'
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native'
import { Picker } from '@react-native-picker/picker';
const SCREEN_WIDTH = Dimensions.get("window").width;

import colors from '../../Components/colors';

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
    if (this.state.order == 'rating')
      this.setState({ data: this.props.data })
  }

  searchProduct = async () => {
    await fetch(this.state.endpoint + new URLSearchParams({
      search: this.props.search,
      order: this.state.order,
    }))
    .then(res => res.json())
    .then(res => this.setState({ data: res }, () => {
        let data = [...this.state.data];
        for (let i = 0; i < data.length && data.length !== null; i++) {
          fetch(this.state.img_endpoint + new URLSearchParams({
            product_id: data[i].id
          }))
          .then(res => res.json())
          .then(res => {
            if (res[0] !== undefined) {
              data[i].images = res
              this.setState({ data: data })
            }
          })
          .catch(err => console.log(`error al obtener las imágenes (${err})`))
        }
      }))
    .catch(res => alert(`Error: ingrese un dato válido (${res})`))
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
        <View style={style.picker_container}>
          <Text style={style.picker_text}>
            Ordernar por 
          </Text>
          <View style={style.picker}>
            <Picker
              selectedValue={this.state.order}
              onValueChange={ e => this.setState({ order: e }, () => this.searchProduct()) }
              >
              <Picker.Item label='Rating' value='rating' />
              <Picker.Item label='Menor precio' value='lower_price' />
              <Picker.Item label='Mayor precio' value='higher_price' />
              <Picker.Item label='Popularidad' value='popularity' />
            </Picker>
          </View>
        </View>
        <FlatList
          style={style.res}
          data={this.state.data}
          renderItem={ ({item}) => (
            <TouchableOpacity
              style={style.item_container}
              onPress={() => {this.props.navigation.navigate('Product', { data: item })}}>
              <View style={{flex: 4, alignSelf: 'center'}}>
                {item.images
                  ? <Image source={{uri: item.images[0]}} style={style.item_img}/>
                  : <Ionicons name='eye-off' style={style.item_img_mis}/>}
              </View>
              <View style={style.item_info}>
                  <Text style={style.item_name}>
                    { item.name }
                  </Text>
                  <Text style={style.item_price}>
                    ${ item.price }
                  </Text>
                  <Text style={style.item_rating}>
                    calificación de clientes: { item.rating }
                  </Text>
                  <Text style={style.item_category}>
                    { item.category }
                  </Text>
              </View>
            </TouchableOpacity>
        )}/>
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
  item_container: {
    backgroundColor: colors.text,
    flexDirection: 'row',
    alignContent: 'center',
    borderWidth: 0.8,
  },
  item_img: {
    height: '70%',
    width: '100%',
    alignSelf: 'center',
    backgroundColor: colors.placeholder,
  },
  item_info: {
    flex: 10,
    padding: '2%',
    marginLeft: '2%',
  },
  item_img_mis: {
    backgroundColor: colors.placeholder,
    padding: '10%',
    fontSize: 0.18 * SCREEN_WIDTH,
    alignSelf: 'center',
  },
  item_name: {
    fontWeight: 'bold',
    fontSize: 22,
  },
  item_price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
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
