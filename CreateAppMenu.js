import React from "react";
import { useState , useRef , useEffect } from "react";
import gsap from "gsap";
import MenuBg from './menuBG.jpg';
import { flushSync } from "react-dom";


export function CreateAppMenu( {} ){
    // getting refferences to dom elements
    const referenceToMenu = useRef( null );
    const referenceToMenuArrow = useRef( null );
    const referenceToMenuContent = useRef( null );
    const homeMenuRef = useRef( null );
    const homePageRef = useRef( null );
    const homeContentRef = useRef( null );
    const homeExitRef = useRef( null );
    const whereRef = useRef( null );
    const byRef = useRef( null );

    // creating state handlers for menu sliding div
    const [ isExpandedAppMenu , setStateAppMenu ] = useState( false );    // bool flag plus bool function that changes the flag
    
    useEffect(() => {
        const toAppMenu = referenceToMenu . current;
        const toAppMenuArrow = referenceToMenuArrow . current;
        const toAppMenuITSELF = referenceToMenuContent . current;
        gsap . to( toAppMenu , {
          width: isExpandedAppMenu ? '400px' : '150px' ,
          duration: 0.5,
          onComplete: () => {
            toAppMenuArrow . style . transform = isExpandedAppMenu ? 'rotate(180deg)' : 'rotate(0deg)';
          }
        } );
        gsap . to( toAppMenuITSELF , {
          width: isExpandedAppMenu ? '300px' : '0px',
          duration: 0.6,
        } );
    } , [ isExpandedAppMenu ] );   // we use effect depending on the state of isExpandedAppMenu  with an anonymous function


    /// make app menu shrink at the press of escape
    useEffect( () => {
      function handleEscape( event ){
        if( event . key === 'Escape' ){
          if( isExpandedAppMenu ){
            referenceToMenu . current . style . width = '150px';
            referenceToMenuContent . current . style . width = '0px';
            referenceToMenuArrow . current . style . transform = 'rotate(0deg)';
            setStateAppMenu( false );
          }
        }
      }
      document . addEventListener( 'keydown' , handleEscape );
      return () => {
        document . removeEventListener( 'keydown' , handleEscape );
      }
    } , [ isExpandedAppMenu ] );

    /// make the app menu pop at the pres of left arrow like you drag from right to left the contents
    useEffect( () => {
      function handleLeftArrowPress( event ){
        if( event . key === 'ArrowLeft' && ! isExpandedAppMenu ){
          setStateAppMenu( true );
          gsap . to( referenceToMenu . current , {
            width: isExpandedAppMenu ? '400px' : '150px',
            duration: 0.5,
            onComplete: () => {
              referenceToMenuArrow . current . style . transform = isExpandedAppMenu ? 'rotate(180deg)' : 'rotate(0deg)';
            }
          });
          gsap . to( referenceToMenuContent . current , {
            width: isExpandedAppMenu ? '300px' : '0px',
            duration: 0.6,
          } );
        }
      }
      document . addEventListener( 'keydown' , handleLeftArrowPress );
      return () => {
        document . removeEventListener( 'keydown' , handleLeftArrowPress );
      }
    } , [ isExpandedAppMenu ] );


    const handleMenuClick = () =>{
      setStateAppMenu( prevMenuState => !prevMenuState  );
    }

    // create a state handler for when clicking on Home
    const[ isHomeClicked , setHomeClickedState ] = useState( false );    // start from the premise that home is not clicked as it would be logic to assume
    useEffect(() => {
      //const pointerToHome = homeMenuRef . current;    // to this i link the expansion event
      const pointerToContent = homeContentRef . current;  // content is what is written in the blured div
      const pointerToExit = homeExitRef . current;   // exit button
      const pointerToPage = homePageRef . current;   // page with nice background
      gsap . to( pointerToPage , {
        height: isHomeClicked ? '100vh' : '0vh',
        duration: 0.1,
        onComplete: () => {
          // render on completion the div and the label and the x
          pointerToContent . style . display = isHomeClicked ? 'block' : 'none';
          pointerToExit . style . display = isHomeClicked ? 'block' : 'none';
          whereRef . current . style . display = isHomeClicked ? 'block' : 'none';
          byRef . current . style . display = isHomeClicked ? 'block' : 'none';
        }
      } );
    },[ isHomeClicked ]);

    const handleHomeClick = () => {
      setHomeClickedState( prevHomeState => !prevHomeState );
      setExitHomeState( false );
    }

    const[ isExitHomeClicked , setExitHomeState ] = useState( false );
    useEffect( () => {
      // i use event listener with effect with respect to clicking the x button in home   ======> collapse everything
      if( isExitHomeClicked ){
        homeContentRef . current . style . display = 'none';
        homeExitRef . current . style . display = 'none';
        whereRef    . current . style . display = 'none';
        byRef       . current . style . display = 'none';
        homePageRef . current . style . height = '0vh'; 
      }else{}
    }, [ isExitHomeClicked ] ); 

    const handleHomeExitClick = () => {
      setExitHomeState( prevExitHomeState => !prevExitHomeState );
      setHomeClickedState( false );
    }

    useEffect(()=>{
      function handleEscape( event ){
        if( event . key === 'Escape' ){
          if( isHomeClicked ){
            homeContentRef . current . style . display = 'none';
            homeExitRef . current . style . display = 'none';
            homePageRef . current . style . height = '0vh';
            setHomeClickedState( false );
          }
        }
      }
      document . addEventListener('keydown' , handleEscape );
      return () => {
        document . removeEventListener( 'keydown' , handleEscape );
      }
    } , [isHomeClicked]);


    // we use boolean for the state handler of about menu
    const[ isAboutClicked , setAboutClicked ] = useState( false );
    // get also some references
    const refToAbout = useRef( null );
    const refToAboutPage = useRef( null );
    const refToAboutContent = useRef( null );
    const refToExitAbout = useRef( null );
    const whereRefAbout = useRef( null );
    const byRefAbout = useRef( null );
  
    // a state handler for the exiting about
    const[ isExitAboutClicked , setExitAbout ] = useState( false );

    useEffect( () => {
      gsap . to( refToAboutPage . current , {
        height: isAboutClicked ? '100vh' : '0vh',
        duration: 0.1,
        onComplete: () =>{
          refToAboutContent . current . style . display = isAboutClicked ? 'block' : 'none';
          refToExitAbout . current . style . display = isAboutClicked ? 'block' : 'none';
          whereRefAbout . current . style . display = isAboutClicked ? 'block' : 'none';
          byRefAbout . current . style . display = isAboutClicked ? 'block' : 'none';
        }
      }); 
    } , [isAboutClicked] );

    const handleAboutClick = () => {
      setAboutClicked( prevAboutState => !prevAboutState );
      setExitAbout( false );
    } 

    const handleAboutExit = () => {    
      setExitAbout( prevExitAbout => !prevExitAbout );
      setAboutClicked( false );
    }

    useEffect( () => {
      if( isExitAboutClicked ){
          setAboutClicked( false );
          refToAboutPage . current . style . height = '0vh';
          refToAboutContent . current . style . display = 'none';
          refToExitAbout . current . style . display = 'none';
          whereRefAbout . current . style . display = 'none';
          byRefAbout . current . style . display = 'none';
      }
    } , [isExitAboutClicked] );

    useEffect( () => {
      function handleEscape( event ){
        if( event . key === 'Escape' ){
          if( isAboutClicked ){
            setAboutClicked( false );
            refToAboutPage . current . style . height = '0vh';
            refToAboutContent . current . style . display = 'none';
            refToExitAbout . current . style . display = 'none';
            whereRefAbout . current . style . display = 'none';
            byRefAbout . current . style . display = 'none';
          } 
        }
      }
      document . addEventListener( 'keydown' , handleEscape );
      return () => {
        document . removeEventListener( 'keydown' , handleEscape );
      }
    } , [isAboutClicked]);


  /// same logic for handling the new page
    // declare a state parameter and a state function
    const [ isNewClicked , setNewClicked ] = useState( false );     // boolean flag and set function
    // declare bool flag and set function for the exit new
    const [ isExitNew , setExitNew ] = useState( false );
    // ref for page content and exit sign
    const refToNewPage = useRef( null ); 
    const refToNewContent = useRef( null );
    const refToNewExit = useRef( null ); 

    const whereRefNew = useRef( null );
    const byRefNew = useRef( null );

    const handleNewClick = () => {
      setExitNew( false );
      setNewClicked( prevNewState => !prevNewState );
    }

    const handleExitNew = () => {
      setNewClicked( false );
      setExitNew( prevExitNew => !prevExitNew );
    }

    useEffect( () => {
      // introduce animation for page and content
      gsap . to( refToNewPage . current , {
        height: isNewClicked ? '100vh': '0vh',
        duration: 0.1,
        onComplete: () => {
          refToNewContent . current . style . display = isNewClicked ? 'block' : 'none';
          refToNewExit . current . style . display = isNewClicked ? 'block' : 'none';
          whereRefNew . current . style . display =  isNewClicked ? 'block' : 'none';
          byRefNew . current . style . display = isNewClicked ? 'block' : 'none';
        }
      } );
    } , [ isNewClicked ] );  // whenever this is true it triggers the effect

    useEffect( () => {
      if( isExitNew ){
        refToNewPage . current . style . height = '0vh';
        refToNewContent . current . style . display = 'none';
        refToNewExit . current . style . display = 'none';
        whereRefNew . current . style . display = 'none';
        byRefNew . current . style . display = 'none';
        setNewClicked( false );
      }
    } , [ isExitNew ] );

    useEffect( () => {
      function handleEscapeOnNew( event ){
        if( isNewClicked && event . key === 'Escape' ){
          refToNewContent . current . style . display = 'none';
          refToNewPage . current . style . height = '0vh';
          refToNewExit . current . style . display = 'none';
          whereRefNew.  current . style . display = 'none';
          byRefNew . current . style . display = 'none';
          setNewClicked( false );
        }
      }
      document . addEventListener( 'keydown' , handleEscapeOnNew );
      return() => {
        document . removeEventListener( 'keydown' , handleEscapeOnNew );
      }
    } , [ isNewClicked ] );

    // make the same logic for contact ====> generic function is not working since every dom entity is referenced independently
    // make state handler for contact and references to entities
    // make state handler for exiting contact 
    const [ isContactClicked , setContactClicked ] = useState(  false  );     // just a boolean handler
    const [ isExitContactClicked , setExitContact ] = useState(  false  );    // just a boolean handler
    const refToContactPage = useRef( null );  // null overwritten at element creation
    const refToContactContent = useRef( null ); 
    const refToContactExit = useRef( null );
    const whereRefContact = useRef( null );
    const byRefContact = useRef( null );
    
    const handleContactClick = () => {
      setContactClicked( prevContactState => !prevContactState );
      setExitContact( false );
    }
    const handleExitContact = () => {
      setExitContact( prevExitContact => !prevExitContact );
      setContactClicked( false );
    }

    useEffect(() => {
      gsap . to( refToContactPage . current , {
        height: isContactClicked ? '100vh' : '0vh',
        duration: 0.1,
        onComplete: () => {
          refToContactContent . current . style . display = isContactClicked ? 'block' : 'none';
          refToContactExit . current . style . display = isContactClicked ? 'block' : 'none';
          whereRefContact . current . style . display = isContactClicked ? 'block' : 'none';
          byRefContact . current . style . display = isContactClicked ? 'block' : 'none';
        }
      } );
    } , [ isContactClicked ]);

    useEffect( () => {
      if( isExitContactClicked ){
        refToContactPage . current . style . height = '0vh';
        refToContactContent . current . style . display = 'none';
        refToContactExit . current . style . display = 'none';
        whereRefContact . current . style . display = 'none';
        byRefContact . current . style . display = 'none'
        setContactClicked( false );
      }else{}
    } , [ isExitContactClicked ] );

    useEffect( () => {
      function handleEscape( event ){
        if( event . key === 'Escape' ){
          if( isContactClicked ){
            refToContactPage . current . style . height = '0vh';
            refToContactExit . current . style . display = 'none';
            refToContactContent . current . style . display = 'none';
            whereRefContact . current . style . display = 'none';
            byRefContact . current . style . display = 'none';
            setContactClicked( false );
          }
        }
      }
      document . addEventListener( 'keydown', handleEscape );
      return () => {
        document . removeEventListener( 'keydown' , handleEscape );
      } 
    } , [isContactClicked] );


    return(
      <div id = 'app_menu' className='app_menu' ref = { referenceToMenu } >
        <span id = 'menu_sign' className='menu_sign_span' ref = { referenceToMenuArrow } onClick={handleMenuClick} >➤</span>
        <div id = 'menu_list' className = 'menu_list' ref = { referenceToMenuContent } >
          <label className='menu_labels' ref={ homeMenuRef } onClick={handleHomeClick}>Home</label>
          <label className='menu_labels' ref={ refToAbout } onClick={handleAboutClick}>About</label>
          <label className='menu_labels' onClick={ handleNewClick }>New</label>
          <label className='menu_labels'>Settings</label>
          <label className='menu_labels' onClick={ handleContactClick }>Contact</label>
        </div>
        <div id = 'home_div'  className = 'menu_divs' ref={ homePageRef } style={ { background: `url(${MenuBg})` } } >
          <div id = 'content_in_home' className = 'content' ref={ homeContentRef }>Greetings, user. This is Delila Monitor's Home Directory.
           To have a guide about the usage of the application, do check the 'About' and 'New' menus, where directives can be found. Address the 'Contact' menu to
           reach the development team. Last but not least in 'Settings' menu features for the app handling like theme and colorscheme will be provided soon.<br/>
           Have a successful experimental campaign<br/><br/><br/><span style={{ marginLeft: '370px'}}>~ GDED DAq Team</span></div>
          <label id = 'exit_home' className = 'exit_menus' ref={ homeExitRef } onClick={handleHomeExitClick}>✖</label>
          <label className='about_app_label' style={{ top: '970px' , left: '850px'}} ref={ whereRef }>in-house dev @ GDED</label>
          <label className='about_app_label' style={{ top: '970px' , left: '1300px' }} ref={ byRef }>powered by D.Aq. Team</label>
        </div>
        <div id = "about_div" className='menu_divs' ref={ refToAboutPage } style={ { background: `url(${MenuBg})`} } >
          <div id = "content_in_about" className = 'content' ref={refToAboutContent}>Delila's Monitor was designed to be both easy to use and insigthfull. 
          It provides functionalities in the left sliding menu; you can click the span arrow to trigger it or you can press the right arrow from the keyboard. 
          On the right side is the application menu; can also be triggered with a clcik on the span arrow or by pressing left arrow from the keyboard. 
          Both menus shrink back by pressing once more on the associated arrows or just by hitting escape on the keyboard. According to the pages that will open in app menu and features menu,
          you can access them by clicking on the names that will highlight so you would know that one of them is in focus. A new page with content will appear. To exit you can hit Esc or simply click X mark on
          top right corner of the page.<br/>
          <span style={{ marginLeft: '320px' }}>~ next: visit NEW</span></div>
          <label id = 'exit_home' className = 'exit_menus' ref={ refToExitAbout } onClick={ handleAboutExit }>✖</label>
          <label className='about_app_label' style={{ top: '970px' , left: '850px'}} ref={ whereRefAbout }>in-house dev @ GDED</label>
          <label className='about_app_label' style={{ top: '970px' , left: '1300px' }} ref={ byRefAbout }>powered by D.Aq. Team</label>
        </div>

        <div id = 'new_div' className='menu_divs' ref={ refToNewPage } style={ { background: `url(${MenuBg})` } }>
          <div id = 'content_in_new' className='content_of_new' ref={ refToNewContent }>Delila now disposes of new straightforward procedures.
          In 'INTEROGATION' you can retrieve the structure of your acquisition system in terms of boards and channels(for the digitizers). As 
          Delila is made to write in very specific, predefined file hierarchy. You provide the link of your json server representation and retrieve:
          status quo of linking to server and the structure.<br/>
          In 'REFRESHING' you can establish the refreshing rate at which the monitors are updated with new, raw data. Provide hours/minutes/seconds as 0 or positive integers<br/>
          In 'LAYOUT' you can establish what will be the grid of the individual mointoring pages. Provide numbers at least 1 or bigger since any representation has at least 1 row and 1 column if there is only one plot per page,
          or more if there are more.<br/>
          In 'SELECTIONS' based on your retrieved configuration you can select to plot all histograms and graphics or certain ones by navigating between boards and then between their channels. Depending on what approach you choose
          the focusing element on the main page marked with 'cross-hair(scope)' picture will be linked to the list of plots that you decided upon. When ready click the
          'cross-hair(scope)' picture, thus triggering the individual pages so you can see your data, keeping the options that you pre-provided
          <br/>In 'REFERENCE' you will have a premade template of ploting. 32 cells per page are created, that allow you to fasten up the process to see the data. On server interogation, the structure of your setup is automatically retrieved as a list of boards with their
          channel set chuncked into multiples of 32 or the number of channels if the latter does not exceed 32 limit. This way is faster but less focused. So trade between this and SELECTIONS wisely. 
          <br/><span style={{ marginLeft: '320px' }} >~ prev: visit About</span></div>
          <label id = 'exit_new' className = 'exit_menus' ref={ refToNewExit } onClick={ handleExitNew } >✖</label>
          <label className='about_app_label' style={{ top: '970px' , left: '850px'}} ref={ whereRefNew }>in-house dev @ GDED</label>
          <label className='about_app_label' style={{ top: '970px' , left: '1300px' }} ref={ byRefNew }>powered by D.Aq. Team</label>
        </div>
        
        <div id = 'contact_div' className='menu_divs' ref={ refToContactPage } style={ {background: `url(${MenuBg})`} } >
          <div id ='content_in_contact' className='content' ref={refToContactContent}>Vlad Andrei Toma<br/>vlad.toma@eli-np.ro<br/>Soiciro Aogaki<br/>sohichiroh.aogaki@eli-np.ro</div>
          <label id ='exit_contact' className='exit_menus' ref={ refToContactExit} onClick={ handleExitContact } >✖</label>
          <label className='about_app_label' style={{ top: '970px' , left: '850px'}} ref={ whereRefContact }>in-house dev @ GDED</label>
          <label className='about_app_label' style={{ top: '970px' , left: '1300px' }} ref={ byRefContact }>powered by D.Aq. Team</label>
        </div>
      </div>
    )
}