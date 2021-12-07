import React, { Component } from 'react'
import {TextInput,
        Image,
        ScrollView,
        View,
        Text,
        StyleSheet,
        TouchableOpacity } from 'react-native'
import Carousel from 'react-native-snap-carousel';
import { Dimensions } from 'react-native'
import {Picker} from '@react-native-picker/picker';
const SCREEN_WIDTH = Dimensions.get("window").width;
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../../Components/colors'

export default class Product extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pieces: 1,
      endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/add_to_cart.php?',
      update_endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/get_product_by_id.php?',
      img_endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/get_product_images.php?',
      rev_endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/ratings.php?',
      send_endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/rate.php?',
      user_endpoinit: 'https://cristianrobles4722.000webhostapp.com/oakmart/get_user_by_id.php?',
      data: null,
      user_id: null,
      ratings: null,
      reviews: null,
      rating: 0,
      comment: '',
    }
    this.id = this.props.route.params.id
  }

  componentDidMount() {
    this.getReviews()
    this.getStoredData()
      .then(ret => {
        this.setState({ user_id: ret.id })
        this.updateStock()
      })
  }

  getReviews = async () => {
    try {
      const res = await fetch(this.state.rev_endpoint + new URLSearchParams({
        product_id: this.id
      }))
      const res_json = await res.json()
      if (res_json.length > 0) {
        for (let i = 0; i < res_json.length; i++) {
          const user_res = await fetch (this.state.user_endpoinit + new URLSearchParams({
            id: res_json[i].user_id
          }))
          const user_res_json = await user_res.json()
          res_json[i].username = user_res_json
        }
        this.setState({ reviews: res_json })
      }
    } catch (e) {
      console.log(`Error al obtener reviews (${e})`)
    }
  }

  sendReview = async () => {
    try {
      const res = await fetch(this.state.send_endpoint + new URLSearchParams({
        product_id: this.id,
        user_id: this.state.user_id,
        commentary: this.state.comment === '' ? null : this.state.comment,
        rating: this.state.rating,
      }))
      const res_json = await res.json()
      if (parseInt(res_json) === 1)
        alert('Reseña realizada con éxito')
      else if (parseInt(res_json) === 0)
        alert('Error al enviar la reseña')
    } catch (e) {
      console.log(`Error al enviar reseña (${e})`)
    }
  }

  getStoredData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_data')
      return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch (e) {
      console.log(`Error al obtener datos de usuario (${e})`)
    }
  }

  updateStock = async () => {
    try {
      const res = await fetch(this.state.update_endpoint, {
        method: 'POST',
        body: JSON.stringify({
          product_id: [this.id]
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application.json'
        }
      })
      const data = await res.json()
      const img_res = await fetch(this.state.img_endpoint + new URLSearchParams({
        product_id: this.id
      }))
      const img = await img_res.json()
      if (img.length > 0)
        data[0].images = img
      this.setState({ data: data[0] })
    } catch (e) {
      console.log(`Error al obtener stock (${e})`)
    }
  }

  renderItem = ({item}) => {
    if (item !== undefined)
      return <Image source={{uri: item}} style={{width: 200, height: 200}}/>
    else
      return <Ionicons name='eye-off' style={style.item_img_mis}/>
  }

  buyItem = () => {
    if (this.state.data.stock > 0 && this.state.pieces > 0) {
      this.getStoredData()
        .then(ret => {
          console.log(ret.id)
          fetch(this.state.endpoint + new URLSearchParams({
            product_id: this.id,
            pieces: this.state.pieces,
            user_id: parseInt(ret.id),
          }))
            .then(res => res.json())
            .then(res => {
              if (parseInt(res) === 1) {
                this.setState({ updated: !this.state.updated })
                alert('Producto añadido al carrito exitosamente')
                this.updateStock()
              }
              else if (parseInt(res) === 2)
                alert('No se pudo agregar el producto al carrito, no hay stock suficiente')
            })
            .catch(err => console.log(`Error al añadir al carrito: ${err}`))
        })
    }
  }

  renderReviews = (item, index) => {
    if (item !== undefined)
      return (
        <View
          style={style.user_rev_inner_container}
          key={index}>
          <View
            style={{ flexDirection: 'row' }}>
            <Text
              style={style.user_rev_username}>
              {item.username}
            </Text>
            <Text
              style={style.user_rev_rating}>
              calificación: {item.rating}
            </Text>
          </View>
          {
            item.commentary
            ? <Text
                style={style.user_rev_commentary}>
                {item.commentary}
              </Text>
            : null
          }
        </View>
      )
  }

  renderBuyButton = () => {
    if (this.state.data.user_id === this.state.user_id)
      return <Text style={style.no_stock_text}>
        Este producto fue publicado por tí
      </Text>
    if (this.state.data.stock > 0)
      return <View style={style.buy_container}>
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
                if (this.state.pieces > 1)
                  this.setState({ pieces: this.state.pieces - 1 })
              }}>
              <Text style={style.minus_text}>
                -
              </Text>
            </TouchableOpacity>
            <Text style={style.pieces}>{this.state.pieces}</Text>
            <TouchableOpacity style={style.plus}
              onPress={() => {
                if (this.state.pieces < this.state.data.stock)
                  this.setState({ pieces: this.state.pieces + 1 })
              }}>
              <Text style={style.plus_text}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>
    return (
      <Text style={style.no_stock_text}>
          No hay stock suficiente
      </Text>
    )
  }

  render() {
    if (this.state.data !== null)
      return (
        <ScrollView
          style={style.container}>
          <View
            style={style.data_container}>
            <Text style={style.title}>
              {this.state.data.name}
            </Text>

            {this.state.data.images !== undefined
            ? <View style={style.carousel}>
                <Carousel
                  sliderWidth={SCREEN_WIDTH * 0.8}
                  itemWidth={SCREEN_WIDTH * 0.5}
                  data={this.state.data.images}
                  renderItem={this.renderItem}/>
              </View>
            : <Ionicons name='eye-off' style={style.item_img_mis}/>}

            <Text style={style.category}>
              Categoría: {this.state.data.category}
            </Text>

            <Text style={style.price}>
              Precio: ${this.state.data.price}
            </Text>

            <Text style={style.description}>
              Descripción: {this.state.data.description}
            </Text>

            { this.renderBuyButton() }

          </View>

          <View
            style={style.review_container}>
            <Text style={style.review_title}>
              Añadir una reseña
            </Text>
            <TextInput
              style={style.comment}
              placeholder="Escribe un comentario del producto"
              onChangeText={e => this.setState({ comment: e })}
              multiline={true}
              />
            <View style={{ flexDirection: 'row' }}>
              <Picker
                style={style.review_picker}
                selectedValue={this.state.rating}
                onValueChange={e => this.setState({ rating: e })}
              >
                <Picker.Item label='0' value={0} />
                <Picker.Item label='1' value={1} />
                <Picker.Item label='2' value={2} />
                <Picker.Item label='3' value={3} />
                <Picker.Item label='4' value={4} />
                <Picker.Item label='5' value={5} />
              </Picker>
              <TouchableOpacity
                style={style.review_btn}
                onPress={this.sendReview}
                >
                <Text style={style.review_btn_text}>
                  Enviar reseña
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={style.user_rev_container}>
            <Text
              style={style.ratings_title}>
              Reseñas
            </Text>
            <ScrollView
              style={style.ratings_container}
              >
                {
                  this.state.reviews
                  ? this.state.reviews.map((item, index) => this.renderReviews(item, index))
                  : null
                }
            </ScrollView>
          </View>

        </ScrollView>
      )
    else
      return null
  }
}

