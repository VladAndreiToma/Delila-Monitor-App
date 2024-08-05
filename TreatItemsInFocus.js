import { useState , useRef } from "react";
import React from 'react';

// create a basic function that return the list of elements in focus for analysis and the button that will be linked to plot
export function TreatItemsInFocus(){
    return(
        <div style = { { display: 'flex' , flexDirection: 'row' , alignItems: 'center' , justifyContent: 'center' } }>
            <input id = "inFocus"      readOnly = {true}      className = "inFocus"></input>
            <button   id = 'focusSign'    className = "focusSign"></button>
        </div>
    );
}