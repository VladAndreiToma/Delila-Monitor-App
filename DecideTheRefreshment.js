import React from "react";
import { useState , useRef , useEffect } from "react";
import gsap from "gsap";
import { flushSync } from "react-dom";
import MenuBg from './menuBG.jpg';

export function DecideTheRefreshment( { functionToSetTheHours , functionToSetTheMinutes , functionToSetTheSeconds } ){
    
// states to decide rather i render the refreshment structure or not~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const [ isRefreshingClicked , setRefreshingState ] = useState( false );   // set the flag an state function to bool type
    const [ isExitRefreshingClicked , setExitRefresh ] = useState( false );  // set the flag and state function to bool type also here

// refs to the refresment page itself~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const refToRefreshingPage = useRef( null );
    const refToRefreshingContent = useRef( null );
    const refToRefreshingExit = useRef( null );
    const refToWhereDevedInRefresh = useRef( null );
    const refToDevedByInRefresh = useRef( null );
    
// refs to the stuff inside ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const refToRefreshHours = useRef( null );
    const refToRefreshMinutes = useRef( null );
    const refToRefreshSeconds = useRef( null );
    const refToReadyInRefreshButton = useRef( null );

// refs to field of layout ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const handleRefreshingClick = () => {
      setRefreshingState( prevRstate => !prevRstate );
      setExitRefresh( false );
    }

    const handleRefreshExitClick = () => {
      setExitRefresh( prevExitRstate => !prevExitRstate );
      setRefreshingState( false );
    }

// expand or shringk menu effect ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    useEffect(()=>{
      gsap . to( refToRefreshingPage . current , {
          height: isRefreshingClicked ? '100vh' : '0vh',
          duration: 0.1,
          onComplete: () => {
            refToRefreshingContent . current . style . display = isRefreshingClicked ? 'block' : 'none';
            refToRefreshingExit . current . style . display = isRefreshingClicked ? 'block' : 'none';
            refToDevedByInRefresh . current . style . display = isRefreshingClicked ? 'block' : 'none';
            refToWhereDevedInRefresh . current . style . display = isRefreshingClicked ? 'block' : 'none';
          }
      } );
    } , [isRefreshingClicked]);

    useEffect(()=>{
      if( isExitRefreshingClicked ){
        refToRefreshingContent . current . style . display = 'none';
        refToRefreshingExit . current . style . display = 'none';
        refToRefreshingPage . current . style . height = '0vh';
        refToWhereDevedInRefresh . current . style . display = 'none';
        refToDevedByInRefresh . current . style . display = 'none';
      }
    } , [isExitRefreshingClicked])

// shrink effect on escape ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    useEffect(()=>{
      function handleEscape( event ){
        if( event . key === 'Escape' ){
          if( isRefreshingClicked ){
            refToRefreshingPage . current . style . height = '0vh';
            refToRefreshingContent . current . style . display = 'none';
            refToRefreshingExit . current . style . display = 'none';
            refToDevedByInRefresh . current . style . display = 'none';
            refToWhereDevedInRefresh . current . style . display = 'none'; 
            setRefreshingState( false );
          }
        }
      }
      document . addEventListener('keydown' , handleEscape );
      return () => {
        document . removeEventListener( 'keydown' , handleEscape );
      }
    } , [isRefreshingClicked]);

    function ReadyInRefresh(){
      if( refToRefreshHours . current . value . trim() !== '' || refToRefreshMinutes . current . value . trim() !== '' || refToRefreshSeconds . current . value . trim() !== '' ){
        functionToSetTheHours( parseInt( refToRefreshHours . current . value . trim() , 10 ) );
        functionToSetTheMinutes( parseInt( refToRefreshMinutes . current . value . trim() , 10 ) );
        functionToSetTheSeconds( parseInt( refToRefreshSeconds . current . value . trim() , 10 ) );
        // so when ready button is hit , i parase values in the input fields to their corresponding integer and then i set them with the callback function so they are seen in parent
      }
      else{
        alert( "Give a refreshment time input. Time interval after which your monitor reupdates" );
      }
    }

    // here i return the stuff
    return( 
        <>
            <label className='label_feature' onClick={handleRefreshingClick}>Refreshing</label>

            {/*i also separate the stuff*/}


            <div id='refreshing_div' className='menu_divs' ref = {refToRefreshingPage} style={{ background: `url(${MenuBg})` }} >
                <div id='refreshing_content' className='content4Feature' ref={refToRefreshingContent}>
                    Refreshing rate can be established from here. You can decide it is either:<br/>(second/seconds), (minute/minutes) or even (hour/hours)<br/>
                    Complete the fields accordingly
                    <div style={{ marginTop: '10px', display: 'flex' , flexDirection: 'row' , alignItems: 'flex-start' , gap: '10px' }}>
                    <input id = 'hoursInput'   ref={ refToRefreshHours }  type='text' className='refreshing_input' placeholder='how many hours?' ></input>
                    :
                    <input id = 'minutesInput'   ref={ refToRefreshMinutes }  type='text' className='refreshing_input' placeholder='how many minutes?'></input>
                    :
                    <input id = 'secondsInput'   ref={ refToRefreshSeconds }    type='text' className='refreshing_input' placeholder='how many seconds?'></input>
                    </div>
                    <div style={{ marginBottom: '10px' , marginTop: '10px' , display: 'flex' , flexDirection: 'row' , alignItems: 'flex-start' }}>
                    <button id='ready_in_refresh'  className='ready_in_refresh' onClick={ ReadyInRefresh }  ref = { refToReadyInRefreshButton } >Ready</button>
                    </div> 
                </div>
                <label id='exit_refreshing' className='exit_menus' ref={ refToRefreshingExit } onClick={ handleRefreshExitClick }>✖</label>
                <label className='about_app_label' style={ { top:'970px' , left: '850px' } } ref = { refToWhereDevedInRefresh }>in-house dev @ GDED</label>
                <label className='about_app_label' style={ { top:'970px' , left: '1350px' } } ref={ refToDevedByInRefresh }>powered by D.Aq. Team</label>
            </div>
        </> 
    );
}