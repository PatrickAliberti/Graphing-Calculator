const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

// Calculate initial offsetX to center the screen at the center of the canvas minus the width of the functionInputs div
const functionInputsWidth = document.getElementById("functionInputs").offsetWidth;
let offsetX = (canvas.width + functionInputsWidth*1.5) / 2;
let offsetY = canvas.height / 2; // Change const to let

let scale = 40;

function plotFunction() {
    const colors = ["#3366CC", "#DC3912", "#109618", "#990099", "#FF9900"];
    let ii = 0;
    document.getElementsByClassName("functionInput").forEach(function(input, index) {
        if (input.value === "")
            document.getElementsByClassName("fxIcon")[index].style.display = "none";
        else
            document.getElementsByClassName("fxIcon")[index].style.display = "block";
      
        const expression = input.value.trim();
        const compiledExpression = math.compile(expression);
        const step = 1 / scale;
        const minX = (-offsetX) / scale;
        const maxX = (canvas.width - offsetX) / scale;

        let fxIcon = document.getElementsByClassName("fxIcon");
        fxIcon[ii].style.backgroundColor = colors[ii] + "cc";
        ctx.strokeStyle = colors[index % colors.length]; // Assign color to current function
        ctx.lineWidth = 4;
        ctx.beginPath();
        let prevX = null;
        let prevY = null;
        for (let x = minX; x <= maxX; x += step) {
            let y = compiledExpression.evaluate({ x: x });
            const canvasX = x * scale + offsetX;
            const canvasY = -y * scale + offsetY;
            if (!isNaN(y)) {
                if (prevX !== null && prevY !== null && Math.abs(canvasY - prevY) < canvas.height / 12)
                    ctx.lineTo(canvasX, canvasY);
                else
                    ctx.moveTo(canvasX, canvasY);
                  
                prevX = canvasX;
                prevY = canvasY;
            } else {
                prevX = null;
                prevY = null;
            }
        }
        let fxInput = document.getElementsByClassName("functionInput");
        document.getElementsByClassName("functionInput")[fxInput.length-1].addEventListener("input", () => {
            fxIcon[index].style.background = colors[index % colors.length];
          
            if (input.value === "")
                fxIcon[index].style.display = "none";
            else
                fxIcon[index].style.display = "block";
        
        });
      
        ctx.stroke();
        ii++;
    });
}

export function redrawPlot() {
    alert("yeet");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    alert("yeet");
    drawGrid();
    //alert("yeet");
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
  
    plotFunction();
  
    // Vertical Number labels
    for (let y = Math.floor(minY / stepY) * stepY; y <= maxY + stepY; y += stepY) {
        const canvasY = y * scale + offsetY;
      
        // Format label using scientific notation if greater than or equal to 1e9
        let label;
        if (Math.abs(y) >= 1e9)
            label = new Intl.NumberFormat('en-US', fmt).format(-y);
        else
            label = parseFloat(-y.toPrecision(15)); // Remove unnecessary zeros

        const labelX = offsetX + 5;
        const labelY = canvasY - 5;

        if (Math.abs(y) > 1e-1000000000 && y < 0) {
            ctx.fillStyle = "white";
            ctx.letterSpacing = "-4.2px";
            ctx.font = "900 23px arial";
            ctx.fillText(label, labelX-2, labelY+1);
            
            ctx.letterSpacing = "0px";
            ctx.fillStyle = "black";
            ctx.font = "100 20px arial";
            ctx.fillText(label, labelX, labelY);
        } else {
            ctx.fillStyle = "white";
            ctx.letterSpacing = "-4.2px";
            ctx.font = "900 23px arial";
            ctx.fillText(label, labelX+1, labelY+1);
            
            ctx.letterSpacing = "0px";
            ctx.fillStyle = "black";
            ctx.font = "100 20px arial";
            ctx.fillText(label, labelX, labelY);
        }
    }
  
    // Horizontal number labels
    for (let x = Math.floor(minX / stepX) * stepX; x <= maxX + stepX; x += stepX) {
        const canvasX = x * scale + offsetX;
        // Format label using scientific notation if greater than or equal to 1e9
        let label = 0;
        if (Math.abs(x) >= 1e9)
            label = new Intl.NumberFormat('en-US', fmt).format(x);
        else
            label = parseFloat(x.toPrecision(15)); // Remove unnecessary zeros
      
        const labelX = canvasX + 5;
        const labelY = offsetY - 5;
      
        // Draw numerical label if not too close to the origin or if it's the origin
        if (Math.abs(x) > 1e-1000000000 && x < 0) {
            ctx.fillStyle = "white";
            ctx.letterSpacing = "-4.2px";
            ctx.font = "900 23px arial";
            ctx.fillText(label, labelX+1, labelY + 1);
            
          
            ctx.letterSpacing = "0px";
            ctx.fillStyle = "black";
            ctx.font = "100 20px arial";
            ctx.fillText(label, labelX, labelY);
        } else {
            ctx.fillStyle = "white";
            ctx.letterSpacing = "-4.2px";
            ctx.font = "900 23px arial";
            ctx.fillText(label, labelX-2, labelY + 1);
            
          
            ctx.letterSpacing = "0px";
            ctx.fillStyle = "black";
            ctx.font = "100 20px arial";
            ctx.fillText(label, labelX, labelY);
        }
    }
}

function calculateStepSize(range, canvasSize) {
    const maxLabels = 15; // Maximum number of labels to display
    const idealStep = range / maxLabels;
    const magnitude = Math.floor(Math.log10(idealStep));
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