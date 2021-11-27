import React, { Component } from 'react'
import { Text, FlatList, View, StyleSheet, TouchableOpacity } from 'react-native'
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
      endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/get_cart_product_id.php?',
      sec_endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/get_product_by_id.php?',
      img_endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/get_product_images.php?',
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
                }
                data = res
                for(let i = 0; i < data.length; i++) {
                  fetch(this.state.img_endpoint + new URLSearchParams({
                    product_id: i.id,
                  }))
                    .then(res => res.json())
                    .then(res => {
                      if (res[0] !== undefined) {
                        data[i].images = res[0]
                      }
                    })
                    .catch(err => `Error al obtener imágenes (${err})`)
                }
                this.setState({ data: data })
              })
              .catch(err => console.log(`Error al obtener productos por id (${err})`))
          })
          .catch(err => console.log(`Error al recibir productos del carrito (${err})`))
      })
  }

  componentDidMount() {
    this.getCartProducts()
  }

  renderItem = ({item}) => {
    return (
      <View>
        <Text>
          {item.name}
        </Text>
        <Text>
          {item.price}
        </Text>
      </View>
    )
  }

  render() {
    if (this.state.data !== null) {
      return (
        <View
          style={{backgroundColor: colors.secondaryBg}}>
          <FlatList
            keyExtractor={(_, index) => index}
            style={style.list}
            data={this.state.data}
            renderItem={this.renderItem}>
          </FlatList>
        </View>
      )
    } else {
      return (
        <View>
          <Text>No hay elementos en el carrito</Text>
        </View>
      )
    }
  }
}

const style = StyleSheet.create({
  list: {

  }
})
