function mainLoad() {
    const canvas = document.getElementById("graphCanvas");
    const ctx = canvas.getContext("2d");
    const functionInputs = Array.from(document.querySelectorAll(".functionInput")); // Select all input elements with the class "functionInput"
    const closeButtons = Array.from(document.querySelectorAll(".closeButton")); // Get all close buttons

    if (window.innerWidth > window.innerHeight) {
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerWidth + "px";
    } else {
        canvas.style.width = window.innerHeight + "px";
        canvas.style.height = window.innerHeight + "px";
    }

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
    let offsetY = canvas.height / 2;

    function addFunctionInput() {
        // Get the parent container
        const functionInputs = document.getElementById("functionInputs");
      
        // Create a new wrapper div
        const fxInWrapper = document.createElement("div");
        fxInWrapper.className = "fxInWrapper";
      
        // Create fxIcon
        const fxIcon = document.createElement("img");
        fxIcon.className = "fxIcon";
        fxIcon.src = "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/planner_review/default/24px.svg";
        fxIcon.alt = "Clear function input";
        fxIcon.style.display = "none";
      
        // Create iconBox
        const iconBox = document.createElement("div");
        iconBox.className = "iconBox";
      
        // Create iconBox p
        const p = document.createElement("p");
      
        // Create the new function input
        const functionInput = document.createElement("input");
        functionInput.type = "text";
        functionInput.className = "functionInput";
        functionInput.value = ""; // Start with an empty value
      
        // Create the "X" icon to clear the input
        const clearButton = document.createElement("img");
        clearButton.id = "clear";
        clearButton.src = "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/close/default/24px.svg";
        clearButton.alt = "Clear function input";
      
        fxInWrapper.appendChild(iconBox);
        fxInWrapper.appendChild(functionInput);
        fxInWrapper.appendChild(clearButton);
        iconBox.appendChild(p);
        iconBox.appendChild(fxIcon);
        iconBox.firstChild.innerHTML = document.getElementsByClassName("iconBox").length+1;
        functionInputs.appendChild(fxInWrapper);
      
        // Add event listeners to each "X" icon
        const clearButtons = Array.from(document.querySelectorAll(".fxInWrapper img#clear"));
        const fxInWrapper2 = document.getElementsByClassName("fxInWrapper");
        const fxIn2 = document.getElementsByClassName("functionInput");
        clearButtons.forEach((clearButton, index) => {
            if (clearButton === clearButtons[clearButtons.length - 1]) {
                clearButton.addEventListener("click", () => {
                    clearButton.parentElement.remove();
                    redrawPlot();
                    
                    let iBoxp = document.getElementsByTagName("p");
                    for (let i = 0; i < iBoxp.length; i++) {
                        iBoxp[i].innerHTML = i + 1;
                    }
                    
                    //document.getElementById("addFx").click();
                    if (document.getElementsByClassName("fxInWrapper").length === 0)
                        document.getElementById("addFx").click();
                });
            }
        });
    }
  
    // Input slide out/in
    document.getElementById("chevron").addEventListener("click", () => {
        document.getElementById("menuWrapper").classList.toggle('slide');
        
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
    let scale = 40.0;
  
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

    // Initial plot
    redrawPlot();
  
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
            alert("yo");
            redrawPlot();
        });
    });
  
    
    function plotFunctions() {
        const colors = ["#3366CC", "#DC3912", "#109618", "#990099", "#FF9900"];
        const inputs = Array.from(document.getElementsByClassName("functionInput"));

        inputs.forEach((input, index) => {
            const expression = input.value.trim();
            if (!expression) return;

            try {
                const compiledExpression = math.compile(expression);
                plotWithIntervals(compiledExpression, colors[index % colors.length]);
            } catch (err) {
                console.error("Error compiling function:", err);
            }
        });
    }

    function plotWithIntervals(compiledExpression, color) {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2;

        const step = 1 / scale;
        const minX = (-offsetX) / scale;
        const maxX = (canvas.width - offsetX) / scale;

        ctx.beginPath();

        for (let x = minX; x <= maxX; x += step) {
            const xNext = x + step;
            const intervalY = evaluateInterval(compiledExpression, x, xNext);

            const canvasX = x * scale + offsetX;
            const canvasXNext = xNext * scale + offsetX;

            const canvasYMin = -intervalY.min * scale + offsetY;
            const canvasYMax = -intervalY.max * scale + offsetY;

            // Draw a vertical rectangle that spans the interval
            ctx.moveTo(canvasX, canvasYMin);
            ctx.lineTo(canvasX, canvasYMax);
            ctx.lineTo(canvasXNext, canvasYMax);
            ctx.lineTo(canvasXNext, canvasYMin);
            ctx.lineTo(canvasX, canvasYMin);
        }

        ctx.stroke();
    }

    function evaluateInterval(compiledExpression, xMin, xMax) {
        try {
            const yMin = compiledExpression.evaluate({ x: xMin });
            const yMax = compiledExpression.evaluate({ x: xMax });

            return {
                min: Math.min(yMin, yMax),
                max: Math.max(yMin, yMax),
            };
        } catch (err) {
            console.warn("Error evaluating interval:", err);
            return { min: Number.NEGATIVE_INFINITY, max: Number.POSITIVE_INFINITY };
        }
    }
    
    function redrawPlot() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        plotFunctions();
    }
    
    function drawGrid() {
        const minX = (-offsetX) / scale;
        const maxX = (canvas.width - offsetX) / scale;
        const minY = (-offsetY) / scale;
        const maxY = (canvas.height - offsetY) / scale;
    
        // Horizontal grid lines
        const stepY = calculateStepSize(maxY - minY, canvas.height / scale);
        ctx.font = labelFont; // Set font size here
        for (let y = Math.ceil(minY / stepY) * stepY; y <= maxY + stepY; y += stepY) {
            const canvasY = y * scale + offsetY;
    
            // Determine the number of in-between lines based on the label
            let numInBetweenLines = 4; // Default to 4 in-between lines
            if (Math.abs(y) < 1 && Math.abs(y) > 0 && y.toString().charAt(0) === '2') {
                numInBetweenLines = 3; // Adjust for labels like 0.2, 0.02, etc.
            }
          
            // Draw main grid line
            ctx.strokeStyle = "#1C1C1C"; // Set main grid line color
            ctx.lineWidth = .5;
            ctx.beginPath();
            ctx.moveTo(0, canvasY);
            ctx.lineTo(canvas.width, canvasY);
            ctx.stroke();
    
            // Draw lighter grid lines between main grid lines
            const stepYLighter = stepY / (numInBetweenLines + 1); // Calculate step for in-between lines
            for (let i = 1; i <= numInBetweenLines; i++) {
                const canvasYLighter = canvasY + (i * stepYLighter * scale);
                ctx.strokeStyle = "#ADADAF"; // Set in-between grid line color
                ctx.beginPath();
                ctx.moveTo(0, canvasYLighter);
                ctx.lineTo(canvas.width, canvasYLighter);
                ctx.stroke();
            }
        }
    
        // Vertical grid lines
        const stepX = calculateStepSize(maxX - minX, canvas.width / scale);
        for (let x = Math.floor(minX / stepX) * stepX; x <= maxX + stepX; x += stepX) {
            const canvasX = x * scale + offsetX;
    
            // Determine the number of in-between lines based on the label
            let numInBetweenLines = 4; // Default to 4 in-between lines
            if (Math.abs(x) < 1 && Math.abs(x) > 0 && x.toString().charAt(0) === '2')
                numInBetweenLines = 3; // Adjust for labels like 0.2, 0.02, etc.
    
            // Draw main grid line
            ctx.strokeStyle = "#1C1C1C"; // Set main grid line color
            ctx.beginPath();
            ctx.moveTo(canvasX, 0);
            ctx.lineTo(canvasX, canvas.height);
            ctx.stroke();
    
            // Draw lighter grid lines between main grid lines
            const stepXLighter = stepX / (numInBetweenLines + 1); // Calculate step for in-between lines
            for (let i = 1; i <= numInBetweenLines; i++) {
                const canvasXLighter = canvasX + (i * stepXLighter * scale);
                ctx.strokeStyle = "#ADADAF"; // Set in-between grid line color
                ctx.beginPath();
                ctx.moveTo(canvasXLighter, 0);
                ctx.lineTo(canvasXLighter, canvas.height);
                ctx.stroke();
            }
        }
        // Draw x and y axes
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, offsetY);
        ctx.lineTo(canvas.width, offsetY);
        ctx.moveTo(offsetX, 0);
        ctx.lineTo(offsetX, canvas.height);
        ctx.stroke();
      
        // Vertical Number labels
        for (let y = Math.floor(minY / stepY) * stepY; y <= maxY + stepY; y += stepY) {
            const canvasY = y * scale + offsetY;
          
            // Format label using scientific notation if greater than or equal to 1e9
            let label;
            y = parseFloat(y.toPrecision(2))
            if (Math.abs(y) >= 1e9)
                label = new Intl.NumberFormat('en-US', fmt).format(-y);
            else
                label = parseFloat(-y);
    
            const labelX = offsetX + 5;
            const labelY = canvasY - 5;
    
            ctx.letterSpacing = "0px";
            ctx.fillStyle = "black";
            ctx.font = "100 20px arial";
            ctx.fillText(label, labelX, labelY);
        }
      
        // Horizontal number labels
        for (let x = Math.floor(minX / stepX) * stepX; x <= maxX + stepX; x += stepX) {
            const canvasX = x * scale + offsetX;
            // Format label using scientific notation if greater than or equal to 1e9
            let label = 0;
            x = parseFloat(x.toPrecision(2));
            if (Math.abs(x) >= 1e9)
                label = new Intl.NumberFormat('en-US', fmt).format(x);
            else
                label = x; // Remove unnecessary zeros
          
            const labelX = canvasX + 5;
            const labelY = offsetY - 5;
          
            // Draw numerical label if not too close to the origin or if it's the origin
            ctx.letterSpacing = "0px";
            ctx.fillStyle = "black";
            ctx.font = "100 20px arial";
            ctx.fillText(label, labelX, labelY);
        }
        plotFunctions();
    }
    
    function calculateStepSize(range, canvasSize) {
        const maxLabels = 15; // Maximum number of labels to display
        const idealStep = range / maxLabels;
        const magnitude = Math.round(Math.log10(idealStep));
        const step = Math.pow(10, magnitude);
        const steps = [1, 2, 5, 10]; // Common step sizes
        let bestStep = 1;
    
        for (const candidate of steps) {
            if (candidate * step >= idealStep) {
                bestStep = candidate * step;
                break;
            }
        }
        return bestStep;
    }
    let ogWindowWidth = window.innerWidth;
    let ogWindowHeight = window.innerHeight;

    // Adjust graph as window resizes
    window.onresize = function resizeGraph() {
        
        if (window.innerWidth > window.innerHeight) {
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerWidth + "px";
        } else {
        canvas.style.width = window.innerHeight + "px";
        canvas.style.height = window.innerHeight + "px";
        }

        const pixelRatio = window.devicePixelRatio || 1;
        canvas.width = canvas.clientWidth * pixelRatio;
        canvas.height = canvas.clientHeight * pixelRatio;

        // Scale down the canvas using CSS
        canvas.style.width = canvas.clientWidth + "px";
        canvas.style.height = canvas.clientHeight + "px";

        offsetX = (canvas.width + functionInputsWidth * 1.5) / 2;
        offsetY = canvas.height / 2;

        redrawPlot();
    }

}
document.addEventListener("DOMContentLoaded", mainLoad());
