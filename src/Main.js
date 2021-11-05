import React, { Component } from 'react';
import { ScrollView } from 'react-native';

export default class Main extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  connect = async () => {
    var xhttp = new XMLHttpRequest();
    var _this = this;
    var form_data = new FormData();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          // Typical action to be performed when the document is ready:
          console.log(xhttp.responseText);
        }
    };
    xhttp.open("POST", "https://cristianrobles4722.000webhostapp.com/oakmart/index.php", true);
    xhttp.send();
  }

  render() {
    return (
      <ScrollView>
      </ScrollView>
    )
  }
}
