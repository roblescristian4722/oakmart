import React, { Component } from 'react'
import { Image, ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Carousel from 'react-native-snap-carousel';
import { Dimensions } from 'react-native'
const SCREEN_WIDTH = Dimensions.get("window").width;
import AsyncStorage from '@react-native-community/async-storage';
import Storage from 'react-native-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const storage = new Storage({
  storageBackend: AsyncStorage,
  defaultExpires: null,
})

import colors from '../../Components/colors'

export default class Product extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stock: this.props.route.params.data.stock,
      pieces: 0,
      endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/add_to_cart.php?',
    }
    this.data = this.props.route.params.data
  }

  renderItem = ({item}) => {
    if (item !== undefined)
      return <Image source={{uri: item}} style={{width: 200, height: 200}}/>
    else
      return <Ionicons name='eye-off' style={style.item_img_mis}/>
  }

  buyItem = async () => {
    if (this.data.stock > 0 && this.state.pieces > 0) {
      await storage.load({ key: 'userData' })
        .then(ret => {
          fetch(this.state.endpoint + new URLSearchParams({
            product_id: this.data.id,
            pieces: this.state.pieces,
            user_id: parseInt(ret.id),
          }))
            .then(res => res.json())
            .then(res => {
              if (parseInt(res) === 1)
                alert('Producto añadido al carrito exitosamente')
              else if (parseInt(res) === 2)
                alert('No se pudo agregar el producto al carrito, no hay stock suficiente')
            })
            .catch(err => console.log(`Error al añadir al carrito: ${err}`))
        })
    }
  }

  render() {
    return (
      <View
        style={style.container}>
        <ScrollView
          style={style.data_container}>
          <Text style={style.title}>
            {this.data.name}
          </Text>

          {this.data.images !== undefined
          ? <View style={style.carousel}>
              <Carousel
                sliderWidth={SCREEN_WIDTH * 0.8}
                itemWidth={SCREEN_WIDTH * 0.5}
                data={this.data.images}
                renderItem={this.renderItem}/>
            </View>
          : <Ionicons name='eye-off' style={style.item_img_mis}/>}

          <Text style={style.category}>
            Categoría: {this.data.category}
          </Text>

          <Text style={style.price}>
            Precio: ${this.data.price}
          </Text>

          <Text style={style.description}>
            Descripción: {this.data.description}
          </Text>

          <View style={style.buy_container}>
            <TouchableOpacity
              style={style.buy_btn}
              onPress={this.buyItem}>
              <Text
                style={style.buy_btn_text}>
                Comprar
              </Text>
            </TouchableOpacity>
            <View style={style.counter_container}>
              <TouchableOpacity style={style.minus}
                onPress={() => {
                  if (this.state.pieces > 0)
                    this.setState({ pieces: this.state.pieces - 1 })
                }}>
                <Text style={style.minus_text}>
                  -
                </Text>
              </TouchableOpacity>
              <Text style={style.pieces}>{this.state.pieces}</Text>
              <TouchableOpacity style={style.plus}
                onPress={() => {
                  if (this.state.pieces < this.state.stock)
                    this.setState({ pieces: this.state.pieces + 1 })
                }}>
                <Text style={style.plus_text}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: colors.secondaryBg,
  },
  carousel: {
    marginTop: '5%',
  },
  data_container: {
    width: '90%',
    marginTop: '5%',
    marginBottom: '5%',
    alignSelf: 'center',
    backgroundColor: colors.text,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    color: 'black',
  },
  price: {
    marginTop: '3%',
    marginLeft: '5%',
    fontSize: 24,
    color: 'black',
  },
  description: {
    marginTop: '3%',
    marginLeft: '5%',
    fontSize: 20,
    color: 'black',
  },
  category: {
    marginTop: '2%',
    marginLeft: '5%',
  },
  item_img_mis: {
    backgroundColor: colors.placeholder,
    padding: '10%',
    fontSize: 0.18 * SCREEN_WIDTH,
    alignSelf: 'center',
  },
  buy_btn: {
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: colors.bg,
    flex: 3,
    marginRight: '5%',
  },
  buy_btn_text: {
    textAlign: 'center',
    color: colors.text,
  },
  buy_container: {
    marginTop: '5%',
    flexDirection: 'row',
    width: '70%',
    alignSelf: 'center',
  },
  counter_container: {
    flexDirection: 'row',
    flex: 2,
  },
  plus: {
    borderWidth: 1,
    flex: 1,
    borderRadius: 5,
  },
  plus_text: {
    textAlign: 'center',
  },
  minus: {
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
  },
  minus_text: {
    textAlign: 'center',
  },
  pieces: {
    flex: 3,
    textAlign: 'center',
    marginLeft: '3%',
    marginRight: '3%',
  }
})
