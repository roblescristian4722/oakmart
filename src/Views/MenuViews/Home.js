import React, { Component } from 'react'
import { ScrollView, TextInput, Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import storage from '../../Components/storage'
import colors from '../../Components/colors'
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      search_icon: 'search',
      show_search: false,
    }
    this.search_bar = React.createRef();
  }
  
  searchProduct = () => {
    if (this.state.search !== '')
      this.setState({ show_search: true })
  }

  onChangeText = (e) => {
    if (this.state.search !== '') {
      this.setState({ search: e, search_icon: 'close' })
    } else 
      this.setState({ search: e, earch_icon: 'search' })
  }

  searchButtonPressed = () => {
    if (this.state.search !== '') {
      this.setState({ search: '', search_icon: 'search' })
      this.search_bar.current.clear()
    }
  }

  render() {
    return (
      <ScrollView
        style={{backgroundColor: colors.secondaryBg}}>

        <View style={style.search_container}>
          <TextInput
            ref={this.search_bar}
            placeholder='Buscar un producto'
            style={style.search_bar}
            returnKeyType='search'
            onChangeText={this.onChangeText}
            onSubmitEditing={this.searchProduct}/>

          { this.state.show_search === true ? <Text style={{color: 'white'}}>BUSCANDO</Text> : null}

          <TouchableOpacity
            onPress={this.searchButtonPressed}
            style={style.search_icon}>
            <Ionicons name={this.state.search_icon} size={20} />
          </TouchableOpacity>
        </View>

      </ScrollView>
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
