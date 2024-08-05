import React from "react";
import { useState , useEffect , useRef } from "react";
import gsap from "gsap";
import MenuBg from "./menuBG.jpg";
import { flushSync } from "react-dom";


export function CreateTheSelections( { theBoards , theChannels , setupArray , serverResponse ,
                                        rowsValue , colsValue , hoursValue , minutesValue , secondsValue , serverLink } ){
// logic to handle the exit and enter selections state  by useState hook
    const [ isSelectionClicked , setSelectionState ] = useState( false );   // boolean flag and setter
    const [ isExitSelectionClicked , setExitSelection ] = useState( false );    // boolean here as well
    const [ userSelections , setUserSelections ] = useState( [] );    // array state for selections

// references of stuff inside the page to be rendered
    const refToSelectionPage = useRef( null );
    const refToSelectionContent = useRef( null );
    const refToExitSelection = useRef( null );
    const refToWhereDevedInSelection = useRef( null );      const refToDevedByInSelection = useRef( null );

// references to handle the logic
    const referenceToBoardNavigator = useRef( null );

// function to handle the the page rendering
    const handleSelectionClick = () => {
      setSelectionState( prevSelState => !prevSelState );
      setExitSelection(  false  );
    };

// drop the page on clicking 'X' icon
    const handleExitSelection = () => {
      setExitSelection( prevExitSelState => !prevExitSelState );
      setSelectionState( false );
    };

// effect to show and drop the page content with animation 
    useEffect( () => {
      gsap . to( refToSelectionPage . current , {
        height: isSelectionClicked ? '100vh' : '0vh',
        duration: 0.1,
        onComplete: () => {
          refToSelectionContent . current . style . display =  isSelectionClicked ? 'block' : 'none';
          refToExitSelection . current . style . display = isSelectionClicked ? 'block' : 'none';
          refToWhereDevedInSelection . current . style . display = isSelectionClicked ? 'block' : 'none';
          refToDevedByInSelection . current . style . display = isSelectionClicked ? 'block' : 'none';
        }
      } );
    } , [isSelectionClicked] );

// effect for page drop
    useEffect(()=>{
      if( isExitSelectionClicked ){
        refToExitSelection . current . style . display = 'none';
        refToSelectionContent . current . style . display = 'none';
        refToSelectionPage . current . style . height = '0vh';
        refToWhereDevedInSelection . current . style . display = 'none';
        refToDevedByInSelection . current . style . display = 'none';
      }
    } , [isExitSelectionClicked]);

// drop page on escape event on keyboard
    useEffect( ()=>{
      function handleEscape( event ){
        if( event . key === 'Escape' ){
          if( isSelectionClicked ){
            refToExitSelection . current . style . display = 'none';
            refToSelectionContent . current . style . display = 'none';
            refToSelectionPage . current . style . height = '0vh';
            refToWhereDevedInSelection . current . style . display = 'none';
            refToDevedByInSelection . current . style . display = 'none';
            setSelectionState( false );
          }
        }
      }
      document . addEventListener( 'keydown' , handleEscape );
      return () => {
        document . removeEventListener( 'keydown' , handleEscape );
      }
    } , [isSelectionClicked] );

// a separate function to create a button grid of 8 by 4 display
    function CreateButtonGrid(){
        const buttonsPerOneInstanceIndividualSelector = Array . from( {length:32} );
        return (
          <div id = 'button_grid' className='button_grid'>
            {
              buttonsPerOneInstanceIndividualSelector . map( ( _ , index )  =>(
              <button onClick = { ButtonsInsideTheGrid_OnClick_Event_Listener }  id = {'button' + index} key = { 'button'+index } className='selection_button'></button> ))
            }
          </div>
        );
    }
// now everything is handled with respect to the animations lets do the logic behind

// an effect that sets the datasets of attributes for prevBoard , nextBoard , executed once at the first render
    useEffect(() => {
        document . getElementById( 'prevBoard' ) ? document . getElementById( 'prevBoard' ) . dataset . clicksOnPrevButton = 0 : console . error( "prev button not created" );
        document . getElementById( 'nextBoard' ) ? document . getElementById( 'nextBoard' ) . dataset . clicksOnNextButton = 0 : console . error( "next button not created" );
    } , [] );  // empty dependency array means one execution at render
    useEffect(() => {
        document . getElementById( 'prevSet' ) ? document . getElementById( 'prevSet' ) . dataset . clicksOnPrevSet = 0 : console . error( 'prev set is not created' );
        document . getElementById( 'nextSet' ) ? document . getElementById( 'nextSet' ) . dataset . clicksOnNextSet = 0 : console . error( 'next set is not created' );
    } , []);

    // debug only ------------------ // display for test purposes
    function displayHitsOnPrev(){
        document . getElementById( 'prevBoard' ) ? console . log( "prev clicks No: " , document . getElementById( 'prevBoard' ) . dataset . clicksOnPrevButton ) : console . log( 'button cannot be obtained' );
        // increase the clicks
        document . getElementById( 'prevBoard' ) . dataset . clicksOnPrevButton = ( parseInt( document . getElementById( 'prevBoard' ) . dataset . clicksOnPrevButton , 10 ) + 1 ) . toString();
    }
    function displayHitsOnNext(){
        document . getElementById( 'nextBoard' ) ? console . log( "next clicks No: " , document . getElementById( 'nextBoard' ) . dataset . clicksOnNextButton ) : console . log( 'button cannot be obtained' );
        document . getElementById( 'nextBoard' ) . dataset . clicksOnNextButton = ( parseInt( document . getElementById( 'nextBoard' ) . dataset . clicksOnNextButton , 10 ) + 1 ) . toString();
    }

// function to render the new board in focus to the user when clicking arrows 
// logic done for next and prev buttons


    let channelsNumberAssociatedForInFocusBoard = 0;
    let superiorChLimit = NaN , inferiorChLimit = NaN;

    function B_and_Ch_Indentificator( elementInChannelArray ){
      let extractorRegex = /B(\d+)-(\d+)ch/;   // as the form is B10-32ch for example 
      let matches = elementInChannelArray . match( extractorRegex );
      if( matches ){
        return [ parseInt( matches[1] , 10 ) , parseInt( matches[2] , 10 ) ];
      }else{
        return [ null , null ];
      }
    }

    function NextNavigation( brdNav ){
      RefreshButtons_upon_BoardNameChange();
      RestoreToNanTheLimits();
      if( brdNav . value . trim() === '' ){
        // no navigation was done -> assigning the first element from the boards
        brdNav . value = theBoards[0];
      }
      else{
        let brdIndex = theBoards . findIndex( board => board === brdNav . value . trim() );
        if( brdIndex === -1 ){
          alert( `Board ${theBoards[brdIndex]} is not in the list of boards` );
          return;
        }
        let [ bNo , chNo ] = B_and_Ch_Indentificator( theChannels[ brdIndex ] );
        console . log( "In next board: " , bNo , '---' , chNo );
        if( brdIndex === theBoards . length - 1 ){
          alert( "You reached NEXT limit in boards configuration" );
        }else{
          brdNav . value = theBoards[brdIndex + 1];
        }
      }
    }

    function PrevNavigation( brdNav ){
      RefreshButtons_upon_BoardNameChange();
      RestoreToNanTheLimits();
      if( brdNav . value . trim() === '' ){
        brdNav . value = theBoards[theBoards . length - 1];
      }
      else{
        let brdIndex = theBoards . findIndex( board => board === brdNav . value . trim() );
        if( brdIndex === -1 ){
          alert( `Board ${theBoards[brdIndex]} is not in the list of boards` );
          return;
        }
        let [ bNo , chNo ] = B_and_Ch_Indentificator( theChannels[ brdIndex ] );
        console . log( "In prev board: " , bNo , '---' , chNo );
        if( brdIndex === 0 ){
          alert( "You reached PREV limit in boards configuration" );
        }else{
          brdNav . value = theBoards[brdIndex - 1];
        }
      }
    }


    // a function to restore clicks on next set prev set for the channel selectors   i put them to zero , called when buttons boards are changed
    function RestoreToZeroNumberOfClicks(){
      document . getElementById( 'prevSet' ) . dataset . clicksOnPrevSet = '0';  // restore to default
      document . getElementById( 'nextSet' ) . dataset . clicksOnNextSet = '0';  // restore to defaultW
    }
// i restore limits to nan each time i change the board in discussion
    function RestoreToNanTheLimits(){
      inferiorChLimit = NaN;
      superiorChLimit = NaN
    }

    function DisplayNextBoard(){
      // 1st thing to do is to check that server comm was success
      switch( true ){
        case serverResponse . length === 0:
          alert( "Link to your server configuration before navigating" );
          break;
        case serverResponse . length > 0 && serverResponse . indexOf( 'SUCCESS' ) === -1:
          alert( "Something wrong with server communication. Can\'t navigate until fixing" );
          break;
        case serverResponse . length > 0 && serverResponse . indexOf( 'SUCCESS' ) !== -1:
          // succes is found so i can navigate insert logic here
          RestoreToZeroNumberOfClicks();
          NextNavigation( referenceToBoardNavigator . current );
          break;
        default:
          break;
      }
    }

    function DisplayPrevBoard(){
      // again check if linking to server is ok
       switch( true ){
        case serverResponse . length === 0:
          alert( "Link to your server configuration before navigating" );
          break;
        case serverResponse . length > 0 && serverResponse . indexOf( 'SUCCESS' ) === -1:
          alert( "Something wrong with server communication. Can\'t navigate until fixing" );
          break
        case serverResponse . length > 0 && serverResponse . indexOf( 'SUCCESS' ) !== -1:
          RestoreToZeroNumberOfClicks();
          PrevNavigation( referenceToBoardNavigator . current );
          break;
        default:
          break;
      }
    }


// a naming function for the buttons
    function NameButtons( infimum , supremum , afferentBoard , afferentChannels ){
      // go ovewr buttons and namet them bNo_chNo naming convention
      for( let index = 0 ; index < 32 ; ++ index ){
        document . getElementById( `button${index}` ) . textContent = index < afferentChannels ? `b${afferentBoard}_ch${infimum+index}` : `unprovided`;
      }
    }
    

    function RefreshButtons_upon_BoardNameChange(){
      for( let btnindex = 0 ; btnindex < 32 ; btnindex ++ ){
        document . getElementById( `button${btnindex}` ) . textContent = '';
        // just empty string so the button is cleared
      }
    }

    function NextSetGeneration(){
      // ok now make use of the generation function
      if( document . getElementById( 'nextSet' ) && document . getElementById( 'nextSet' ) . dataset . clicksOnNextSet === 0 && referenceToBoardNavigator . current . value . trim() === ''){
        alert( 'Navigate between boards first' );
      }
      else{
        let bIndex = theBoards . findIndex( b => b === referenceToBoardNavigator . current . value . trim() );
        let [bNo , chNo] = B_and_Ch_Indentificator( theChannels[ bIndex ] ); // i got the channels and the board no

        console . log( 'hello after extracting b and ch in next set' );

          console . log( 'hello inside first hit on next set' );
          if( chNo < 32  &&    parseInt(  document . getElementById( 'nextSet' )  . dataset .  clicksOnNextSet , 10  ) === 0  ){
            inferiorChLimit = 0;
            superiorChLimit = chNo;
            NameButtons( inferiorChLimit , superiorChLimit-1 , bNo , chNo );
          }
          else if( chNo >= 32 &&   parseInt(  document . getElementById( 'nextSet' ) . dataset . clicksOnNextSet , 10 ) === 0 ){
            inferiorChLimit = 0;
            superiorChLimit = 32;
            NameButtons( inferiorChLimit , superiorChLimit-1 , bNo , chNo );
          }
          //document . getElementById( 'nextSet' ) . dataset . clicksOnNextSet = ( parseInt( document . getElementById( 'nextSet' ) . dataset . clicksOnNextSet , 10 ) + 1 ) . toString();
        
          console . log( 'hello on successive hit on next set' );
          if( superiorChLimit < chNo && parseInt(  document . getElementById(  'nextSet'  )   . dataset  .  clicksOnNextSet , 10  ) > 0 ){
            inferiorChLimit += 32;
            superiorChLimit += 32;
            NameButtons( inferiorChLimit , superiorChLimit - 1 , bNo , chNo );
          }
          else if( superiorChLimit === chNo && ( parseInt( document . getElementById( 'nextSet' ) . dataset . clicksOnNextSet , 10 ) > 0  ||
                                                 parseInt( document . getElementById( 'prevSet' ) . dataset . clicksOnPrevSet , 10 ) > 0 )  ){
            alert( `for board${bIndex} with ${chNo} channels, you reached maximum allowed next presses` );
          }
          
        document . getElementById( 'nextSet' ) . dataset . clicksOnNextSet = ( parseInt( document . getElementById( 'nextSet' ) . dataset . clicksOnNextSet , 10 ) + 1 ) . toString();
        console . log( `debug inside next set: current set: ${inferiorChLimit} - ${superiorChLimit}` );
      }

    }

    function PrevSetGeneration(){
      console . log( "Hello inside the prev set function" );
      if( document . getElementById( 'prevSet' ) && document . getElementById( 'prevSet' ) . dataset . clicksOnPrevSet === 0 && referenceToBoardNavigator . current . value . trim() === '' ){
        alert( 'Navigate between boards first' );
      }
      else{
        let bIndex = theBoards . findIndex( b => b === referenceToBoardNavigator . current . value . trim() );        let [bNo , chNo] = B_and_Ch_Indentificator( theChannels[ bIndex ] );

          if( chNo < 32 && parseInt( document . getElementById( 'prevSet' ) . dataset . clicksOnPrevSet , 10 ) === 0 ){
            inferiorChLimit = 0;
            superiorChLimit = chNo;
            NameButtons( inferiorChLimit , superiorChLimit - 1 , bNo , chNo );
          }
          else if( chNo >= 32  &&    parseInt( document . getElementById( 'prevSet' ) . dataset . clicksOnPrevSet , 10 ) === 0 ){
            inferiorChLimit = chNo - 32;
            superiorChLimit = chNo;
            NameButtons( inferiorChLimit , superiorChLimit - 1 , bNo , chNo );
          }
          if( inferiorChLimit > 0   &&    parseInt( document . getElementById( 'prevSet' ) . dataset . clicksOnPrevSet , 10 ) > 0 ){
            inferiorChLimit -= 32;
            superiorChLimit -= 32;
            NameButtons( inferiorChLimit , superiorChLimit - 1 , bNo , chNo );
          }
          else if( inferiorChLimit === 0 && ( parseInt( document . getElementById( 'prevSet' ) . dataset . clicksOnPrevSet , 10 ) > 0   || 
                                              parseInt( document . getElementById( 'nextSet' ) . dataset . clicksOnNextSet , 10 ) > 0 )  ){
            alert( `for board${bIndex} with ${chNo} channels, you reached maximum allowed prev presses` );
          }

        document . getElementById( 'prevSet' ) . dataset . clicksOnPrevSet = ( parseInt( document . getElementById( 'prevSet' ) . dataset . clicksOnPrevSet , 10 ) + 1 ) . toString();
        console . log( 'click on prev set in prevset ' , document . getElementById( 'prevSet' ) . dataset . clicksOnPrevSet );
        console . log( `in prev set deug: current set: ${inferiorChLimit}-${superiorChLimit}` );
      }
    }

    // make a handler function that now account for button navigation -> keep it elegant
    function DisplayNextSetOfChannels(){
      switch( true ){
        case serverResponse . length > 0 && serverResponse . indexOf( 'SUCCESS' ) !== -1:
          // if the clicks on next are 0 start from the first chunck  &&  everything is ok
          NextSetGeneration();
          break;
        case serverResponse . length === 0:
          alert( 'interogate the server before naviagting through channels' );
          break;
        case serverResponse . length > 0 && serverResponse . indexOf( 'SUCCESS' ) === -1:
          alert( 'Something wrong in server communication. Can\'t navigate until fixing' );
        default:
          break;
      }
    }

    function DisplayPrevSetOfChannels(){
      switch( true ){
        case serverResponse . length === 0:
          alert( 'interogate the server before navigating through channels' );
          break;
        case serverResponse . length > 0 && serverResponse . indexOf( 'SUCCESS' ) !== -1:
          PrevSetGeneration();
          break;
        case serverResponse . length > 0 && serverResponse . indexOf( 'SUCCESS' ) === -1:
          alert( 'something wrong in server communication' );
          break;
        default:
          break;
       }
    }

    function Search_Inside_Setup_Array_And_Append( matcherObjForButton ){
      // so i recieve here the matcher object
      // now i can search in array
      // i must use regular expressions also here since there can be problems in identifying the numbers while for 12 i can also end up with 129 if i check with includes
      // so i must construct a generic extractor with any prefix
      let flexibelRegex = /(\d+)/g;
      for( let kindex = 0 ; kindex < setupArray . length ; ++ kindex ){
        let matchFromSetupArrayElement = setupArray[kindex] . match( flexibelRegex );
        if( matchFromSetupArrayElement && matchFromSetupArrayElement . length >= 2 ){
          //console . log( `extracted: b${matchFromSetupArrayElement[0]} and ch${matchFromSetupArrayElement[1]}` );

          if( parseInt( matcherObjForButton[1] , 10 ) === parseInt( matchFromSetupArrayElement[0] , 10 ) && 
              parseInt( matcherObjForButton[2] , 10 ) === parseInt( matchFromSetupArrayElement[1] , 10 ) ){
            // push inside the selectibles the stuff that you have
            // only if the board and channel values are the same
            flushSync( () =>{
              if( userSelections . indexOf( setupArray[kindex] ) === -1 )
                setUserSelections( ( prevUserState ) => [ ...prevUserState , setupArray[kindex] ] );
              else
                alert( 'You already selected that' );
            } );
            // i make sure of the sync manner 
          }
        }
      }
    }

    // to check for sync append i ll use effect to check
    
    useEffect( () => {
        console . log ( 'so far: ' , userSelections , ' with length: ' , userSelections . length );
    } , [ userSelections ] );

//a function that is the click event listener for the buttons in the grid
    function ButtonsInsideTheGrid_OnClick_Event_Listener( event ){
      // check for text content of currents target event
      let currentButton = event . currentTarget;
      if( currentButton . textContent . trim() . length > 0 && currentButton . textContent . trim() . indexOf('unprov') === -1 ){
         // append the object to the ploting batch  
         // call a function that searches the setuparray for the name
        let hereRegex = /b(\d+)_ch(\d+)/;
        let hereMatches = currentButton . textContent . trim() . match(hereRegex);
        if( hereMatches && hereMatches[1] && hereMatches[2] ){
          // first index is boolean return value
          Search_Inside_Setup_Array_And_Append( hereMatches );
        }
      }
    }


    // make a template function that creates the page as a template literal
    function Template_PageCreation_AsTemplateLiteral( histogramContentToBePlotted , rows , cols , refreshTime , pageCount ){
      // modify serverLink if it contains h.json
      let serverLinkCorrected = serverLink.includes('h.json') ? serverLink.replace('h.json', '') : serverLink;
      let extension = '/root.json';
      let theTemplate = `
            <!DOCTYPE html>
                <html>
                    <head>
                        <title>
                          Plot_Page_No${pageCount}
                        </title>
                    </head>
                    <body style="width: 100%; height: 100vh">
                        <div id="rootDiv" style="width: 100% ; height: 100% ; display: grid ; grid-template-columns: repeat(${cols} , 1fr); grid-template-rows: repeat(${rows} , 1fr) , gap: 1px">
                        </div>
                        <script type="module">
                            import { draw , redraw , httpRequest }  from 'https://root.cern/js/latest/modules/main.mjs';  // importing the apis functions from JSROOT website
                             const histogramContent = ${JSON.stringify(histogramContentToBePlotted)};
                              const rows = ${rows};
                              const cols = ${cols};
                              const refreshTime = ${refreshTime};
                              const serverLinkCorrected = '${serverLinkCorrected}';
                              const extension = '${extension}';

                              // Function to construct a unique URL
                              /*
                              function constructUniqueUrl(rows, cols, histogramContent, refreshTime) {
                                  let baseUrl = window.location.origin + window.location.pathname; // base URL of the current page
                                  let date = new Date().toISOString(); // current date and time in ISO format
                                  let histogramParams = encodeURIComponent(JSON.stringify(histogramContent));

                                  let uniqueUrl = \`\${baseUrl}?rows=\${rows}&cols=\${cols}&refreshTime=\${refreshTime}&histograms=\${histogramParams}&timestamp=\${date}\`;
                                  return uniqueUrl;
                              }

                              // Set the constructed URL to window.location.href only if it is a fresh load, not on beforeunload
                              if (!window.location.search) {
                                  let uniqueUrl = constructUniqueUrl(rows, cols, histogramContent, refreshTime);
                                  window.location.href = uniqueUrl;
                              }
                              */

                              // Handle beforeunload event to prevent the default action
                              window . addEventListener('beforeunload', (event) => {
                                  // Just a listener to handle custom logic if needed, doesn't set href
                                  event.preventDefault();
                              });

                            // firstly create the grid
                            for( let histoName of ${JSON . stringify( histogramContentToBePlotted )} ){
                              let miniDiv = document . createElement( 'div' );
                              miniDiv . id = 'divFor' + histoName;
                              document . getElementById( 'rootDiv' ) . appendChild( miniDiv );
                            }
                            for( let histoName of ${JSON . stringify( histogramContentToBePlotted )} ){
                                let ICjson = await httpRequest( '${serverLinkCorrected}' + histoName + '${extension}' , 'object' );
                                if( ICjson && document . getElementById( 'divFor' + histoName ) ){
                                    draw( document . getElementById( 'divFor' + histoName ) , ICjson , 'hist' );
                                }
                                let intervalID = setInterval( async() => {
                                    const Cjson = await httpRequest( '${serverLinkCorrected}' + histoName + '${extension}' , 'object' );
                                    if( Cjson && document . getElementById( 'divFor' + histoName ) ){
                                        redraw( document . getElementById( 'divFor' + histoName ) , Cjson , 'hist' );
                                    }    
                                } , ${refreshTime * 1000} );
                            }
                        </script>
                    </body>
                </html>
        `;
      return theTemplate;
    }
    
// making the function that divides the user's queue into chuncks and then creates the pages with data
// connect this to a go button afterwards 
    function Create_Independent_Pages_Based_On_Params_And_UserSelection(){
      console . log( 'Function to create pages triggered' );
        if( rowsValue === 0 || colsValue === 0 ){
          alert( 'You have 0 input in rows and/or cols. That is infinite pages. Change or leave default' );
          return;
        }
        console . log( 'input ok insidew the page creation' );
        // all ok proceed
        let pagination = rowsValue * colsValue;
        for( let k = 0 ; k < userSelections . length ; k = k + pagination ){
          let temporarySliceFromUserSelections = ( (k + pagination) < userSelections . length ) ? userSelections . slice( k , k + pagination ) : userSelections . slice( k , userSelections . length );
          console . log( 'current batch: ' + temporarySliceFromUserSelections );
          let indexOfMonitor = Template_PageCreation_AsTemplateLiteral( temporarySliceFromUserSelections , rowsValue , colsValue , (hoursValue*3600 + minutesValue*60 + secondsValue ) , parseInt( Math.floor( k / pagination ) + 1 ) );
          let encodedTemplate = encodeURIComponent( indexOfMonitor );
          let newPageURL = `newpage?content=${encodedTemplate}`;          
          // just try to open the page with the url here, see how it affects the context
          let newWindow = window . open( '' , "_blank" );
          // newWindow . name = `plot_page${k/pagination + 1}`;
          setTimeout( () => {} , 500 );       // wait for 500 ms
          newWindow . document . write( indexOfMonitor );   // write stuff
          newWindow . document . close();     // close stuff 
        }
        // after finishing ploting stuff make the userSelections empty
        flushSync( () => {
          setUserSelections( [] );
        } )
    }

// render this child component by  returning its stuff
    return(
    <>
        <label className='label_feature' onClick={handleSelectionClick}>Selections</label>
        
        {/* upper part label with clickable name and lowerpart stuff to be returned on the clickable page for selections*/}

        <div id = 'selection_div' className='menu_divs'    ref={ refToSelectionPage }   style={{ background: `url(${MenuBg})` }}>
            <div id = 'selection_content' className = 'content4Feature' ref={ refToSelectionContent } >
                The individual selector available here:
                <div style={{ marginLeft: '100px' , marginTop: '10px', marginBottom: '5px' }}>
                  Navigate between the boards first:
                </div>
                <div style={{width: '100%' , marginBottom: '10px' , display: 'flex' , flexDirection: 'row' , justifyContent: 'center' , alignItems: 'center', gap: '30px' }}>
                    <button id = 'prevBoard'   onClick={ DisplayPrevBoard }  style={ { borderRadius: '50%' , backgroundColor: '#333333' , width: '50px' , height: '50px' , color: 'whitesmoke' , fontSize: '30px' , cursor: 'pointer' } }>⇐</button>
                    <input type='text' ref={ referenceToBoardNavigator }  readOnly={true} className='boardNavigator'  placeholder={ 'Navigate between boards' }></input>
                    <button id = 'nextBoard'   onClick={ DisplayNextBoard }  style={ { borderRadius: '50%' , backgroundColor: '#333333' , width: '50px' , height: '50px' , color: 'whitesmoke' , fontSize: '30px' , cursor: 'pointer' } }>⇒</button>
                </div>
                <div style={ { marginLeft: '100px' } }>
                  Select the channel/s of interest:
                </div>
                <div style={ { width: '100%' , gap: '20px' , marginTop: '5px' , marginBottom: '20px' , display: 'flex' , flexDirection: 'row' , justifyContent: 'center' , alignItems: 'center' } }>
                    <button id = 'prevSet' onClick={ DisplayPrevSetOfChannels } style={{ cursor: 'pointer' , color: 'whitesmoke', width: '50px' , height: '50px' ,  borderRadius: '50%' , backgroundColor: '#333333' , fontSize: '30px'}}>⇐</button>
                    {   CreateButtonGrid()  }
                    <button id = 'nextSet' onClick={ DisplayNextSetOfChannels } style={ { cursor: 'pointer' , color: 'whitesmoke', width: '50px' , height: '50px' ,  borderRadius: '50%' , backgroundColor: '#333333' , fontSize: '30px' } }>⇒</button>
                </div>
                <div style={{ marginTop: '10px' , display: 'flex' , justifyContent: 'center' , alignItems: 'center' }}>
                    <button className = 'plot_all' id = 'plot_all'  onClick={ Create_Independent_Pages_Based_On_Params_And_UserSelection }>Go with selections</button>
                </div>
            </div> 
          <label id = 'exit_selection' className='exit_menus'  onClick={ handleExitSelection }   ref={ refToExitSelection } >✖</label>
          <label className='about_app_label' style={{ top: '970px' , left: '850px' }} ref={ refToWhereDevedInSelection }>in-house dev @ GDED</label>
          <label className='about_app_label' style={{ top: '970px' , left: '1350px' }} ref={ refToDevedByInSelection }>powered by D.Aq. Team</label>
        </div>
    </>
    );
}