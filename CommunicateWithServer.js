// dev: engr. Vlad Andrei Toma - GDED

// The following script provides the animation and render effect for the server interogation. It allows user to retrieve configurations of experiment that are stored in json format and see whats
// inside before it goes to plotting and monitoring options this should be called from the CreateAppFeatures with some parameters as i want to see stuff in parent functionals
import React from "react";
import { useRef , useState , useEffect } from 'react';
import  gsap from "gsap";
import MenuBg from './menuBG.jpg';
import { flushSync } from "react-dom";

export function CommunicateWithServer( {functionToSetServerResponse , functionToSetBoardConfiguration , functionToSetChannelsAssociated , functionToSetArrayOfHistograms , functionToSetServerLink } ){
    
// so the above stuff are all texts we should use this named functions that in parent execute a set function

// states for clicking interogation or exit interogation
    const [ isInterogateCliked , setInterogateState ] = useState( false );
    const [ isExitInterogateClicked , setExitInterogate ] = useState( false );
    
// references to what i deal with in this page
    const refToInterogatePage = useRef( null );
    const refToInterogateContent = useRef( null );
    const refToExitInterogate = useRef( null );
    const refToWhereDevedInInterogation = useRef(   null    );
    const refToDevedByInInterogation = useRef(  null   );

// ref to input responses
    const refToServerInputField = useRef( null );
    const refToServerResponseField = useRef( null );
    const refToHowManyBoards = useRef( null );
    const refToHowManyChannels = useRef( null );

    const handleInterogateClick = () => {
      setInterogateState( prevInterogateState => !prevInterogateState );
      setExitInterogate( false );
    }; 

    const handleExitInterogateClick = () => {
      setExitInterogate( prevExitInterogate => !prevExitInterogate );
      setInterogateState( false );
    };

    useEffect( ()=>{
      gsap . to( refToInterogatePage . current , {
        height: isInterogateCliked ? '100vh' : '0vh',
        duration: 0.1,
        onComplete: () => {
          refToInterogateContent . current . style . display = isInterogateCliked ? 'block' : 'none';
          refToExitInterogate . current . style . display = isInterogateCliked ? 'block' : 'none';
          refToWhereDevedInInterogation . current . style . display = isInterogateCliked ? 'block' : 'none';
          refToDevedByInInterogation . current . style . display = isInterogateCliked ? 'block' : 'none';
        }
      } );
    } , [isInterogateCliked] );

    useEffect( () => {
      if( isExitInterogateClicked ){
        refToInterogatePage . current . style . height = '0vh';
        refToInterogateContent . current . style . display = 'none';
        refToExitInterogate . current . style . display = 'none';
        refToWhereDevedInInterogation . current . style . display = 'none';
        refToDevedByInInterogation . current . style . display = 'none';
      }else{}
    } , [isExitInterogateClicked] ); 

    useEffect(()=>{
      function handleEscape( event ){
        if( event . key === 'Escape' ){
          if( isInterogateCliked ){
            refToExitInterogate . current . style . display = 'none';
            refToInterogateContent . current . style . display = 'none';
            refToInterogatePage . current . style . height = '0vh';
            refToWhereDevedInInterogation . current . style . display = 'none';
            refToDevedByInInterogation . current . style . display = 'none';
            setInterogateState( false );
          }
        }
      }
      document . addEventListener('keydown' , handleEscape );
      return () => {
        document . removeEventListener( 'keydown' , handleEscape );
      }
    } , [isInterogateCliked]);

    async function HandleServerInterogation(){
      let doesServerHaveJSON;
      refToServerInputField . current . value . trim() . lastIndexOf( 'h.json' ) !== -1 ? doesServerHaveJSON = '' : doesServerHaveJSON = 'h.json';
      refToServerInputField . current . value = refToServerInputField . current . value . trim() + doesServerHaveJSON;

      functionToSetServerLink( refToServerInputField . current . value . trim() );  // set the link flag

      try{
        let theResponseFromServer = await fetch( refToServerInputField . current . value . trim() );  // i fetch from server address
        if( !theResponseFromServer . ok ){
          throw new Error( 'Something wrong with network response' );
        }
        // i retrieve the data in JSON format
        const retrievedData_JSONformat = await theResponseFromServer . json();  // from the response await for the json conversion format of data also make state for the total array -> useful later
        // i check if everything is ok with the data and if i have it
        if( retrievedData_JSONformat ){
          // everything is ok and data exists thus
          refToServerResponseField . current . value = 'Server Connection - SUCCESS. Configuration is retrieved';
          functionToSetServerResponse( "Server retrieval: SUCCESS" );   // -> set here so i can se in parent
          // lets check if the data is having children
          if( !( retrievedData_JSONformat . _childs && retrievedData_JSONformat . _childs . length > 0 ) ){
            alert( 'The retrieved json is emtpy and is not having first degree children' );
          }else{
            let theNamesOfHistograms = [];   // array like structure
            let theBoards = {};   // dictionary like structure
            // local cause they will be dropped after usage. With them i ll populate the flag state parameters in parent directory
            // i go over the nested children structure of the json and check for names
            retrievedData_JSONformat . _childs . forEach( firstChildOfJSON =>{
              if( firstChildOfJSON . _name . indexOf( 'Hist_' ) !== -1 ){
                // it contains object starting with Hist_
                // construct matcher for the name
                const HistogramObjectMatcher = firstChildOfJSON . _name . match( /Hist_Board(\d+)_Channel_(\d+)/ );
                theNamesOfHistograms . push( firstChildOfJSON . _name );
                if( HistogramObjectMatcher && HistogramObjectMatcher . length === 3 ){
                  let boardNo = HistogramObjectMatcher[1];
                  let channelNo = HistogramObjectMatcher[2];
                  if( !theBoards[ boardNo ] ){
                    theBoards[ boardNo ] = [];   // create a list for the board key that is not yet in the dictionary
                  }
                  theBoards[ boardNo ] . push( channelNo );   // i push the element inside for b# the corresponding number of ch is #   -> { [b0,ch32] , [b1,ch16] , so on... }
                }
              }
            } );
            // i finished the stepping over the whole retrieved data    so i make synchronous set function for the histograms
            functionToSetArrayOfHistograms( theNamesOfHistograms );
            // ok now i have the histograms names list which i should be able at this stage to see in the parent App.js
            // further on to extract the number of channels i need to get the length of boardNo location in the boards  so i ll use reduce which is a remaping array function
            const channelsCountedForEachBoard = Object . keys( theBoards ) . reduce( ( shortedVersion , boardNo ) => { 
              shortedVersion[ boardNo ] = theBoards[ boardNo ] . length;
              return shortedVersion;
            } , {} );
            // i extend using object primitives the dictionary{} inside the the variable and for each entry of the boards which is board number i assign in the new dictionary the entry with the same board no and the element stored will be the length which is indeed the total number of channels for that board
            // to make array of array i want to extract keys and values independently
            let theKeysInReducedDictionary = Object . keys( channelsCountedForEachBoard ); // primitive extractor function for keys
            let theValuesInReducedDictionary = Object . values( channelsCountedForEachBoard ); // primitive extractor for values

            // put mapped version into the corresponding input fields 
            let mappedBoards = theKeysInReducedDictionary . map( ( key ) => `Board${key}` );
            let mappedChannels = theKeysInReducedDictionary . map( ( key , index ) => `[B${key}-${theValuesInReducedDictionary[index]}ch]` );
        

            // set and display accordingly
            refToHowManyBoards . current . rows = Math . ceil( mappedBoards . length / 2 ) - 1;
            refToHowManyBoards . current . cols = 1;  // is in terms of elements which is one string
            refToHowManyChannels . current . rows = Math . ceil( mappedChannels . length ) - 1;
            refToHowManyChannels . current . cols = 1; // in terms of elements which is again one string
            
            refToHowManyBoards . current . value = '[' + mappedBoards + ']';
            functionToSetBoardConfiguration( mappedBoards );
            refToHowManyChannels . current . value = "[" + mappedChannels + "]";
            functionToSetChannelsAssociated( mappedChannels );
          
          }
        }
      }catch ( err ){
        alert( err . message );
        refToServerInputField . current . value = `Something wrong with server: ${ err . message }`;
      }

    }

    return(
        <>
            <label className="label_feature" onClick={handleInterogateClick}>Interogate</label>
            {/*above label is clickable and it should trigger the page with interogation details and structure*/}
  
            {/* i return the clickable label the other page content is on standby after to be shown or hidden*/}

            <div id='interogate_div' className='menu_divs' ref={ refToInterogatePage } style={{ background: `url(${MenuBg})` }}>
            <div id='interogate_content' className='content4Feature' ref={ refToInterogateContent }>
                Interogate your D.Aq. server.<br/>
                This step will extract experiment's configuration.<br/>
                You will retrieve the number of boards,<br/>
                and the channels for each board.
                <div style={ { justifyContent: 'center',  alignItems: 'center' }}>  
                    <input type='text' ref={ refToServerInputField } className='link_to_server_input' placeholder='Type server url here...' ></input>
                    <button id='interogate_server' className='button4Server' onClick={ HandleServerInterogation }>➤</button>
                </div>
                Server response:
                <div style={ { justifyContent: 'center',  alignItems: 'center', marginBottom: '10px' } }>
                    <input type='text' ref={ refToServerResponseField }  readOnly={true} className='link_to_server_input' style={{ cursor: 'pointer' }} placeholder='connection/retrieval status'></input>
                </div>
                You have in your configuration:
                <div style={{ justifyContent: 'center',  alignItems: 'flex-start', display: 'flex', flexDirection:'column' , gap: '10px' }}>
                    <input type="text" ref={ refToHowManyBoards }  readOnly={true} className='link_to_server_response' style={{ cursor: 'pointer' }} placeholder='Board`No` as list'></input>
                    <input type="text" ref={ refToHowManyChannels }   readOnly={true} className='link_to_server_response' style={{ cursor: 'pointer' }} placeholder='Board`No` with `No` channels as list'></input>
                </div>
                </div>
                <label id = 'exit_interogate' className = 'exit_menus' ref={ refToExitInterogate } onClick={ handleExitInterogateClick }>✖</label>
                <label className='about_app_label' style={ { top: '970px' , left: '850px' } } ref={ refToWhereDevedInInterogation }>in-house dev @ GDED</label>
                <label className='about_app_label' style={ { top: '970px' , left: '1350px' } } ref={ refToDevedByInInterogation }>powered by D.Aq. Team</label>
            </div>
            {/*above code provides the structure of the detailed interogation page*/}
        </>
    );
}