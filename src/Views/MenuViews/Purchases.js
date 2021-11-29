import React, { Component } from 'react'
import { View, Image, Text, FlatList, StyleSheet, ScrollView, RefreshControl } from 'react-native'

import colors from '../../Components/colors'
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';

import { Dimensions } from 'react-native'
const SCREEN_WIDTH = Dimensions.get("window").width;

import Storage from 'react-native-storage';
const storage = new Storage({
  storageBackend: AsyncStorage,
  defaultExpires: null,
})

export default class Purchases extends Component {
  constructor(props) {
    super(props)
    this.state = {
      endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/purchases.php?',
      prod_endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/get_product_by_id.php?',
      img_endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/get_product_images.php?',
      data: null,
    }
  }

  componentDidMount() {
    this.getPurchases()
  }

  getPurchases = () => {
    this.setState({ data: null }, () => {
      // Se obtienen los datos del usuario
      storage.load({ key: 'userData' })
        .then(ret => {
          // Se obtienen las compras realizadas por el usuario
          fetch(this.state.endpoint + new URLSearchParams({
            user_id: ret.id
          }))
            .then(res => res.json())
            .then(res => {
              let product_id = []
              if (parseInt(res) !== 0) {
                let data = res
                for (let i of res)
                  product_id = [...product_id, parseInt(i.product_id)]
                // Se obtiene la información de cada producto
                fetch(this.state.prod_endpoint, {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application.json'
                  },
                  body: JSON.stringify({
                    'product_id': product_id
                  })
                })
                  .then(res => res.json())
                  .then(res => {
                    if (parseInt(res) !== 0)
                      for (let i = 0; i < data.length; i++) {
                        data[i].product_info = res[i]
                        // Se obtiene la imagen del producto
                        fetch(this.state.img_endpoint + new URLSearchParams({
                          product_id: data[i].product_id
                        }))
                          .then(res => res.json())
                          .then(res => {
                            if (res[0] !== undefined)
                              data[i].product_info.images = res[0]
                            this.setState({ data: data })
                          })
                          .catch(err => console.log(`Error al obtener imágenes (${err})`))
                      }
                  })
                  .catch(err => console.log(`Error al obtener datos del producto (${err})`))
              }
            })
            .catch(err => `Error al obtener historial (${err})`)
        })
    })
  }

  renderItem = ({item}) => {
    return (
      <View style={style.item_container}>
        {item.product_info.images
        ? <Image source={{uri: item.product_info.images}} style={style.item_img}/>
        :<Ionicons name='eye-off' style={style.item_img_mis}/>}
        <View style={style.item_info_container}>
          <Text style={style.item_text}>{item.product_info.name}</Text>
          <Text style={style.item_text}>${item.price}</Text>
          <Text style={style.item_text}>Cantidad: {item.pieces}</Text>
          <Text style={style.item_text}>Total: ${item.price_total}</Text>
        </View>
      </View>
  )}

  render() {
    if (this.state.data !== null)
      return (
        <View style={style.container}>
          <FlatList
            style={style.list}
            data={this.state.data}
            renderItem={this.renderItem}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => {
                  this.getPurchases()
                  this.setState({ refresh: true })
                  setTimeout(() => this.setState({ refreshing: false }), 2000)
              }}/>
            }/>
        </View>
      )
    else
      return (
        <ScrollView
          style={style.container}
          refreshControl = {
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.getPurchases()
                this.setState({ refresh: true })
                setTimeout(() => this.setState({ refresing: false }), 2000)
              }}/>
          }>
          <View style={style.no_res}>
            <Text style={style.no_res_text}>
              Aún no ha realizado compras
            </Text>
          </View>
        </ScrollView>
      )
  }
}

const style = StyleSheet.create({
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
    marginBottom: '5%',
    marginTop: '5%',
  },
  item_container: {
    borderWidth: 1,
    flexDirection: 'row',
  },
  item_img: {
    height: 100,
    width: 100,
    alignSelf: 'center',
  },
  item_img_mis: {
    backgroundColor: colors.placeholder,
    padding: '8%',
    fontSize: 0.10 * SCREEN_WIDTH,
    alignSelf: 'center',
  },
  item_info_container: {
    padding: '3%',
  },
  item_text: {
    fontSize: 16,
    color: 'black',
  }
})
