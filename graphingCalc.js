import { addFunctionInput } from './inputMenu.js';
import { redrawPlot } from './drawGraph.js';

function mainLoad() {
    const canvas = document.getElementById("graphCanvas");
    const ctx = canvas.getContext("2d");
    const functionInputs = Array.from(document.querySelectorAll(".functionInput")); // Select all input elements with the class "functionInput"
    const closeButtons = Array.from(document.querySelectorAll(".closeButton")); // Get all close buttons

    // Set canvas size to be twice the display size for retina scaling
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * pixelRatio;
    canvas.height = canvas.clientHeight * pixelRatio;

    // Scale down the canvas using CSS
    canvas.style.width = canvas.clientWidth + "px";
    canvas.style.height = canvas.clientHeight + "px";

    // Calculate initial offsetX to center the screen at the center of the canvas minus the width of the functionInputs div
    const functionInputsWidth = document.getElementById("functionInputs").offsetWidth;
    let offsetX = (canvas.width + functionInputsWidth*1.5) / 2;
    let offsetY = canvas.height / 2; // Change const to let
  
    // Input slide out/in
    document.getElementById("chevron").addEventListener("click", () => {
        document.getElementById("functionInputs").classList.toggle('slide');
        document.getElementById("functionsHeader").classList.toggle('headerSlide');
        if (!document.getElementById("chevron").classList.contains("chevronSlide")) {
            setTimeout((myFunction) => {
                document.getElementById("chevron").classList.toggle('chevronSlide');
            }, 500);
            offsetX = offsetX -= (canvas.width + functionInputsWidth*1.5) / 9.15;
            document.getElementById("chevron").style.transform = "rotate(0deg)";
        }
        else {
            document.getElementById("chevron").classList.toggle('chevronSlide');
            offsetX = offsetX += (canvas.width + functionInputsWidth*1.5) / 9.15;
            document.getElementById("chevron").style.transform = "rotate(180deg)";
        }
        redrawPlot();
    });
  
    // Define variables for zooming and dragging
    let scale = 40;
  
    const minScale = 1e-1000000000;
    const maxScale = 1e1000000000;

    let isDragging = false;
    let isScrolling = false;
    let lastX = 0;
    let lastY = 0;

    // Font settings for numerical labels
    const labelFont = "22px Roboto";

    const fmt /*: BigIntToLocaleStringOptions */ = {
        notation: 'scientific',
        maximumFractionDigits: 20 // The default is 3, but 20 is the maximum supported by JS according to MDN.
    };

    addFunctionInput();

    // Delegate event for dynamically added inputs
    document.getElementById("functionInputs").addEventListener("input", function(event) {
        if (event.target.classList.contains("functionInput")) {
            redrawPlot();
        }
    });
    alert("yeet");
    // Initial plot
    redrawPlot();
    alert("yeet");
  
    // Add event listener to the "+" icon
    const addButton = document.getElementById("addFx");
    addButton.addEventListener("click", addFunctionInput);

    // Add mouse event listeners for dragging and zooming
    function isDrag(event) {
        isDragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
    }
  
    "mousedown touchdown".split(" ").forEach(function(e){
      window.addEventListener(e, function(event) {  isDrag(event);  });
    });
  
    "mouseup touchup".split(" ").forEach(function(e){
      window.addEventListener(e, function(event) {  isDragging = false;  });
    });
  
    canvas.addEventListener("wheel", function(event) {
        event.preventDefault();

        const delta = Math.sign(event.deltaY);
        const mouseX = (event.clientX - canvas.getBoundingClientRect().left) * pixelRatio; // Adjust for retina scaling
        const mouseY = (event.clientY - canvas.getBoundingClientRect().top) * pixelRatio; // Adjust for retina scaling

        const graphMouseX = (mouseX - offsetX) / scale;
        const graphMouseY = -(mouseY - offsetY) / scale;

        const zoomFactor = 0.055; // Zoom factor

        // Adjust scale with limits
        scale *= 1 - delta * zoomFactor;
        if (scale > maxScale) {
            scale = maxScale;
        }
        if (scale < minScale) {
            scale = minScale;
        }

        offsetX = mouseX - graphMouseX * scale; // Adjust offsets
        offsetY = mouseY + graphMouseY * scale;

        redrawPlot();
    });

    function pan(event) {
        if (isDragging && !isScrolling) {
            const fixedSensitivity = 1.5;  // Define a constant base sensitivity

            const deltaX = (event.clientX - lastX) * fixedSensitivity;  // Horizontal delta based on constant sensitivity
            const deltaY = (event.clientY - lastY) * fixedSensitivity;  // Vertical delta with the same constant sensitivity

            lastX = event.clientX;
            lastY = event.clientY;

            offsetX += deltaX;  // Update horizontal offset
            offsetY += deltaY;  // Update vertical offset

            redrawPlot();  // Redraw the plot with updated offsets
        }
    }

    "mousemove touchmove".split(" ").forEach(function(e){
      window.addEventListener(e, function(event) {  pan(event)  });
    });

    functionInputs.forEach(function(input) { // Add event listeners to all function input elements
        input.addEventListener("input", function() {
            redrawPlot();
        });
    });
  
    //document.getElementById("addFx").click();
}
document.addEventListener("DOMContentLoaded", mainLoad());
