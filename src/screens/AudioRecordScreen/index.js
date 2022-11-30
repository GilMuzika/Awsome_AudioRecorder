import React, { useState, useRef, useEffect, useCallback, } from 'react';
import { View, Text, ImageBackground, Dimensions, AppState } from 'react-native';
import commonScreenStyles from '../commonScreenStyles';
import background from '../../images/backgrounds/kevin-mueller-tjn6FCkc1Hw-unsplash.jpg'
import ButtonsDock from '../../components/ButtonsDock';
import styles from './styles';
import * as Progress from 'react-native-progress';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
/*
  'react-native-vector-icons' is a package that contain very many icons for using in projects.
  Home page: https://github.com/oblador/react-native-vector-icons
  Installation: npm i react-native-vector-icons
  Directory page to browse and choose icons: https://oblador.github.io/react-native-vector-icons/
  --------------------------------------------------------------------------------------------------------
  Important note!:
  After installing 'react-native-vector-icons' with npm,
  copy this line:
  
  apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"

  into "android/app/build.gradle" file (NOT "android/build.gradle" !!!!)

  to any place in the file that is not a part of a function or comment block, 
  recommended, as the vey last line in the file


  Recording Audio in React Native:
  https://hackernoon.com/recording-audio-in-react-native-ca1d3uc8
*/

import AudioRecorder from '../../components/AudioRecorder';


 /*
  Very important note about using "react-native-audio-recorder-player" !!!!!  
  After installing it with:
      npm i react-native-audio-recorder-player
  
  Go to "node-modules" in the project directory,
  then "react-native-audio-rcorder-player" => "android" 
  in this directory, open the "build.gradle" file 
  (only "build.gradle" file that resides in this directory!)
  In the file, go to "buildscript" section, then to "dependencies" secton.
  In this section thre is a classpath definition line 
  about the gradle version of the build:

      classpath 'com.android.tools.build:gradle:4.2.2'
  
  Just below the line, add this line exactly as it is:

      classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion"
    
  Dont change anything in this line, it's important to keep the double quotaition 
  marks

  Without this line,
  the project WILL CRASH when started in React native CLI 
  with "npx react-native run-android" (or "npm run android")

 */



// Audio recording implementation
//----------------------------------------------------------------


