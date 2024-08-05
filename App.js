// import styling all is in css
import './App.css';
import React from 'react';
import { useRef , useState , useEffect } from 'react';
import { gsap } from 'gsap';
import { flushSync } from 'react-dom';

// import dev made modules
import { TitleAndBackgroundCreation } from './TitleAndBackgroundCreation';
import { TreatItemsInFocus } from './TreatItemsInFocus';
import { CreateAppFeatures } from './CreateAppFeatures';
import { CreateAppMenu } from './CreateAppMenu';


function App() {

// main flag parameters to hold data across all children
// ~~~ for server comm ~~~~~~~~~~~~~~~~~
  const [ theServerLink_Parameter , SET_theServerLink_Parameter ] = useState( "" );
  const [ theServerResponse_Parameter , SET_theServerResponse_Parameter ] = useState( "" );    // use string state hook to register the response of the server
  const [ theBoardsConfiguration_Parameter , SET_theBoardsConfiguration_Parameter ] = useState( [] );
  const [ theChannelsAssociated_Parameter , SET_theChannelsAssociated_Parameter ] = useState( [] );
  const [ theTotalArrayOfHistograms_Parameter , SET_theTotalArrayOfHistograms_Parameter ] = useState( [] );
// ~~~ for griding ~~~~~~~~~~~~~~~~~~~~~
  const [ theRowsInGrid_Parameter , SET_theRowsInGrid_Parameter ] = useState( 5 );  // default integer 5
  const [ theColsInGrid_Parameter , SET_theColsInGrid_Parameter ] = useState( 5 );  // default integer 5
// ~~~ for refreshing ~~~~~~~~~~~~~~~~~~
  const [ theHoursInRefresh_Parameter , SET_theHoursInRefresh_Parameter ] = useState( 0 );  // default integer to 0h
  const [ theMinutesInRefresh_Parameter , SET_theMinutesInRefresh_Parameter ] = useState( 0 ); // default integer to 0mins
  const [ theSecondsInRefresh_Parameter , SET_theSecondsInRefresh_Parameter ] = useState( 10 );  // default integer to 10s 
  

  function developed_NamedFunction_SET_serverLink( newServerLink ){
    // i want synchr update
    flushSync( () => {
      SET_theServerLink_Parameter( newServerLink );
    } );
  }

  function developed_NamedFunction_SET_serverResponse( newServerResponse ){
    // i want synchronous update
    flushSync( () => {    
      SET_theServerResponse_Parameter( newServerResponse );   
    } );
  }

  function developed_NamedFunction_SET_boardConfiguration( newBoardsConfiguration ){
    // here i also want synchronous update
    flushSync( () => {
      // array in this case so make use of list splitting operator ...  as in newBoards i return an array
      SET_theBoardsConfiguration_Parameter( newBoardsConfiguration );
    } );
  }

  function developed_NamedFunction_SET_theChannelsAssociated( newChannelsAssociated ){
    // also synchronous updates
    flushSync( () => {
      SET_theChannelsAssociated_Parameter( newChannelsAssociated );
    } );
  }

  function developed_NamedFunction_SET_theArrayOfHistograms( newArrayOfHistograms ){
    // also synchronous updates
    flushSync( () => {
      SET_theTotalArrayOfHistograms_Parameter( newArrayOfHistograms );
    } );
  }

  function developed_NamedFunction_SET_theRows( newRows ){
    flushSync( () => {
      SET_theRowsInGrid_Parameter( newRows );
    } );
  }

  function developed_NamedFunction_SET_theCols( newCols ){
    flushSync( () => {
      SET_theColsInGrid_Parameter( newCols );
    } );
  }

  function developed_NamedFunction_SET_theHours( newHours ){
    flushSync( () => { 
      SET_theHoursInRefresh_Parameter( newHours );
    } );
  }

  function developed_NamedFunction_SET_theMinutes( newMinutes ){
    flushSync( () => {
      SET_theMinutesInRefresh_Parameter( newMinutes );
    } );
  }

  function developed_NamedFunction_SET_theSeconds( newSeconds ){
    flushSync( () => {
      SET_theSecondsInRefresh_Parameter( newSeconds );
    } );
  }

  useEffect( () => {
    console . log( 'the server response in main app:  ' , theServerResponse_Parameter );
  } );

  return(
    < div style={ { display: 'flex' , flexDirection: 'column' , justifyContent: 'center' , alignItems: 'center' } }>
      <TitleAndBackgroundCreation />
      <CreateAppMenu />
      <CreateAppFeatures  functionToSetServerResponse = { developed_NamedFunction_SET_serverResponse }  functionToSetBoardConfiguration = { developed_NamedFunction_SET_boardConfiguration } 
        functionToSetChannelsAssociated = { developed_NamedFunction_SET_theChannelsAssociated }  functionToSetArrayOfHistograms = { developed_NamedFunction_SET_theArrayOfHistograms } 
        functionToSetTheRows = { developed_NamedFunction_SET_theRows }  functionToSetTheCols = { developed_NamedFunction_SET_theCols } 
        functionToSetTheHours = { developed_NamedFunction_SET_theHours }  functionToSetTheMinutes = { developed_NamedFunction_SET_theMinutes }   
        functionToSetTheSeconds = { developed_NamedFunction_SET_theSeconds }  theBoards = { theBoardsConfiguration_Parameter }  
        theChannels = { theChannelsAssociated_Parameter }   setupArray = { theTotalArrayOfHistograms_Parameter } 
        serverResponse = { theServerResponse_Parameter }  functionToSetServerLink = { developed_NamedFunction_SET_serverLink }  theServerLink = { theServerLink_Parameter }
        rowsValue = { theRowsInGrid_Parameter }  colsValue = { theColsInGrid_Parameter }   hoursValue = { theHoursInRefresh_Parameter } 
        minutesValue = { theMinutesInRefresh_Parameter }   secondsValue = { theSecondsInRefresh_Parameter } />
    </div>
  );
}

export default App;
