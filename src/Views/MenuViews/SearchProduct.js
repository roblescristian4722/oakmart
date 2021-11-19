import React, { Component } from 'react'
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dimensions } from 'react-native'
const SCREEN_WIDTH = Dimensions.get("window").width;

import colors from '../../Components/colors';

export default class SearchProduct extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    const data = this.props.data
    // Si no hubieron resultados existosos
    if (data === 0)
      return (
        <View style={style.no_res}>
          <Text style={style.no_res_text}>
            Lo sentimos... Su búsqueda no generó resultados
          </Text>
        </View>
      )
    return (
      <FlatList
        style={style.res}
        data={data}
        renderItem={ ({item}) => (
          <TouchableOpacity style={style.item_container}>
            <View style={{flex: 4, alignSelf: 'center'}}>
              {item.image
                ? <Image source={{uri: item.image}} style={style.item_img}/>
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
})
