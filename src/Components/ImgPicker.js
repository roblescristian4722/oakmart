import React, { Component } from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native'
import * as ImagePicker from 'react-native-image-crop-picker'

export default class ImgPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      file_uri: null,
      img_server_path: null,
    }
  }

  renderImg = () => {
    return this.state.file_uri === null
      ? <Image source={require('../../imgs/user.png')} style={{width: 100, height: 100}}/>
      : <Image source={{uri: this.state.file_uri}} style={{width: 100, height: 100}}/>
  }

  uploadToSever = async () => {
    const image = await fetch(this.state.file_uri)
    const blob = await image.blob()
    var reader = new FileReader()
    reader.onload = () => {
      var insert_API = 'https://cristianrobles4722.000webhostapp.com/oakmart/upload_photo.php'
      var data = { img: reader.result }
      var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application.json'
      }
      fetch(insert_API, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(res => {
        this.setState({ img_server_path: `https://cristianrobles4722.000webhostapp.com/${res}` },
          () => {
            if (this.props.getUrl !== undefined)
              this.props.getUrl(this.state.img_server_path)
          })
      })
      .catch( err => console.log("error: ", err) )
    }
    reader.readAsDataURL(blob)
  }

  getImage = () => {
    ImagePicker.openPicker({
      width: 200,
      height: 200,
      cropping :true,
    }).then( src => {
      if (src.path !== undefined)
        this.setState({ file_uri: src.path }, () => this.uploadToSever())
    })
  }

  render() {
    return (
      <TouchableOpacity
        style={[style.contaniner, this.props.style]}
        onPress={this.getImage}>
        {this.renderImg()}
      </TouchableOpacity>
    )
  }
}

const style = StyleSheet.create({
  contaniner: {
    height: 100,
    width: 100,
  },
})
