import React, { Component } from 'react'
import {ScrollView,
        Text,
        FlatList,
        View,
        StyleSheet,
        TouchableOpacity,
        RefreshControl,
        Image,
        ToastAndroid } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native'
const SCREEN_WIDTH = Dimensions.get("window").width;

import colors from '../../Components/colors'
import AsyncStorage from '@react-native-community/async-storage';
import Storage from 'react-native-storage';
const storage = new Storage({
  storageBackend: AsyncStorage,
  defaultExpires: null,
})

export default class Cart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      products: null,
      data: null,
      user_data: null,
      refreshing: false,
      endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/get_cart_product_id.php?',
      sec_endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/get_product_by_id.php?',
      img_endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/get_product_images.php?',
      del_endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/remove_from_cart.php?',
      buy_endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/buy.php?'
    }
  }

  getCartProducts = async () => {
    await storage.load({ key: 'userData' })
      .then( user => {
        fetch(this.state.endpoint + new URLSearchParams({
          user_id: user.id
        }))
          .then(res => res.json())
          .then(res => {
            if (res.length === 0)
              this.setState({ data: null })
            else {
              let data = res
              let product_id = []
              for (let i of res)
                product_id = [...product_id, parseInt(i.product_id)]
              fetch(this.state.sec_endpoint, {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application.json',
                },
                body: JSON.stringify({
                  'product_id': product_id,
                })
              })
                .then(res => res.json())
                .then(res => {
                  for (let i = 0; i < res.length; i++) {
                    res[i].pieces = data[i].pieces
                    res[i].cart_id = data[i].cart_id
                  }
                  data = res
                  for(let i = 0; i < data.length; i++) {
                    fetch(this.state.img_endpoint + new URLSearchParams({
                      product_id: data[i].id,
                    }))
                      .then(res => res.json())
                      .then(res => {
                        if (res[0] !== undefined)
                          data[i].images = res[0]
                        this.setState({ data: data })
                      })
                      .catch(err => `Error al obtener imágenes (${err})`)
                  }
                })
                .catch(err => console.log(`Error al obtener productos por id (${err})`))
            }
          })
          .catch(err => console.log(`Error al recibir productos del carrito (${err})`))
      })
  }

  componentDidMount() {
    this.getCartProducts()
  }

  buyProduct = async () => {
    for (let i of this.state.data)
      await fetch(this.state.buy_endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application.json',
        },
        body: JSON.stringify({
          'user_id': i.user_id,
          'product_id': i.id,
          'order_id': i.cart_id,
        })
      })
        .then(res => res.json())
        .then(res => {
          if (parseInt(res) === 1)
            ToastAndroid.show(`Producto ${i.name} comprado de manera exitosa`, ToastAndroid.SHORT)
          else if (parseInt(res) === 0)
            ToastAndroid.show(`Ha surgido un error al intentar comprar ${i.name}`, ToastAndroid.SHORT)
          this.getCartProducts()
        })
        .catch(err => console.log(`Error al realizar la compra (${err})`))
  }

  removeProduct = async (cart_id) => {
    await fetch(this.state.del_endpoint + new URLSearchParams({
      cart_id: cart_id,
    }))
      .then(res => res.json())
      .then(_ => this.getCartProducts())
      .catch(err => console.log(`Error al borrar producto del carrito (${err})`))
  }

  renderItem = ({item}) => {
    return (
      <View style={style.item_container}>
        {item.images
        ? <Image source={{uri: item.images}} style={style.item_img}/>
        :<Ionicons name='eye-off' style={style.item_img_mis}/>}
        <Text>
          {item.name}
        </Text>
        <Text>
          {item.price}
        </Text>
        <TouchableOpacity
          onPress={() => this.removeProduct(item.cart_id)}
          style={style.cancel_btn}>
          <Text style={style.cancel_text}>
            x
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    if (this.state.data !== null)
      return (
        <View
          style={style.container}>
          <FlatList
            keyExtractor={(item) => item.cart_id}
            style={style.list}
            data={this.state.data}
            renderItem={this.renderItem}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => {
                  this.getCartProducts()
                  this.setState({ refresh: true })
                  setTimeout(() => this.setState({ refreshing: false }), 2000)
                }}/>
            }>
          </FlatList>
          <TouchableOpacity
            style={style.buy_btn}
            onPress={this.buyProduct}>
            <Text style={style.buy_btn_text}>
              ¡Comprar!
            </Text>
          </TouchableOpacity>
        </View>
      )
    else
      return (
        <ScrollView
          style={style.container}
          refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => {
              this.getCartProducts()
              this.setState({ refresh: true })
              setTimeout(() => this.setState({ refreshing: false }), 2000)
            }}/>
          }>
          <View style={style.no_res}>
          <Text style={style.no_res_text}>No hay elementos en el carrito, intente recargar la página</Text>
          </View>
        </ScrollView>
      )
  }
}

const style = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: colors.secondaryBg,
  },
  list: {
    alignSelf: 'center',
    backgroundColor: colors.text,
    borderWidth: 1,
    width: '90%',
    height: '90%',
    marginBottom: '10%',
    marginTop: '5%',
  },
  item_container: {
    borderWidth: 1,
  },
  cancel_btn: {
    backgroundColor: colors.bg,
    width: '6%',
    borderRadius: 10,
    borderWidth: 1,
  },
  cancel_text: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  item_img: {
    height: 100,
    width: 100,
  },
  item_img_mis: {
    backgroundColor: colors.placeholder,
    padding: '10%',
    fontSize: 0.18 * SCREEN_WIDTH,
    alignSelf: 'center',
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
  buy_btn: {
    borderWidth: 1,
    position: 'absolute',
    left: '72%',
    bottom: '2%',
    backgroundColor: colors.bg,
    borderRadius: 10,
  },
  buy_btn_text: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'black',
    fontWeight: 'bold',
    padding: '2%',
    fontSize: 18,
  }
})
