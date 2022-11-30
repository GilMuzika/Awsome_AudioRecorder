import React, { useRef } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import styles from './styles';



const positionsSaver = [];
let bottomMoveFactor = 0;
class ButtonsDock extends React.Component {
    constructor(props) {
        super(props);

        this.buttonDocsRef = React.createRef();

    }

    savePosition = (position) => {
        positionsSaver.push(position);
        if(positionsSaver.length > 2) {
            positionsSaver.pop();
        }
    }    

    onTouchMove_dragDock = (e) => {
        this.savePosition(e.nativeEvent.locationY);
    
        switch (true) {
            case positionsSaver[1] > positionsSaver[0]:
                bottomMoveFactor -= 3;
                break;
            case positionsSaver[1] < positionsSaver[0]:
                bottomMoveFactor += 3;
                break;
            default:
                break; 
        }

        this.buttonDocsRef.current.setNativeProps({
            //opacity: 0.5,
            //backgroundColor: 'red',

            /*
                Moving is disabled temporarily, to enable 
                uncomment the property "bottom"
             */
            //bottom: bottomMoveFactor, //changing "bottom" prop of the dock every time "onTouchMove_dragDock" called
            
          });
          
    };

    clearPositions = () => {
        for(let n in positionsSaver) {
            positionsSaver.pop();
        }
    };

render() {
  return (


    <Pressable ref = {this.buttonDocsRef} 
     onTouchEnd={this.clearPositions} 
     onTouchMove={(e) => this.onTouchMove_dragDock(e)} 
     onPress={this.clearPositions}
     style={[ styles.bottomButtonsContainer, this.props.isDockTranspatent ]}>

        <View style={styles.buttonsGroup}>
        <Pressable onTouchStart={this.props.onTouchStartEndFunctions[0][0]} onTouchEnd={this.props.onTouchStartEndFunctions[0][1]} onPress={this.props.onPressFunctions[0]} style={styles.labelsUnderButtonsContainer}>
            <View style={[styles.individualButton, this.props.buttonsColorOverrideStyles[0]]}>
                {this.props.buttons[0]()}
            </View>
            <Text ref={this.buttonsDockRef} style={styles.labelsUnderButtons}>{ this.props.buttonsNames[0] }</Text>
        </Pressable>

        
        <Pressable onTouchStart={this.props.onTouchStartEndFunctions[1][0]} onTouchEnd={this.props.onTouchStartEndFunctions[1][1]} onPress={this.props.onPressFunctions[1]} style={styles.labelsUnderButtonsContainer}>
            <View style={[styles.individualButton, this.props.buttonsColorOverrideStyles[1]]}>
                {this.props.buttons[1]()}
            </View>
            <Text style={styles.labelsUnderButtons}>{ this.props.buttonsNames[1] }</Text>
        </Pressable>

        <Pressable onTouchStart={this.props.onTouchStartEndFunctions[2][0]} onTouchEnd={this.props.onTouchStartEndFunctions[2][1]} onPress={this.props.onPressFunctions[2]} style={styles.labelsUnderButtonsContainer}>
            <View style={[styles.individualButton, this.props.buttonsColorOverrideStyles[2]]}>
                {this.props.buttons[2]()}
            </View>
            <Text style={styles.labelsUnderButtons}>{ this.props.buttonsNames[2] }</Text>
        </Pressable>
        </View>

        <View style={styles.buttonsGroup}>
        <Pressable onTouchStart={this.props.onTouchStartEndFunctions[3][0]} onTouchEnd={this.props.onTouchStartEndFunctions[3][1]} onPress={this.props.onPressFunctions[3]} style={styles.labelsUnderButtonsContainer}> 
            <View style={[styles.individualButton, this.props.buttonsColorOverrideStyles[3]]}>
                {this.props.buttons[3]()}
            </View>
            <Text style={styles.labelsUnderButtons}>{ this.props.buttonsNames[3] }</Text>
        </Pressable>

        <Pressable onTouchStart={this.props.onTouchStartEndFunctions[4][0]} onTouchEnd={this.props.onTouchStartEndFunctions[4][1]} onPress={this.props.onPressFunctions[4]} style={styles.labelsUnderButtonsContainer}> 
            <View style={[styles.individualButton, this.props.buttonsColorOverrideStyles[4]]}>
                {this.props.buttons[4]()}
            </View>
            <Text style={styles.labelsUnderButtons}>{ this.props.buttonsNames[4] }</Text>
        </Pressable>
        </View>
        
    </Pressable>



  );
 }
};
    
export default ButtonsDock;