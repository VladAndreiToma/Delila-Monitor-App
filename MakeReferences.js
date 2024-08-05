import gsap from "gsap";
import React from "react";
import { useState , useEffect , useRef } from "react";
import MenuBg from "./menuBG.jpg";
import { type } from "@testing-library/user-event/dist/type";
// import the page renderer
import { renderToStaticMarkup } from "react-dom/server";
import ReactDOMServer from 'react-dom/server';
import  {MakePage}  from "./MakePage";
import { isContentEditable } from "@testing-library/user-event/dist/utils";
import  ReactDOM, { flushSync } from 'react-dom';
import { BrowserRouter as Router , Routes , Route } from "react-router-dom";

export function MakeReferences( { theServerResponse, theServerLink , theBoards , theChannels , setupArray } ){

// using state handlers to make the animations for the page ----------------
    const[ isReferencesClicked , setReferencesState ] = useState( false );
    const[ isExitReferenceClicked , setExitReference ] = useState( false );

// state parameter to handle the selection on radio buttons 
    const [ theArrayOfRBSelections , setTheArrayOfRBSelections ] = useState( [] );
    const [ whatButtonWhichLimits , setWhatButtonWhichLimits ] = useState( [] );

// ref to page contents ----------------------------------------------------
    const refToReferencesPage = useRef( null ); // link in return code
    const refToReferencesContent = useRef( null );
    const refToExitReferences = useRef( null );
    const refToWhereDevedInReferences = useRef( null );
    const refToDevedByInReferences = useRef( null );

    const triggerStateChangeForReferenceClick = () => {
        setReferencesState( prevRState => !prevRState );
        setExitReference( false );
    };

    const triggerStateChangeForReferenceExit = () => {
        setExitReference( prevRState => !prevRState );
        setReferencesState( false );
    };

// animation for page
    useEffect( () => {
        gsap . to( refToReferencesPage . current , {
            height: isReferencesClicked ? '100vh' : '0vh',
            duration: 0.1,
            onComplete: () => {
                refToReferencesContent . current . style . display = isReferencesClicked ? 'block' : 'none';
                refToExitReferences . current . style . display = isReferencesClicked ? 'block' : 'none';
                refToDevedByInReferences . current . style . display = isReferencesClicked ? 'block' : 'none';
                refToWhereDevedInReferences . current . style . display = isReferencesClicked ? 'block' : 'none';
            }
        } );
    } , [isReferencesClicked] );

    useEffect( () => {
        if( isExitReferenceClicked ){
            refToReferencesPage . current . style . height = '0vh';
            refToReferencesContent . current . style . display = 'none';
            refToExitReferences . current . style . display = 'none';
            refToWhereDevedInReferences . current . style . display = 'none';       refToDevedByInReferences . current . style . display = 'none';
        }
    } , [ isExitReferenceClicked ] );

    useEffect( () => {
        function handleEscape( event ){
            if( isReferencesClicked && event . key === 'Escape' ){
                refToReferencesPage . current . style . height = '0vh';
                refToExitReferences . current . style . display = 'none';
                refToDevedByInReferences . current . style . display = 'none';
                refToWhereDevedInReferences . current . style . display = 'none';
                refToReferencesContent . current . style . display = 'none';
            }
        }
        document . addEventListener( 'keydown' , handleEscape );
        return() => {
            document . removeEventListener( 'keydown' , handleEscape );
            // always clean up
        }
    } , [ isReferencesClicked ] );


// -----------------------------------------------------------------------------------------

    let listOfRadiosAndLabels = [];  // something like an array of arrays like dictionary i ll store [ radio_id , labelcontent ]

    function TemplateConstructionForButtonsAndChannels( board , channelSet ){
        // i calculate the groups here
        const chInterval = 32;  // repeat with 32 interval
        let radioGroups = Math . ceil( channelSet / chInterval );

        function render_Radios( channelSet ){
            let radioButtonsList = [];
            let inferiorLimit = 0;
            for( let k = 0 ; k < radioGroups ; ++k ){
                let constructedRadioId = ( board + 'Group' + k ) . toString();
                listOfRadiosAndLabels . push( [ constructedRadioId , [ inferiorLimit , channelSet > chInterval ? inferiorLimit + chInterval - 1 : channelSet - 1  ] ] );
                ( k + chInterval ) < channelSet ? 
                radioButtonsList . push(<div key={ 'Group' + k }>
                                            <input id={ constructedRadioId } type="radio" style={{ width: '16px' , height: '16px' }}/>
                                            <label id = { ( 'labelFor' + board + 'Group' + k ) . toString() } htmlFor={ ( board + k + 'Group' ) . toString() } style={{ fontFamily:'monospace' , fontSize:'14px' , verticalAlign:'text-top' }}>{(`ch${inferiorLimit}-ch${inferiorLimit + chInterval - 1}` ) . toString()}</label> 
                                        </div> ) : 
                radioButtonsList . push(<div key={ 'Group' + k }>
                                            <input type="radio"  id={ constructedRadioId } style={{ width: '16px' , height: '16px' }}/>
                                            <label id = { ( 'labelFor' + board + 'Group' + k ) . toString() } htmlFor={ ( board + k + 'Group' ) . toString() }  style={{ fontFamily:'monospace' , fontSize:'14px' , verticalAlign:'text-top' }}>{ ( `ch${inferiorLimit}-ch${channelSet-1}` ) }</label>
                                        </div>);
                radioButtonsList . push(';');
                inferiorLimit += chInterval;
            }
            return <div style={{ display: 'flex' , gap:'5px' }}>{radioButtonsList}</div>;
        }
        return( 
            <div style={{ display:"flex" , flexDirection:'row' , gap:'10px' }}>
                <label style={ { fontFamily:"monospace" , fontSize:'16px' } } >{board + ':'}</label>
                { render_Radios( channelSet ) }
            </div>
         );
    }

    function Process_Setup_Information(fBoards, fChannels) {
        // local context so I don't alter the state of theBoards and theChannels 
        // boards is just an array of strings with name i ll keep that but for the channels i want a processing as it is a list of strigs with "[BNo_Noch]"
        const regexExtractorForChannels = /\[B(\d+)-(\d+)ch\]/;

        let processedChannels = fChannels . map( ( eachChInFchannel ) => (
            parseInt( eachChInFchannel . match( regexExtractorForChannels )[2] , 10 )
        ) ); 

        let theBoardStructure = (
            <ul style={ { gap:'20px' }  }>
                {fBoards.map( ( board , index ) => (
                    // Return the result of TemplateConstructionForButtonsAndChannels
                    <li key={board}>{TemplateConstructionForButtonsAndChannels( board , processedChannels[index] )}</li>
                ))}
            </ul>
        );
        return <>{theBoardStructure}</>;
    }

    useEffect( () => {
        Process_Setup_Information( theBoards , theChannels );
    } , [ theBoards , theChannels ] );

    function SearchJSONContentInsideRetrievedSetupArray( bNumber , limits , setupArray ){
        let histogramContent = setupArray.filter(item => {
            const boardMatch = item.match(/Hist_Board(\d+)_Channel_(\d+)/);
            if (boardMatch) {
                const boardNumber = parseInt(boardMatch[1], 10);
                const channelNumber = parseInt(boardMatch[2], 10);
                return boardNumber === bNumber && channelNumber >= limits[0] && channelNumber <= limits[1];
            }
            return false;
        });
        return histogramContent;
    }

    function CreatePageWithData(theServerLink, bNumber, limits, paginationRows, paginationCols , totalTime ) {
        let pageContent = SearchJSONContentInsideRetrievedSetupArray( bNumber , limits , setupArray );
        theServerLink = theServerLink . includes( 'h.json' ) ? theServerLink . replace( 'h.json' , '' ) : theServerLink;
        const extension = '/root.json';
        let content = `
            <!DOCTYPE html>
                <html>
                    <head>
                        <title>
                        </title>
                    </head>
                    <body style="width: 100%; height: 100vh">
                        <div id="rootDiv" style="width: 100% ; height: 100% ; display: grid ; grid-template-columns: repeat(${paginationCols} , 1fr); grid-template-rows: repeat(${paginationRows} , 1fr) , gap: 1px">
                        </div>
                        <script type="module">
                            import { draw , redraw , create , gStyle , httpRequest }  from 'https://root.cern/js/latest/modules/main.mjs';  // importing the apis functions from JSROOT website

                            // populate the page with content
                            window.addEventListener('beforeunload', (event) => {
                                event.preventDefault();
                                event.returnValue = '';
                            });

                            for( let index = 0 ; index < ${paginationCols} * ${paginationRows} ; ++ index ){
                                let divForHisto = document . createElement( 'div' );
                                divForHisto . id = 'divFor' + index;
                                document . getElementById( 'rootDiv' ) . appendChild( divForHisto );
                            }

                            // now set the properties of all the histograms that will be displayed here
                            
                            let commonIndex = 0;
                            for( let histoName of ${JSON . stringify( pageContent )} ){
                                if( commonIndex < ${paginationCols} * ${paginationRows} ){
                                    let ICjson = await httpRequest( '${theServerLink}' + histoName + '${extension}' , 'object' );
                                    if( ICjson && document . getElementById( 'divFor' + commonIndex ) ){
                                        // ICjson is basically the root representation of the object for which the json format was used so i can manipulate directly all the stuff directly there
                                        ICjson . fLineColor = 2;  //Red
                                        ICjson . fLineWidht = 2;  //Line Widt
                                        draw( document . getElementById( 'divFor' + commonIndex ) , ICjson , 'hist' );
                                    }
                                    let intervalID = setInterval( async() => {
                                        const Cjson = await httpRequest( '${theServerLink}' + histoName + '${extension}' , 'object' );
                                        if( Cjson && document . getElementById( 'divFor' + commonIndex ) ){
                                            // same reasoning for the collected json at interogation
                                            Cjson . fLineColor = 2;     // red color
                                            Cjson . fLineWidth = 2;     // bigger line
                                            redraw( document . getElementById( 'divFor' + commonIndex ) , Cjson , 'hist' );
                                        }    
                                    } , ${totalTime * 1000} );
                                }
                                commonIndex ++;
                            }
                        </script>
                    </body>
                </html>
        `;
        // just create a new dynamic page
        let newWindow = window . open( '' , '_blank' );
        setTimeout( () => {} , 500 )  // wait for 0.5s so that the page fully loads
        newWindow. document . write( content );
        newWindow . document . close(); // with this we make sure that the document is closed
    }

// function that handles the plot logic with respect to go button
    function Handle_Go_As_Plot_Function(){
        // se first what is selected and if thers is server interogation:
        if( listOfRadiosAndLabels . length === 0 ){
            alert( 'Can\'t plot if no selections were made' );
            return;
        }

        let defaultPaginationRows = 4;
        let defaultPaginationCols = 8;
        let defaultTime = 30 * 60;  // in seconds

        for( let contor = 0 ; contor < listOfRadiosAndLabels . length ; ++ contor ){
            if( document . getElementById( listOfRadiosAndLabels[contor][0] ) . checked ){
                // if the radio button in the list is checked then i have to include board and channels inside the toBePlotted array
                // [ boardname , [limits] ]
                console . log( listOfRadiosAndLabels[contor][0] );
                flushSync(()=>{
                    setTheArrayOfRBSelections( ( theArrayOfRBSelections ) => [ ...theArrayOfRBSelections , theArrayOfRBSelections.length+1 ] );
                });

                let matcherInBoard = listOfRadiosAndLabels[ contor ][0] . match( /Board(\d+)/ );   // so i match the board number so i know what to plot
                let boardInteger = parseInt( matcherInBoard[1] , 10 );

                flushSync(()=>{
                    setWhatButtonWhichLimits( ( whatButtonWhichLimits ) => [ ...whatButtonWhichLimits , [ boardInteger , listOfRadiosAndLabels[contor][1] ] ] );
                });

                console . log( `debug board number: ${boardInteger}` );
                CreatePageWithData( theServerLink , boardInteger , listOfRadiosAndLabels[contor][1] , defaultPaginationRows , defaultPaginationCols , defaultTime );
            } 
        }

    }

    useEffect(()=>{
        // nothing happens just retrigger the render
        console . log( "array of r.b. selections: -> " , theArrayOfRBSelections );
        console . log( "what board with which limits list: -> " , whatButtonWhichLimits );
    },[ theArrayOfRBSelections ]);

    return( 
        <>
        <label className="label_feature" onClick={ triggerStateChangeForReferenceClick }>References</label>

        { /*Separation of codes*/ }

        <div id='references_div' className="menu_divs" style={ { background: `url(${MenuBg})` , zIndex:'10'} } ref = { refToReferencesPage }>
            <div id='references_content' className="content4Feature" ref = { refToReferencesContent } >
                Reference selection is generated automatically on server interogation. It assumes chuncks of 32 channels by default or less, depending on how many channels, your boards have.
                { /* make use of conditional rendering here */ }
                <> 
                    { theServerResponse . trim() . indexOf( "SUCCESS" ) === -1 ? 
                        ( <p>But server was not interogated yet!</p> ) : 
                        ( Process_Setup_Information( theBoards , theChannels ) )
                    } 
                </>
                {/*to the go button ill link the page render i ll put some logic for it*/}
                <div style={{ marginLeft:'250px', width:'100%' , alignContent:"center" , display:'flex' }}><button id = "Go_Button_In_Reference" className="go_Reference" onClick={ Handle_Go_As_Plot_Function }>GO!</button></div>                    
                
                <label id='exit_references' className="exit_menus" ref = { refToExitReferences } onClick={ triggerStateChangeForReferenceExit }>✖</label>
                <label className="about_app_label" style={ { top: '970px' , left: '850px' } } ref = { refToWhereDevedInReferences }>in-house dev @ GDED</label>
                <label className="about_app_label" style={ { top: '970px' , left: '1350px' } } ref = { refToDevedByInReferences }>powered by D.Aq. Team</label>
            </div>
        </div>
        </> 
    );

}





