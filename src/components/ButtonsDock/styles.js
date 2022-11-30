import { StyleSheet, Dimensions } from "react-native";

const bottomButtonsContainerHeight = Dimensions.get('window').height * 0.32;
const react_native_vector_iconsHeight = bottomButtonsContainerHeight * 0.28;
    
const styles = StyleSheet.create(
  {
    labelsUnderButtons: {
        color: 'white',
        fontWeight: '800',
        paddingTop: 5,
      },
      labelsUnderButtonsContainer: {
        alignItems: "center",
      },
      bottomButtonsContainer: {
        backgroundColor: '#333333',
        padding: 10,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        height: bottomButtonsContainerHeight,
        flexDirection: 'column', //to display all the buttons on the same row
        justifyContent: "space-evenly",
        width: Dimensions.get('screen').width * 0.98,
        position: 'absolute',
        bottom: 0 - bottomButtonsContainerHeight / 2,
        alignItems: 'center'
  
    },
    buttonsGroup: {
      flexDirection: 'row',
      justifyContent: "space-between",
      width: '90%',
    },

    individualButton: {
      backgroundColor: '#4a4a4a',
      padding: 15,
      borderRadius: 50,
      height: react_native_vector_iconsHeight,
      alignItems: 'center',
      alignSelf: 'center'
  }, 

  }
);
    
export default styles;