import React from "react";
import { useState , useRef , useEffect } from "react";
import MenuBg from './menuBG.jpg';
import gsap from "gsap";
import { flushSync } from "react-dom";


export function DecideTheLayout( { functionToSetTheRows , functionToSetTheCols } ){

// state handlers for entering exiting layout menu
    const [ isLayoutClicked , setLayoutState ] = useState( false );
    const [ isExitLayoutClicked , setExitLayoutClicked ] = useState( false );

    const refToLayoutContent = useRef( null );
    const refToLayoutPage = useRef( null );
    const refToExitLayout = useRef( null );
    const refToWhereDevedInLayout = useRef(   null   );
    const refToDevedByInLayout = useRef(   null   );
// ref to fields ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const refToRowsInputField = useRef( null );
    const refToColsInputField = useRef( null );
    const refToKeepLayoutRB = useRef( null );
    const refToDropLayoutRB = useRef( null );
    const refToReadyInLayoutButton = useRef( null );


// title tiggering function
    const handleLayoutClick = () => {
      setLayoutState( prevLState => !prevLState );
      setExitLayoutClicked( false );
    };
// exit function
    const handleExitLayout = () => {
      setExitLayoutClicked( prevELState => !prevELState );
      setLayoutState( false );
    };

// expanding or shrinking effect
    useEffect( ()=>{
      gsap . to( refToLayoutPage . current , {
        height: isLayoutClicked? '100vh' : '0vh',
        duration: 0.1,
        onComplete: () => {
          refToLayoutContent . current . style . display =  isLayoutClicked ? 'block' : 'none';
          refToExitLayout . current . style . display = isLayoutClicked ? 'block' : 'none';
          refToWhereDevedInLayout . current . style . display = isLayoutClicked ? 'block' : 'none';
          refToDevedByInLayout . current . style . display = isLayoutClicked ? 'block' : 'none';
        }
      });
    } , [isLayoutClicked] );

    useEffect( () => {
      if( isExitLayoutClicked ){
        refToLayoutPage . current . style . height = '0vh';
        refToLayoutContent . current . style . display = 'none';
        refToExitLayout . current . style . display = 'none';
        refToWhereDevedInLayout . current . style . display = 'none';     refToDevedByInLayout . current . style . display = 'none';
      }
    } , [isExitLayoutClicked]);

// shrinking effect by pressing escape
    useEffect( () => {
      function handleEscape( event ){
        if( event . key === 'Escape' ){
          if( isLayoutClicked ){
            refToLayoutPage . current . style . height = '0vh';
            refToExitLayout . current . style . display = 'none';
            refToLayoutContent . current . style . display = 'none'
            refToWhereDevedInLayout . current . style . display = 'none';     refToDevedByInLayout . current . style . display = 'none';
            setLayoutState( false );
          }
        }
      }
      // atach function to the dom
      document . addEventListener('keydown' , handleEscape );
      return () => {
        document . removeEventListener( 'keydown' , handleEscape );
      }
    } , [isLayoutClicked]);

    function ReadyInLayout(){
      if( refToRowsInputField . current . value . trim() === '' || refToColsInputField . current . value . trim() === '' ){
        alert( 'provide input in rows/&columns input fields' );
        return;
      }
      functionToSetTheRows( parseInt( refToRowsInputField . current . value . trim() , 10 ) );
      functionToSetTheCols( parseInt( refToColsInputField . current . value . trim() , 10 ) );
    }


// return to render page and tag structure
    return(
        <>
            <label className='label_feature' onClick={handleLayoutClick}>Layout</label>

            {/*make the separation here on top the tag on bottom the logic of layout page*/}

            <div id='layout_div' className='menu_divs' ref={ refToLayoutPage } style={ { background: `url(${MenuBg})` } }>
            <div id = 'layout_content' className='content4Feature' ref={refToLayoutContent}>
                From here you can establish the looks of the individual monitoring page/pages.
                Type inside the input fields the layout that you want in terms of rows and columns.
                The final display will have a matrix like structure<br/>( rows ✖ columns ).
                <div style = {{ display: 'flex', alignItems: 'flex-start' , flexDirection: 'row' , gap: '10px', marginTop: '10px',   marginBottom: '10px'}}>
                <input id='rows_in_layout' ref={ refToRowsInputField } type = 'text' className='layout_input'  placeholder='rows here'></input>
                ✖
                <input id="cols_in_input" ref={ refToColsInputField } type = 'text' className='layout_input'  placeholder='columns here'></input>
                </div>
                (observation: rows and columns must be integers)<br/>
                Now you can choose to keep the foramt for future selections or refresh it automatically when configuration is plotted
                <div style={{ display:'flex', flexDirection: 'row' , alignItems: 'flex-start',  gap: '5px' }}>
                Keep the layout: 
                <input id='select_keep_layout' ref={ refToKeepLayoutRB } name='group0' className='radio_button' type='radio'></input>
                <span style={{ marginLeft: '60px' }}></span>
                Drop the layout:
                <input id='select_drop_layout' ref={ refToDropLayoutRB } name='group0' className='radio_button' type='radio'></input>
                </div>
                <button id="ready_in_layout" className='ready_in_layout' style={{ marginTop: '10px' }} ref = { refToReadyInLayoutButton }  onClick = { ReadyInLayout }>Ready</button>
            </div>
            <label id='exit_gridding' className='exit_menus' ref={ refToExitLayout } onClick={handleExitLayout}>✖</label>
            <label className='about_app_label' style={{ top: '970px' , left: '850px' }} ref={ refToWhereDevedInLayout }>in-house dev @ GDED</label>
            <label className='about_app_label' style={{ top: '970px' , left: '1350px' }} ref={ refToDevedByInLayout }>powered by D.Aq. Team</label>
            </div>
        </>
    );
}