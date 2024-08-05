import React from "react";
import { useState , useRef , useEffect } from "react";
import { draw , redraw , httpRequest } from 'https://root.cern/js/latest/modules/main.mjs';


export function MakePage( { bNumber , limits , paginationRows , paginationCols , pageContent , serverLink } ){

    const parsedServerLink = serverLink.includes('/h.json') ? serverLink.replace('/h.json', '') + '/' : serverLink + '/' ;
    const gridCellsCount = paginationRows * paginationCols;
    const intervalsDeclared = [];

    const fetchAndDrawPlot = async (index, plotId) => {
        try {
            const importAddress = `${parsedServerLink}${pageContent[index]}/root.json`;
            console . log( `current fetching address is: ${importAddress}` );
            const initialCollectedObj = index < pageContent.length ? await httpRequest(importAddress, 'object') : null;
            if (document.getElementById(plotId) && initialCollectedObj !== null) {
                draw(document.getElementById(plotId), initialCollectedObj, 'hist');
            }
            const intervalForPageIndex = setInterval(async () => {
                const collectedObj = index < pageContent.length ? await httpRequest(importAddress, 'object') : null;
                if (document.getElementById(plotId) && collectedObj !== null) {
                    redraw(document.getElementById(plotId), collectedObj, 'hist');
                }
            }, 1800000);
            intervalsDeclared.push(intervalForPageIndex);
        } catch (err) {
            console.error('Error fetching or drawing plot:', err);
        }
    };
    
    useEffect(() => {
        
        console. log( "Executing use effect inside make page " );

        for (let kIndex = 0; kIndex < gridCellsCount; kIndex++) {
            const plotId = `plotIndex${kIndex}`;
            fetchAndDrawPlot(kIndex, plotId);
        }
        return () => {
            intervalsDeclared.forEach(interval => clearInterval(interval));
        };
    }, [pageContent, parsedServerLink]);

    return (
        <div id='main_page_container' style={{ display: "grid", gridTemplateRows: 'repeat(4, 1fr)', gridTemplateColumns: 'repeat(8, 1fr)', gap: '2px', backgroundColor: 'coral', width: '100%', height: '100%' }}>
            {
                Array.from({ length: gridCellsCount }).map((_, index) => (
                    <div key={index} id={`plotIndex${index}`}>
                        {'plotIndex' + index}
                    </div>
            ))}
        </div>
    );
}
 