const style = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: colors.secondaryBg,
  },
  carousel: {
    marginTop: '10%',
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
    marginTop: '5%',
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
    color: 'black',
  },
  item_img_mis: {
    backgroundColor: colors.placeholder,
    marginTop: '10%',
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
    marginBottom: '10%',
    alignSelf: 'center',
  },
  counter_container: {
    flexDirection: 'row',
    flex: 2,
  },
  plus: {
    borderWidth: 1,
    flex: 3,
    borderRadius: 5,
  },
  plus_text: {
    textAlign: 'center',
    color: 'black',
  },
  minus: {
    borderRadius: 5,
    borderWidth: 1,
    flex: 3,
  },
  minus_text: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  pieces: {
    flex: 3,
    textAlign: 'center',
    marginLeft: '3%',
    marginRight: '3%',
    color: 'black',
  },
  no_stock_text: {
    marginTop: '5%',
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
  },
  review_container: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: '5%',
    paddingBottom: '2%',
    paddingTop: '2%',
    backgroundColor: colors.btnBg,
  },
  review_picker: {
    flex: 2,
    color: colors.text,
    marginLeft: '5%',
  },
  review_btn: {
    flex: 5,
    alignSelf: 'center',
  },
  review_btn_text: {
    textAlign: 'center',
    borderWidth: 1,
    marginRight: '5%',
    borderRadius: 10,
    backgroundColor: colors.bg,
  },
  user_rev_container: {
    alignSelf: 'center',
    width: '90%',
    backgroundColor: colors.btnBg,
    padding: '5%',
  },
  user_rev_inner_container: {
    marginTop: '2%',
    borderWidth: 1,
    padding: '2%',
  },
  user_rev_username: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 3,
  },
  user_rev_rating: {
    flex: 3,
  },
  comment: {
    borderWidth: 1,
    width: '95%',
    alignSelf: 'center',
    marginTop: '5%',
  },
  review_title: {
    fontSize: 14,
    textAlign: 'center',
  },
  ratings_title: {
    fontSize: 16,
    textAlign: 'center',
  }
})
