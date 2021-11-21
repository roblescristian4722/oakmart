import React, { Component } from 'react'
import { TextInput, Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import colors from '../../Components/colors'
import Ionicons from 'react-native-vector-icons/Ionicons';

import SearchProduct from './SearchProduct';

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      search_icon: 'search',
      show_search: false,
      search_res: null,
      endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/search_product.php?',
      img_endpoint: 'https://cristianrobles4722.000webhostapp.com/oakmart/get_product_images.php?',
    }
    this.search_bar = React.createRef();
  }
  
  searchProduct = async () => {
    if (this.state.search !== '') {
      console.log(this.state.search)
      await fetch(this.state.endpoint + new URLSearchParams({
        search: this.state.search,
        order: 'rating',
      }))
      .then(res => res.json())
      .then(res => this.setState({ show_search: true, search_res: res }, () => {
        let data = [...this.state.search_res];
        for (let i = 0; i < data.length && data.length !== null; i++) {
          fetch(this.state.img_endpoint + new URLSearchParams({
            product_id: data[i].id
          }))
          .then(res => res.json())
          .then(res => {
            if (res[0] !== undefined) {
              data[i].images = res
              this.setState({ search_res: data })
            }
          })
          .catch(err => console.log(`error al obtener las imágenes (${err})`))
        }
      }))
      .catch(res => alert(`Error: ingrese un dato válido (${res})`))
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

  render() {
    return (
      <View
        style={{backgroundColor: colors.secondaryBg, height: '100%'}}>

        <View style={style.search_container}>
          <TextInput
            ref={this.search_bar}
            placeholder='Buscar un producto'
            style={style.search_bar}
            returnKeyType='search'
            onChangeText={this.onChangeText}
            onSubmitEditing={this.searchProduct}/>
          <TouchableOpacity
            onPress={this.searchButtonPressed}
            style={style.search_icon}>
            <Ionicons name={this.state.search_icon} size={20} />
          </TouchableOpacity>
        </View>

        { this.state.show_search === true
          ? <SearchProduct data={this.state.search_res} search={this.state.search}/>
          : null }

      </View>
    )
  }
}

const style = StyleSheet.create({
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
