import { useEffect , useRef , useState } from "react";
import React from 'react';
import  appMainBackground from './MainBackground2.jpg';
import atomicSymbol from './atomicSymbol.png';
import atomBrief from './atomBrief.png';
import coolAtomicNuclues from './atomic_nucleus_orange_grey.jpg';
import blackRedBallNucleus from './ball-Nucleus.jpg';
import gsap from "gsap";

// import other deved sources
import { TreatItemsInFocus } from "./TreatItemsInFocus";

export function TitleAndBackgroundCreation() {

    // get a reference to the nucleus object
    const referenceToAtomicSymbol = useRef( null );

    // top level usage of effect to animate the nucleus picture
    useEffect(() => {
        const symbolElement = referenceToAtomicSymbol.current;

        gsap.fromTo(
            symbolElement,
            {
                scale: 1,
                ease: 'power1.inOut'
            },
            {
                scale: 1.2,
                repeat: -1,
                yoyo: true,
                duration: 3,
                ease: 'back.inOut'
            }
        );

    }, []);  // activate this effect at first rendering the page title

    const refToExplicative = useRef( null );
    const [ isExplicativeExpandedFlag , setExplicativeFlag ] = useState( false );

    useEffect( () => {
        function listenToUpwardKey(hereEvent) {
            let atTheTimeInFocusElement = document . activeElement;
            // essential area
            if( atTheTimeInFocusElement . tagName === 'TEXTAREA' || atTheTimeInFocusElement . tagName === 'INPUT' )
                return;
            // break fucntion execution if element in focus is of type text area or input
            if (!isExplicativeExpandedFlag && hereEvent.key === 'ArrowUp') {
                setExplicativeFlag(true);
                gsap.to(refToExplicative.current, {
                  height: '100vh',
                  duration: 0.3,
                  onStart: () => {
                    refToExplicative.current.style.display = 'flex'; // Make the element flex container
                  },
                  onComplete: () => {
                    refToExplicative.current.style.opacity = 0.96; // Set opacity once animation is complete
                  }
                });
              }
            }
        
            document.addEventListener('keydown', listenToUpwardKey);
            return () => {
              document.removeEventListener('keydown', listenToUpwardKey);
            };
    } , [isExplicativeExpandedFlag] );

    // exit also on the down key
    useEffect( () => {
        function listenForDownwardKey( hereEvent ){
            let atTheTimeInFocusElement = document . activeElement;
            if( atTheTimeInFocusElement . tagName === 'TEXTAREA' || atTheTimeInFocusElement . tagName === 'INPUT' ){
                return;
            }
            // break execution if the key is used to navigate the input field or the textareas
            if( isExplicativeExpandedFlag && hereEvent . key === 'ArrowDown' ){
                setExplicativeFlag( false );
                gsap . to( refToExplicative . current , {
                    height: '0vh',
                    duration: 0.3,
                    onComplete: () => {
                        refToExplicative . current . style . display = 'none';
                        refToExplicative . current . opacity = 0;
                    },
                } );
            }
        }
        document . addEventListener( 'keydown' , listenForDownwardKey );
        return () => {
            document . removeEventListener( 'keydown' , listenForDownwardKey );
        }
    } , [isExplicativeExpandedFlag] );

    // listen to escape key to exit
    useEffect( ()=> {
        function listenToEscapeKeyToExit( escapeEvent ){
            if( isExplicativeExpandedFlag && escapeEvent . key === 'Escape' ){
                setExplicativeFlag( false );
                gsap . to( refToExplicative . current , {
                    height: '0vh',
                    width: '100vw',
                    duration: 0.3,
                    backgroundColor: '#333333',
                    opacity: 0,
                    onComplete: () => {
                        refToExplicative.current.style.display = 'none';
                    },
                });
            }
        }
        document . addEventListener( 'keydown' , listenToEscapeKeyToExit );
        return()=>{
            document . removeEventListener( 'keydown' , listenToEscapeKeyToExit );
        }
    } , [ isExplicativeExpandedFlag ] )


    // a function to create the title of the Application
    //what is inside title and whats the render return ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const whatIsInTitle = [ "DELILA" , 'MONITORING' , 'SYSTEM' ];
    function RenderTheTitle() {
        return whatIsInTitle.map((content, index) => (
            <label key={index} className="labelTitle">{content}</label>
        ));
    }
    return (
        <div id='body_of_monitor' className="body_of_monitor" style={{ background: `url(${appMainBackground})` }}>
            <div id='overlay' className="overlay">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' , gridColumn: '10px' }}>
                    <div id="title" className="title">
                        {RenderTheTitle()}
                    </div>
                    <div id="symbol" className="atomic_symbol">
                        <img ref={ referenceToAtomicSymbol } src={ atomBrief } alt='Atomic symbol representation' style={ { width: "400px" , height: '400px' , overflow: 'hidden' , display: 'block' } }></img>
                    </div>
                    <div className="description_of_app">
                        Powerful . Precise . Interactive 
                    </div>
                    <div className='start_app make_description_blink'>
                        Press 'up_key' key to start
                    </div>
                </div>
            </div>
            <div id='explicative' className="explicative" ref = { refToExplicative }>
                <p>This is the app provided for Delila</p>
                <p>It allows you to interogate and visualize data</p>
                <p>Check right-hand red menu for App details and how it works</p>
                <p>Check left-hand red menu for App features and start you analysis</p>
                <p className="exit_explicative exit_explicative_flashy">press `Esc` or `down_key` to exit this</p>
            </div>
        </div>
    );
}