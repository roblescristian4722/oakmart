import React, { Component } from 'react'
import { View, Image, Text, FlatList, StyleSheet, ScrollView, RefreshControl } from 'react-native'

import colors from '../../Components/colors'
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Dimensions } from 'react-native'
const SCREEN_WIDTH = Dimensions.get("window").width;

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

  getStoredData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_data')
      return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch (e) {
      console.log(`Error al obtener datos de usuario (${e})`)
    }
  }

  getPurchases = async () => {
    this.setState({ data: null }, async () => {
      // Se obtienen los datos del usuario
      try {
        const user = await this.getStoredData()
        // Se obtienen las compras realizadas por el usuario
        try {
          const pur = await fetch(this.state.endpoint + new URLSearchParams({
            user_id: user.id
          }))
          const pur_json = await pur.json()
          console.log(`purchases: ${pur_json}`)
          let product_id = []
          if (parseInt(pur_json) !== 0) {
              for (let i of pur_json)
                product_id = [...product_id, parseInt(i.product_id)]
            // Se obtiene la información de cada producto
            try {
              const prod_info = await fetch(this.state.prod_endpoint, {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application.json',
                },
                body: JSON.stringify({
                  'product_id': product_id
                })
              })
              const prod_info_json = await prod_info.json()
              if (parseInt(prod_info_json) !== 0) {
                for (let i = 0; i < prod_info_json.length; i++) {
                  pur_json[i].product_info = prod_info_json[i]
                  // Se obtiene la imagen del producto
                  try {
                    const prod_img = await fetch(this.state.img_endpoint + new URLSearchParams({
                      product_id: pur_json[i].product_id
                    }))
                    const prod_img_json = await prod_img.json()
                    if (prod_img_json[0] !== undefined)
                      pur_json[i].product_info.images = prod_img_json[0]
                  } catch (e) {
                    console.log(`Error al obtener imágenes (${e})`)
                  }
                }
                this.setState({ data: pur_json })
              }
            } catch (e) {
              console.log(`Error al obtener datos del producto (${err})`)
            }
          }
        } catch(e) {
          console.log(`Error al obtener historial (${e})`)
        }
      } catch (e) {
        console.log(`Error al obtener datos de usuario (${e})`)
      }})
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
                  this.setState({ refreshing: true }, () => this.getPurchases())
                  setTimeout(() => this.setState({ refreshing: false }), 1000)
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
                this.setState({ refreshing: true }, () => this.getPurchases())
                setTimeout(() => this.setState({ refreshing: false }), 1000)
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
