function visualizeWater() {
  const heights = document
    .getElementById("heightInput")
    .value.split(",")
    .map(Number);
  if (heights.some(isNaN) || heights.length === 0) {
    alert("Please enter a valid list of block heights.");
    return;
  }

  const trappedWater = computeWaterVolume(heights);
  drawVisualization(heights, trappedWater);
}

function computeWaterVolume(heights) {
  const n = heights.length;

  if (n <= 1) return 0;
  let leftMax = Array(n).fill(0);
  let rightMax = Array(n).fill(0);
  let waterVolume = 0;
  leftMax[0] = heights[0];

  for (let i = 1; i < n; i++) {
    leftMax[i] = Math.max(leftMax[i - 1], heights[i]);
  }

  rightMax[n - 1] = heights[n - 1];

  for (let i = n - 2; i >= 0; i--) {
    rightMax[i] = Math.max(rightMax[i + 1], heights[i]);
  }

  for (let i = 0; i < n; i++) {
    waterVolume += Math.max(0, Math.min(leftMax[i], rightMax[i]) - heights[i]);
  }

  return waterVolume;
}
function drawVisualization(heights, waterVolume) {
  const svgElement = document.getElementById("svgCanvas");

  svgElement.innerHTML = "";

  const widthPerBlock = svgElement.width.baseVal.value / heights.length;
  const blockScale = 20;
  const totalHeight = Math.floor(svgElement.height.baseVal.value / blockScale);

  // Draw building blocks
  heights.forEach((height, i) => {
    const block = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );

    block.setAttribute("x", i * widthPerBlock);
    block.setAttribute(
      "y",
      svgElement.height.baseVal.value - height * blockScale
    );
    block.setAttribute("width", widthPerBlock);
    block.setAttribute("height", height * blockScale);
    block.setAttribute("fill", "#ffff00");
    svgElement.appendChild(block);
  });

  // Draw trapped water
  for (let i = 0; i < heights.length; i++) {
    const leftMax = Math.max(...heights.slice(0, i + 1));
    const rightMax = Math.max(...heights.slice(i, heights.length));
    const waterHeight = Math.min(leftMax, rightMax) - heights[i];

    if (waterHeight > 0) {
      const waterBlock = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );

      waterBlock.setAttribute("x", i * widthPerBlock);
      waterBlock.setAttribute(
        "y",
        svgElement.height.baseVal.value - (heights[i] + waterHeight) * blockScale
      );
      waterBlock.setAttribute("width", widthPerBlock);
      waterBlock.setAttribute("height", waterHeight * blockScale);
      waterBlock.setAttribute("fill", "#03A9F4");
      svgElement.appendChild(waterBlock);
    }
  }

  // Add horizontal lines
  for (let i = 0; i <= totalHeight; i++) {
    const gridLine = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );

    gridLine.setAttribute("x1", 0);
    gridLine.setAttribute(
      "y1",
      svgElement.height.baseVal.value - i * blockScale
    );
    gridLine.setAttribute("x2", svgElement.width.baseVal.value);
    gridLine.setAttribute(
      "y2",
      svgElement.height.baseVal.value - i * blockScale
    );
    gridLine.setAttribute("stroke", "#ddd");
    gridLine.setAttribute("stroke-width", 1);
    svgElement.appendChild(gridLine);
  }

  // Add vertical lines
  heights.forEach((_, i) => {
    const verticalLine = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );

    verticalLine.setAttribute("x1", i * widthPerBlock);
    verticalLine.setAttribute("y1", 0);
    verticalLine.setAttribute("x2", i * widthPerBlock);
    verticalLine.setAttribute("y2", svgElement.height.baseVal.value);
    verticalLine.setAttribute("stroke", "#ccc");
    verticalLine.setAttribute("stroke-width", 1);
    svgElement.appendChild(verticalLine);
  });

  // total water volume
  document.getElementById(
    "waterVolumeDisplay"
  ).textContent = `Total Water Volume: ${waterVolume} units`;
}
