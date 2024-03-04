function updateLineNumbers() {
  const codeTextarea = document.getElementById("code");
  const lineNumbersContainer = document.querySelector(".line-numbers");
  const codeLines = codeTextarea.value.split("\n");
  let numberedLines = "";
  for (let i = 0; i < codeLines.length; i++) {
    numberedLines += `<div data-line-number="${i + 1}">${i + 1}</div>`;
  }
  lineNumbersContainer.innerHTML = numberedLines;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("code").addEventListener("click", (event) => {
    const lineNumber = event.target.getAttribute("data-line-number");
    if (lineNumber) {
      const codeTextarea = document.getElementById("code");
      const codeLines = codeTextarea.value.split("\n");
      codeLines.forEach((line, index) => {
        if (index + 1 == lineNumber) {
          event.target.classList.toggle("selected-line");
        } else {
          const lineElement = document.querySelector(
            `.line-numbers div[data-line-number="${index + 1}"]`
          );
          if (lineElement) {
            lineElement.classList.remove("selected-line");
          }
        }
      });
    }
  });
});

async function executeCode() {
  const code = document.getElementById("code").value;
  const language = document.getElementById("language").value;
  const output = document.getElementById("output");

  try {
    const response = await fetch("/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        language,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Clear previous output
      output.innerHTML = "";

      // Append new output line by line
      data.output.split("\n").forEach((line) => {
        output.appendChild(document.createTextNode(line));
        output.appendChild(document.createElement("br"));
      });
    } else {
      output.textContent = `Error executing code: ${data.error}`;
    }
  } catch (error) {
    console.error("Error executing code:", error);
    output.textContent = "An error occurred while executing the code.";
  }
}