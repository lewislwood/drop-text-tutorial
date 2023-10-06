"use strict";

let debugStatus = 1; // -1 blind only, 0 - Turn off console fro all,  1 - All can see the console
let alertStatus, divAlertStatus; 
// set auto clear console after a specified time
const autoClearConsole = {
    enabled: true,
    delayClear: 15,  // in Seconds
    finalClear: 2000, // Final clear in milliseconds
maxSize: 600   // max size for the console.
};

// if (alertStatus) alertStatus.innerHTML = "javascript wired up!!!"
// else alert("alertStatus not found!!up!");

// audio describe page: Only works if debug console is on.
const adPage = () => {
    if (debugStatus  ===0) alert("You must have the debug console enabled. Otherwise, programmer must create a dedictated area just for this.")
    else {
const msg = `You are on the Drop Text Tutorial/demo page.<br>`+
`There is a header area that contains a debug cosole toolbar.<br>`+
`You can select visible to all sighted and blind, disabled, and screen reader only.<br>`+
`Followd by the main content section and 2 columns.<br>`+
`Smaller screens may only have 1 column. The 1st column has heading level 1 and the 2nd has heading level 2.<br>`+
`1st column is general How to use this component and resources.<br>`+
`2nd column contains the detailed instructions.`+
`Each drop panel has a heading level 3 and a expand/collapse button.<br>`+
`Blind can naviagate these drop panels by buttons or heading 3's.Listen for word expand or collapse to know the state of your drop panel you are on.<br> `+
`Footer section will contain the alert status/debug console. Heading level 5.<br>`+
`You can copy the status for debuging. Or click the clear button (Alt+c).<br>`+
`N*** Note this is only visible if console is visible, also you must have screen reader to hear it spoken.<br>`+
`Normally this button would be visibly hidden, since they can see it visually.`

alertStatus.innerHTML = msg;
}
} ;  // adPage()



const sayAlertStatus = (message) => {

    if (debugStatus  ===0) {
        console.log(message);
    }else {}
    if (alertStatus) {
        alertStatus.innerHTML = message + "<br>>"+ alertStatus.innerHTML 
        if ((autoClearConsole .enabled) && (autoClearConsole.maxSize >= (alertStatus.innerHTML.length)))
            alertStatus.innerHTML = alertStatus.innerHTML.substring(0, autoClearConsole.maxSize)
        
    }else console.log(message);
    {;}
};  // sayAlertStatus


const setDropPanel= (toggle, panel, heading, btn, content, img) => {
    try {
        let curExpanded = btn.getAttribute("aria-expanded");
        if (toggle) curExpanded = (curExpanded === "true") ? "false" : "true";
const dHeading = heading.innerText;
let level = btn.getAttribute("aria-level");
if (!level) level = `level ${level}` 
else level = "";
let src = img.getAttribute("src");

        // Now set all the values for current expanded state
        if (curExpanded === "true") {
            sayAlertStatus("Setting panel to expanded")
            panel.classList .remove("collapsed");
            panel.classList .add("expanded");
btn.setAttribute("aria-expanded", "true");
content.setAttribute("aria-hidden", "false");
src = src.replace("expand", "collapse");
img.setAttribute("src",src); 

img.setAttribute("alt",  `${dHeading } expanded ${level}`);


        } else {
            sayAlertStatus("Setting panel to collapsed");
            panel.classList .add("collapsed");
            panel.classList .remove("expanded");
            btn.setAttribute("aria-expanded", "false");
            content.setAttribute("aria-hidden", "true");
            src = src.replace("collapse", "expand");
            img.setAttribute("src",src );

img.setAttribute("alt", `${dHeading } collapsed`);

        }


    } catch(error) {
        sayAlertStatus("setDropPanel stack: " + error.stack);
    sayAlertStatus( "dropPanelToggle error: " + error.message);
    }; // catch
    
    }; // dropPanelToggle

    const getPanelElements = ( btn) => {
try {
    if (! btn) throw new Error("Button not set.") ;
    const panelID= btn.getAttribute("aria-controls");
    if (! panelID) throw new Error("Aria-controls not set for button..");
    const panel =document.getElementById (panelID);
    if (! panel) throw new Error("Drop panel not found.");
    const content = panel.querySelector(`[name="drop-content"]`);
    if (! content) throw new Error("Drop Content not found.");
    const heading = panel.querySelector(`[name="drop-heading"]`);
    if (! heading) throw new Error("Drop heading not found.");
    const img = btn.querySelector("img"); 
    sayAlertStatus("Found all elements.")
    sayAlertStatus(`PanelID=${panel.id} ->  ${heading.innerHTML} `);
    return [panel, heading, btn, content, img];
} catch(error) {
sayAlertStatus(` getPanelElements error: ${error.message}`);
}; // catch
    }; // getPanelElements


