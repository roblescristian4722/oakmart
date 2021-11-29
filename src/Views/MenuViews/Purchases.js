import React, { Component } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'

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
      data: null,
    }
  }

  componentDidMount() {
    this.getPurchases()
  }

  getPurchases = async () => {
    await storage.load({ key: 'userData' })
      .then(ret => {
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
                    for (let i = 0; i < data.length; i++)
                      data[i].product_info = res[i]
                  this.setState({ data: data })
                })
                .catch(err => console.log(`Error al obtener datos del producto (${err})`))
            }
          })
          .catch(err => `Error al obtener historial (${err})`)
      })
  }

  renderItem = ({item}) => {
    return (
      <View style={style.item_container}>
        {item.images
        ? <Image source={{uri: item.images}} style={style.item_img}/>
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
            renderItem={this.renderItem}/>
        </View>
      )
    else
      return (
        <View>
          <Text>
            Aún no ha realizado compras
          </Text>
        </View>
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
