import { StyleSheet } from 'react-native'
import colors from './colors'

import { Dimensions } from 'react-native'
const SCREEN_WIDTH = Dimensions.get("window").width;

export default StyleSheet.create({
  item_container: {
    backgroundColor: colors.text,
    flexDirection: 'row',
    alignContent: 'center',
    borderWidth: 0.8,
  },
  item_img: {
    height: 90,
    width: 90,
    backgroundColor: colors.placeholder,
  },
  item_info: {
    flex: 8,
    padding: '2%',
    marginLeft: '2%',
    color: 'black',
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
    color: 'black',
  },
  item_price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  item_extra: {
    fontSize: 14,
    color: 'black',
  },
  item_img_container: {
    flex: 3,
    alignSelf: 'center',
  },
})