function dropActionClicked(b, toggle = true) {
    // sayAlertStatus((toggle) ? "You clicked me!!": "Initializing panel");
    const [panel, heading, btn, content, img] =getPanelElements( b);
    setDropPanel(toggle, panel, heading, btn, content, img);
    }; // dropActionClicked

    function goToMainContent() {
        // sayAlertStatus("going..");

        const mc = document.getElementById("main-content");
        if (mc) mc.focus()
        else sayAlertStatus("main content not found");
    }; // goToMainContent

    function checkedDebugRadio(value, sayIt = true) {
        const nDS = Number(value);
if ((nDS != debugStatus) && (sayIt)) {
    divAlertStatus.setAttribute("aria-hidden", "false"); // They changed status and want it spoken the change
    debugStatus = -1;
    const msg = ["screen reader only.", "disabled for all", "visible to all."][nDS + 1];
    sayAlertStatus(`Changing mode to ${msg}`);
    setTimeout(() => { checkedDebugRadio(value, false);}, 450);
    return;
} else {
if (nDS === 1) divAlertStatus.classList.remove("hide-me")
else divAlertStatus.classList.add("hide-me");
if (nDS === 0) divAlertStatus.setAttribute("aria-hidden", "true") 
else divAlertStatus.setAttribute("aria-hidden", "false") ;
debugStatus = nDS;
}; 
    }; //checkedDebugRadio

    function keyHandler( ev) {
if (debugStatus) {
        if ((ev.altKey) && (ev.key === "c")) {
            ev.preventDefault(); // You hog up the keys and noone else gets it.
            sayAlertStatus(ev.key);
    // Tell screen rader to say clear
    alertStatus.innerHTML = "Debug console Cleared.";
    // Now clear after you give screen reader 350ms to read it
    const clrTimer = () => { alertStatus.innerHTML  = "";};  
    setTimeout(clrTimer , 350);
};
    };

    }; //keyHandler


function initializeDrop() {
    try {
    alertStatus = document.getElementById("statusalert");
    divAlertStatus = document.getElementById("aria-status-div");
    
    const ds = `${debugStatus }`        ;
    document.querySelectorAll(`[name="debug-console"]`).forEach((el) => { 
        const v = el.value;
if (ds === v) el.checked  = true;
el.onclick = () => {checkedDebugRadio(v);};
    });
    checkedDebugRadio(`${debugStatus}`, false);
    
const btns = document.querySelectorAll(`[name="drop-action-button"]`);
if (! btns) alertStatus.innerHTML = "\n No buttons found!"
else {
    btns.forEach((btn) => { 
        // set the onclick for each expand actio button
        btn.onclick = (e) => {
            e.preventDefault();
            dropActionClicked(btn, true);
        };  // Now call the dropActionClick withouth the toggle switch. This ensures the panel is setup properly in sync with its elements. 
        dropActionClicked(btn, false);
     })
    alertStatus.innerHTML += "\n buttons wired up";
}
window.addEventListener( "keyup",(e)  => { keyHandler(e);});
// Auto clear debug console
if ((autoClearConsole .enabled && (alertStatus))) {
    let fc = autoClearConsole.finalClear, dc = autoClearConsole.delayClear, dcMs ,dcTotal;
    dcMs = dc * 1000;  // set to milliseconds
    dcTotal  = dc + dcMs; // ms for 2nd timer
    // alertStatus.innerHTML = "Setting up clear timer and testing it.";
const msg = `Debug console auto Cleared after ${dc} seconds. Final clear in ${fc} milliseconds.`;
    setTimeout(() => {alertStatus.innerHTML = msg;
    // Now clear the auto clear notice as well
    setTimeout(() => {alertStatus.innerHTML ="" ;}, dc); 
    }, dcMs); 

};  // if autoClear

const ad = document.getElementById("ad-btn");
if (ad) ad.onclick = () => { adPage(); }
else sayAlertStatus("Audio Describe Button not Found.");
const mcB = document.getElementById ("go-to-btn");
if (mcB ) mcB .onclick = () => { goToMainContent();}
    else sayAlertStatus("Go To Button not found.");
    } catch(error) {
sayAlertStatus(error.stack);
sayAlertStatus(`Initialize error: ${error.message}`);
    }; //catch
}; // initalizeDrop

{
    //  auto run script at initialize
    // Run the initializeDrop function when all content is loaded.
    document.addEventListener("DOMContentLoaded",(e) => {initializeDrop();})
}