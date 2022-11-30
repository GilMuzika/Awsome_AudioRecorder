import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
    
const styleSheetName = StyleSheet.create(
  {
    recordPlayTimeIndication: {
        color: 'white',
        opacity: 0,
        fontSize: 50,
        fontWeight: 'bold',
        position: 'absolute',
        top: screenHeight * 0.04,

    },
    fileStatsIndication: {
      position: 'absolute',
      top: screenHeight  * 0.25,
      width: screenWidth * 0.9,

      paddingVertical: 10,
      paddingHorizontal: 5,
      backgroundColor: 'lightgray',
      borderRadius: 5,

    },
    fileStatsIndicationText: {
      color: 'purple',
      fontSize: 18, 
    },

    playProgressBar: {
        position: 'absolute',
        top: 200,
        opacity: 0,
        margin: 20,


    }
  }
);
    
export default styleSheetName;