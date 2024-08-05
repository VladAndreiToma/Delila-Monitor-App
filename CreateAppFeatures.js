import React from "react";
import { useState , useRef , useEffect } from "react";
import { gsap } from "gsap";
import MenuBg from './menuBG.jpg';
import { flushSync } from "react-dom";

// author: engr. Vlad Toma  ------------- GDED eli-np

// import the self deved children functionals
import { CommunicateWithServer } from './CommunicateWithServer';
import { DecideTheRefreshment } from './DecideTheRefreshment';
import { DecideTheLayout } from './DecideTheLayout';
import { CreateTheSelections } from './CreateTheSelections';
import { MakeReferences } from './MakeReferences';


export function CreateAppFeatures( { functionToSetServerResponse , functionToSetBoardConfiguration , functionToSetChannelsAssociated ,
   functionToSetArrayOfHistograms , functionToSetTheRows , functionToSetTheCols , functionToSetTheHours , functionToSetTheMinutes ,
   functionToSetTheSeconds , theBoards , theChannels , setupArray , serverResponse , functionToSetServerLink , theServerLink ,
   rowsValue , colsValue , hoursValue , minutesValue , secondsValue } ){
// references to the features menu strictly ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const referenceToFeatures = useRef( null ); // initially this instance points to null
    const referenceToFeaturesArrow = useRef( null );  // the same for arrow
    const referenceToFeaturesContent = useRef( null );
// state handler for features menu 
    const [ isExpandedFeatureMenu , setStateFeatureMenu ] = useState( false );  // no expansion state for the feature div initially  the linkage is mentioned inside the div creation

// render new states as user changes states
    useEffect(() => {
      gsap . to( referenceToFeatures . current ,{
        width: isExpandedFeatureMenu ? '400px' : '150px',
        duration: 0.5,
        onComplete: () =>{
          // on complete anonymous function is executed to return the arrow to the left now. Default 0 deg -> must be set to 180
          referenceToFeaturesArrow . current . style . transform = isExpandedFeatureMenu ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      } );
      gsap . to( referenceToFeaturesContent . current , {
        width: isExpandedFeatureMenu ? '300px' : '0px',
        duration: 0.6,
      } );
    }, [isExpandedFeatureMenu]);  // use the effect when the state of the div is changed
    
// function to change the state when i am clicking the arrow sign
    const handleFeatureClick = () =>{
      setStateFeatureMenu( prevFeatureState => !prevFeatureState );  // change the state of the parameter is expanded
    }

// drop the features menu back to shrink position with escape tab
    useEffect( () => {
      function handleEscapeOnFeatures( event ){
        if( isExpandedFeatureMenu && event . key === 'Escape' ){
          referenceToFeatures . current . style . width = '150px';
          referenceToFeaturesContent . current . style . width = '0px';
          referenceToFeaturesArrow . current . style . transform = 'rotate(0deg)';
          setStateFeatureMenu( false );
        }
      }
      document . addEventListener( 'keydown' , handleEscapeOnFeatures );
      return () => {
        document . removeEventListener( 'keydown' , handleEscapeOnFeatures );
      }
    } , [ isExpandedFeatureMenu ] );

// trigger expansion of feature menu with click of right arrow
    useEffect( () => {
      function handleRightArrowPressed( event ){
        if( !isExpandedFeatureMenu && event . key === 'ArrowRight' ){
          setStateFeatureMenu( true );
          gsap . to( referenceToFeatures . current , {
            width: isExpandedFeatureMenu ? '400px' : '150px',
            duration: 0.5,
            onComplete: () => {
              referenceToFeaturesArrow . current . style . transform = isExpandedFeatureMenu ? 'rotate(180deg)' : 'rotate(0deg)';
            }
          } );
          gsap . to( referenceToFeaturesContent . current , {
            width: isExpandedFeatureMenu ? '300px' : '0px',
            duration: 0.6,
          } );
        }
      }
      document . addEventListener( 'keydown' , handleRightArrowPressed );
      return () => {
        document . removeEventListener( 'keydown' , handleRightArrowPressed );
      }
    } , [ isExpandedFeatureMenu ] );


    useEffect( () => {
      console . log( "create app features server response: " , serverResponse );

    } , [ serverResponse ] )

// make return where i establish child form and structure with respect to arangement and styling
    return( 
        <div id = 'features_menu'    className="features_menu" ref={ referenceToFeatures }>
            <span id="features_sign_span" className="features_sign_span" ref={ referenceToFeaturesArrow } onClick={ handleFeatureClick }>➤</span>
            <div id = 'features_content' className="features_content" ref={ referenceToFeaturesContent }>
                {/*Send the references to children Components*/}
                <CommunicateWithServer  functionToSetServerResponse = { functionToSetServerResponse } functionToSetBoardConfiguration = { functionToSetBoardConfiguration }
                  functionToSetChannelsAssociated = { functionToSetChannelsAssociated } functionToSetArrayOfHistograms = { functionToSetArrayOfHistograms } functionToSetServerLink = { functionToSetServerLink } />
                <DecideTheRefreshment functionToSetTheHours = { functionToSetTheHours }  functionToSetTheMinutes = { functionToSetTheMinutes }
                  functionToSetTheSeconds = { functionToSetTheSeconds }/>
                <DecideTheLayout  functionToSetTheRows = { functionToSetTheRows }  functionToSetTheCols = { functionToSetTheCols }/>
                <CreateTheSelections theBoards = { theBoards } theChannels = { theChannels } setupArray = { setupArray }  serverResponse = { serverResponse } 
                  rowsValue = { rowsValue }  colsValue = { colsValue } hoursValue = { hoursValue }  minutesValue = { minutesValue }  secondsValue = { secondsValue }  serverLink = { theServerLink }  />
                <MakeReferences  theServerResponse={ serverResponse } theServerLink = { theServerLink }  theBoards = { theBoards } theChannels = { theChannels }  setupArray = { setupArray }/>
            </div>
        </div>
    );
}