//----------------------------------------------------------------
const AudioRecordScreen = (props) => {

 const arpInitialState = {
  isLoggingIn: false,
  recordSecs: 0,
  recordTime: '00:00:00',
  currentPositionSec: 0,
  currentDurationSec: 0,
  playTime: '00:00:00',
  duration: '00:00:00',
  fileStatistics: {
    isStatasDidCome: undefined,
    filePath: '##############',
    fileSize: -1,
  }

};

const [arpState, setArpState] = useState(arpInitialState);

const [recordSecs, setSecs] = useState(arpInitialState.recordSecs);
const [recordTime, setRecordTime] = useState(arpInitialState.recordTime);
const [currentPositionSec, setCurrentPositionSec] = useState(arpInitialState.recordTime);
const [currentDurationSec, setCurrentDurationSec] = useState(arpInitialState.recordSecs);
const [playTime, setPlayTime] = useState(arpInitialState.recordSecs);
const [duration, setDuration] = useState(arpInitialState.recordSecs);
const [isRecordInProgress, setIsRecordInProgress] = useState(false);
const [isPlayInProgress, setIsPlayInProgress] = useState(false);

const [fileStatistics, setFileStatistics] = useState(arpInitialState.fileStatistics);


const recordingTimeIndicationRef = useRef(null);
const playingTimeIndicationRef = useRef(null);
const playProgressBarRef = useRef(null);

useEffect(()=>{
  let opacityRecordIndicator = 0;
  let opacityPlayIndicator = 0;

    if(arpState.isRecordInProgress) {
      opacityRecordIndicator = 1;
      opacityPlayIndicator = 0;
    } else {
      opacityRecordIndicator = 0;
    }
    if(arpState.isPlayInProgress) {  
      opacityPlayIndicator = 1;
      opacityRecordIndicator = 0;

    } else {
      opacityPlayIndicator = 0;
    }
    recordingTimeIndicationRef.current.setNativeProps({
      style: {
       opacity: opacityRecordIndicator,
     }
     });
     playingTimeIndicationRef.current.setNativeProps({
      style: {
       opacity: opacityPlayIndicator,
     }
     });
}, [arpState.isRecordInProgress, arpState.isPlayInProgress]);


const audioValues = {
  recordSecs,
  recordTime,
  currentPositionSec,
  currentDurationSec,
  playTime,
  duration,
  isRecordInProgress,
  isPlayInProgress,
  fileStatistics: {
    isStatasDidCome: undefined,
    filePath: undefined,
    fileSize: undefined,
  }

};

const audRecPlayCallBack = (currentAudioValues) => {

  setSecs(currentAudioValues.recordSecs);
  arpState.recordSecs = currentAudioValues.recordSecs;
  setRecordTime(currentAudioValues.recordTime);
  arpState.recordTime = currentAudioValues.recordTime;
  setCurrentPositionSec(currentAudioValues.currentPositionSec);
  arpState.currentPositionSec = currentAudioValues.currentPositionSec;
  setCurrentDurationSec(currentAudioValues.currentDurationSec);
  arpState.currentDurationSec = currentAudioValues.currentDurationSec;
  setPlayTime(currentAudioValues.playTime);
  arpState.playTime = currentAudioValues.playTime;
  setDuration(currentAudioValues.duration);
  arpState.duration = currentAudioValues.duration;
  setIsRecordInProgress(currentAudioValues.isRecordInProgress);
  arpState.isRecordInProgress = currentAudioValues.isRecordInProgress;
  setIsPlayInProgress(currentAudioValues.isPlayInProgress);
  arpState.isPlayInProgress = currentAudioValues.isPlayInProgress;

  setFileStatistics(currentAudioValues.fileStatistics);
  arpState.fileStatistics = currentAudioValues.fileStatistics;
};

const onScreenTextsInitilal = ['Plesse press "Record" for recording,', 'or "Play" for playing the previous record'];
const [onScreenTexts, setOnScreenTexts] = useState(onScreenTextsInitilal);

useEffect(() => {

  if(fileStatistics.isStatasDidCome === true) { 
    let texts = [
      'Recording finished.',
      `File location: ${fileStatistics.filePath}`,
      '\n',
      `File zise: ${fileStatistics.fileSize} bytes`,
  ];
    setOnScreenTexts(texts);
  } 
  if(fileStatistics.isStatasDidCome === false) {
    setOnScreenTexts(onScreenTextsInitilal);
  }

},
[fileStatistics]);

const displayOnScreenTexts = () => {
  let texts = '';
  for(let text of onScreenTexts) {
    texts += text + '\n';
  }
  return texts;
};

  return (
    <ImageBackground source={background} style={commonScreenStyles.backgroundImage}>

          <Text ref={recordingTimeIndicationRef} //absolute positioned
          style={[styles.recordPlayTimeIndication, {color: 'white'}]}>
              {arpState.recordTime}
          </Text>
          <Text ref={playingTimeIndicationRef}  //absolute positioned
          style={[styles.recordPlayTimeIndication, {color: 'red'}]}>
              {arpState.playTime}
          </Text>

        {/*
        <View ref={playProgressBarRef} style={styles.playProgressBar}>
          <Progress.Bar progress={0.8} width={Dimensions.get('window').width * 0.95} />
        </View>
        */}
        <View style={styles.fileStatsIndication}>
          <Text style={styles.fileStatsIndicationText}>{displayOnScreenTexts()}</Text>
        </View>

        
        <AudioRecorder audioValues={audioValues} 
         audRecPlayCallBack={(currentAudioValues) => audRecPlayCallBack(currentAudioValues)}
         />



        
        
    </ImageBackground>
  );
};
    
export default AudioRecordScreen;