/* <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>   babel imported for jsx interpretation */


 /*
        let newWindow = window.open(pageUniqueURL, '_blank', 'width=1500,height=950');
        newWindow.document.write(`
            <html>
                <head>
                    <title>Board${bNumber} - [ ${limits[0]} , ${limits[1]} ]</title>
                </head>
                <body>
                    <div id="root"></div>
                    <script src="https://unpkg.com/react/umd/react.production.min.js"></script>
                    <script src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"></script>
                    <script type="text">
                        const { React, ReactDOM } = window;
                        const MyMakePageComponent = () => (
                            ${ReactDOMServer.renderToStaticMarkup(<MakePage bNumber={bNumber} limits={limits} paginationRows={paginationRows} paginationCols={paginationCols} pageContent={dataContent} serverLink={theServerLink} />)}
                        );
                        ReactDOM.render(React.createElement( MyMakePageComponent ), document.getElementById('root'));
                    </script>
                </body>
            </html>
        `);
        newWindow.document.close();
        */  


        /* 
        // Get the page content based on radio buttons selected
        let dataContent = SearchJSONContentInsideRetrievedSetupArray(bNumber, limits, setupArray);
        // Call the template creation via function
        let pageUniqueURL = constructUniqueURL(bNumber, limits);
    
        let newWindow = window.open(pageUniqueURL, "_blank", 'width=1500,height=950'); // Open the window
    
        // Dynamically create window structure when document is loaded
        newWindow.onload = () => {
            let thisDoc = newWindow.document;
            // Create the document structure
            let thisHead = thisDoc.createElement('head');
            let thisBody = thisDoc.createElement('body');
            let thisTitle = thisDoc.createElement('title');
            let thisDiv = thisDoc.createElement('div');
    
            // Put stuff inside
            thisTitle.textContent = `Board${bNumber} - [ ${limits[0]} , ${limits[1]} ]`;
            thisDiv.id = 'root'; // This is the div that will support everything that comes from the make page function
    
            thisHead.appendChild(thisTitle); // Put title in head
            thisBody.appendChild(thisDiv);   // Put the root div inside the body
            thisDoc.head.appendChild(thisHead); // Head in document
            thisDoc.body.appendChild(thisBody); // Body in document
    
            // Load React modules
            const loadTheScript = (src) => {
                return new Promise((resolve, reject) => {
                    const script = thisDoc.createElement('script');
                    script.src = src;     // Use the sources of react
                    script.async = true;  // Make it asynchronous
                    script.onload = resolve; // Resolve flag as success loading the source
                    script.onerror = reject; // Same thing if something goes wrong
                    thisDoc.head.appendChild(script);
                });
            };
    
            const loadInlineContent = (thisContent) => {
                const script = thisDoc.createElement('script');
                script.type = 'text/javascript';
                script.textContent = thisContent;
                thisDoc.body.appendChild(script);
            };
    
            Promise.all([
                loadTheScript('https://unpkg.com/react/umd/react.production.min.js'),
                loadTheScript('https://unpkg.com/react-dom/umd/react-dom.production.min.js')
            ]).then(() => {
                const inlineScriptContent = `
                    const { React, ReactDOM } = window;
                    const MyMakePageComponent = () => (
                        ${ReactDOMServer.renderToStaticMarkup(<MakePage bNumber={bNumber} limits={limits} paginationRows={paginationRows} paginationCols={paginationCols} pageContent={dataContent} serverLink={theServerLink}/>)}
                    );
                    ReactDOM.render(React.createElement(MyMakePageComponent), document.getElementById('root'));
                `;
                loadInlineContent(inlineScriptContent);
            }).catch(error => {
                console.error('Error loading scripts:', error);
            });
        };
        */