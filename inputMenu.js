// Function to add a new function input
export function addFunctionInput() {
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
  
    const clearButtons2 = Array.from(document.querySelectorAll(".fxInWrapper img#clear"));
    const fxInWrapper4 = document.getElementsByClassName("fxInWrapper");
    const fxIn4 = document.getElementsByClassName("functionInput");
    clearButton.addEventListener("click", () => {

      for (let i = $(fxInWrapper).index(); i < fxIn4.length; i++) {
        if (fxIn4[i].value !== fxIn4[fxIn4.length - 1].value)
          fxIn4[i].value = fxIn4[i + 1].value;
      }
      fxInWrapper4[fxIn4.length - 1].remove();
      let fxIconArr = document.getElementsByClassName("fxIcon");
      for (let i = 0; i < fxIn4.length; i++) {
          if (fxIn4[i].value === "")
              fxIconArr[i].style.display = "none";
          else
              fxIconArr[i].style.display = "flex";
      }
      //redrawPlot();

      let iBoxp = document.getElementsByClassName("p");
      for (let i = 0; i < iBoxp.length; i++) {
        iBoxp[i].innerHTML = i + 1;
      }
      
      if (document.getElementsByClassName("fxInWrapper").length === 0)
          document.getElementById("addFx").click();
    });
  }