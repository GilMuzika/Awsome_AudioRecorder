import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';

import commonScreenStyles from '../../screens/commonScreenStyles';
import styles from './styles';
import ButtonsDock from '../ButtonsDock';

import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


import AudioRecorderPlayer, { 
    AVEncoderAudioQualityIOSType,
    AVEncodingOption, 
    AudioEncoderAndroidType,
    AudioSet,
    AudioSourceAndroidType, 
   } from 'react-native-audio-recorder-player';

const permissionsGranter = require('./permissionsGranter');
import { PermissionsAndroid } from 'react-native';
const RNFS = require('react-native-fs');
import { stat } from 'react-native-fs';

//needs to be outside the component
const audioRecorderPlayer = new AudioRecorderPlayer();
audioRecorderPlayer.setSubscriptionDuration(0.09);
let pathToTheFile;



const AudioRecorder = ({ audioValues, audRecPlayCallBack, }) => {

    const [isRecordInProgress, setIsRecordInProgress] = useState(false);
    const [isPlayInProgress, setIsPlayInProgress] = useState(false);

    //--for interface buttons
    const [isRecordOn, setIsRecordOn] = useState(false);
    const [recordButtonBackground, setRecordButtonBackground] = useState({backgroundColor: 'blue'});
    const [recordButtonTitle, setRecordButtonTitle] = useState('Record');
    
    const [isPlayOn, setIsPlayOn] = useState(true);
    const [playButtonTitle, setPlayButtonTitle] = useState('Play');
    const [playButtonWhenTouchBackground, setplayButtonWhenTouchBackground] = useState({backgroundColor: '#4a4a4a'});
    
    const [stopButtonTitle, setStopButtonTitle] = useState('Stop');
    const [stopButtonBackground, setStopButtonBackground] = useState({backgroundColor: '#4a4a4a'});

    const [isPlayerPaused, setIsPlayerPaused] = useState(false);



    const onStartRecord = async() => {

        if(isPlayerPaused) {
          alert('The player is just paused, stop it firstly ro record');
          return;
        }

        audioValues.fileStatistics  = {
          isStatasDidCome: false,
          filePath: "###",
          fileSize: -1,
        };

        setIsRecordInProgress(true);
        audioValues.isRecordInProgress = true;
        audRecPlayCallBack(audioValues);

        let externalDirPath =  RNFS.ExternalDirectoryPath;
        const path = `${externalDirPath}/hello-${makeid(20)}.m4a`;
        const audioSet = {
            AudioEncoderAndroid : AudioEncoderAndroidType.AAC,
            AudioSourceAndroid : AudioSourceAndroidType.MIC,
            AVEncoderAudioQualityKeyIOS : AVEncoderAudioQualityIOSType.high,
            AVNumberOfChannelsKeyIOS : 2,
            AVFormatIDKeyIOS: AVEncodingOption.aac,
        };
        
        await permissionsGranter.grantPermissions(PermissionsAndroid);
        const uri = await audioRecorderPlayer.startRecorder(path, audioSet);

        audioRecorderPlayer.addRecordBackListener((e) => {
            audioValues.recordSecs = e.currentPosition;
            audioValues.recordTime = audioRecorderPlayer.mmssss(Math.floor(e.currentPosition));
            audRecPlayCallBack(audioValues);
        });
    };

    const onStopRecord = async() => {
      setIsRecordInProgress(false);
      audRecPlayCallBack(audioValues);

      try {
        
        pathToTheFile = await audioRecorderPlayer.stopRecorder();

        await AsyncStorage.setItem('pathToTheFile', pathToTheFile);
        audioRecorderPlayer.removeRecordBackListener();
      } catch (error) {
        console.log(error);
      }
        audioValues.recordSecs = 0;
        audRecPlayCallBack(audioValues);

        getFileStatistics();
    };

    const getFileStatistics = async() => {
      const path_ = await AsyncStorage.getItem('pathToTheFile');
      const statRezult = await stat(path_);
      const size = statRezult.size;
      audioValues.fileStatistics  = {
        isStatasDidCome: true,
        filePath: path_,
        fileSize: size,
      };
      audRecPlayCallBack(audioValues);
    };

    

    const onStartPlay = async() => {     

      setIsPlayerPaused(false);

      setIsPlayInProgress(true);
      
      pathToTheFile = await AsyncStorage.getItem('pathToTheFile');

      if(pathToTheFile === null) {
        alert('There are no rcords yet. Please create some');
        return;
      }
      if(pathToTheFile === undefined) {
        setIsPlayOn(false);
        setIsPlayInProgress(false);
        alert('Previously recorded file not found');
        return;
      }
        setIsPlayerPaused(false);
      
        setIsPlayInProgress(true);
        audioValues.isPlayInProgress = true;
        audRecPlayCallBack(audioValues);

        const pathToTheFileHere = pathToTheFile;
        const msg = await audioRecorderPlayer.startPlayer(pathToTheFileHere);
        audioRecorderPlayer.setVolume(1.0);
        audioRecorderPlayer.addPlayBackListener((e) => {
          if(e.currentPosition == e.duration) {
            alert('Playing finished');
            setIsPlayOn(true);
            setIsPlayInProgress(false);
            audioValues.isPlayInProgress = false;
            setStopButtonTitle('Stop');
            audioRecorderPlayer.stopPlayer();
          }

          audioValues.currentPositionSec = e.currentPosition;
          audioValues.currentDurationSec = e.duration;
          audioValues.playTime = audioRecorderPlayer.mmssss(Math.floor(e.currentPosition));
          audioValues.duration = audioRecorderPlayer.mmssss(Math.floor(e.duration));

          audRecPlayCallBack(audioValues);

        });
    };

    const onPausePlay = async() => {

      
      
      //setIsPlayOn(true);
      

      // dont send this value to the parent because pausing is not stopping, 
      // it will interfere with the boolean command from the stopping method
      // use special variable to prevent the recorder to start while the player is paused instead

      //setIsPlayInProgress(false);
      //audioValues.isPlayInProgress = false; 

      setIsPlayerPaused(true);

      await audioRecorderPlayer.pausePlayer();

      
    };

    const onStopPlay = async() => {
      setIsPlayInProgress(false);
      setIsPlayerPaused(false);

      setIsPlayOn(true);
      setIsPlayInProgress(false);
      audioValues.isPlayInProgress = false;

      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    };













    
    const onStartStopRecord_eventFunc = async () => {
      if(!isRecordOn) {
        if(!isPlayInProgress)  {
          setIsRecordOn(true);
          setRecordButtonBackground({backgroundColor: 'rgb(167, 21, 21)'});
          setRecordButtonTitle('Stop Rec.');
        }
        if(isPlayInProgress) {
          setIsRecordOn(false);
          setIsRecordInProgress(false);
          if(isPlayerPaused) {
            alert('The player is paused. Pausing is not considered as stopping, so playing still in progress');
            return;
          }
          alert('Playing still in progress');
          return;
        }
        await onStartRecord();        
      } else {
        setIsRecordOn(false);
        setRecordButtonBackground({backgroundColor: 'blue'});
        setRecordButtonTitle('Record');
        await onStopRecord();
      }
    
      //setIsRecordOn(currentValue => !currentValue);
      //setRecordButtonBackground(currentValue => !isRecordOn ? {backgroundColor: 'rgb(167, 21, 21)'} : {backgroundColor: 'blue'});
      //setRecordButtonTitle(currentValue => !isRecordOn ? 'Stop Rec.' : 'Record');
    
      //alert(recordButtonTitle);
    };
    
    const onStartPausePlay_EventFunc = async () => {
      if(isRecordInProgress) {
        setIsPlayOn(false);
        setIsPlayInProgress(false);
        setPlayButtonTitle('Play');
        setIsPlayOn(true);
        alert('Recording still in progress');
        return;
      }


      if(isPlayOn) {
        await onStartPlay();
      } else {
        await onPausePlay();
      }

      setIsPlayOn(currentValue => !currentValue);
      setPlayButtonTitle(currentValue => !isPlayInProgress ? 'Pause Play' : 'Play');
      setStopButtonTitle('Stop play');
    };
    
    const onStopPlay_EventFunc = () => {
      onStopPlay();
      setPlayButtonTitle('Play');
      setIsPlayOn(true);
      setInterval(() => {
        setStopButtonTitle('Stop');  
      }, 2000);
      setStopButtonTitle('Stopped');
    };    

  return (
    <View style={styles.buttonsDock}>
        <ButtonsDock
            isDockTranspatent={{backgroundColor: '#333333'}} //{backgroundColor: undefined} for transparent dock
            buttons = {[
            () => <MaterialCommunityIcons name={!isRecordInProgress ? 'record' : 'rectangle'} size={40} color={'white'}/> ,
            () => <MaterialCommunityIcons name={isPlayOn ? 'play' : 'pause'} size={40} color={'white'}/> ,
            () => <MaterialCommunityIcons name={'rectangle'} size={40} color={'white'}/> ,
            () => <MaterialCommunityIcons name="phone-hangup" size={40} color={'white'}/> ,
            () => <MaterialCommunityIcons name="phone-hangup" size={40} color={'white'}/> ,
            ]}
            buttonsNames = {[recordButtonTitle, playButtonTitle, stopButtonTitle, 'button 4', 'button5']}
            buttonsColorOverrideStyles = {[
                recordButtonBackground,
                playButtonWhenTouchBackground,
                stopButtonBackground, 
                {},
                {}
            ]}
            onPressFunctions = {[
              onStartStopRecord_eventFunc, 
              onStartPausePlay_EventFunc, 
              onStopPlay_EventFunc, 
              () => {}, 
              () => {}
            ]}
            onTouchStartEndFunctions = {[
              [()=>{setRecordButtonBackground({backgroundColor: '#5F62C1'})}, ()=>{}],
              [()=>{ setplayButtonWhenTouchBackground({backgroundColor: '#5F62C1'}) }, ()=>{setplayButtonWhenTouchBackground({backgroundColor: '#4a4a4a'})}],
              [()=>{setStopButtonBackground({backgroundColor: '#5F62C1'})}, ()=>{setStopButtonBackground({backgroundColor: '#4a4a4a'})}],
              [()=>{}, ()=>{}],
              [()=>{}, ()=>{}],
            ]}
        />    



    </View>
  );
};
    

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export default AudioRecorder;