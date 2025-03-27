const THEATRE = { time: 5, rate: 1500 };
const PUB = { time: 4, rate: 1000 };
const COMMERCIAL_PARK = { time: 10, rate: 3000 };

function findMaxEarnings(timeUnits) {
  let maxEarnings = 0;
  let bestCombinations = [];

  function tryBuildingOptions(remainingTime, t, p, c, currentEarnings) {
    if (currentEarnings > maxEarnings) {
      maxEarnings = currentEarnings;
      bestCombinations = [{ T: t, P: p, C: c }];
    } else if (currentEarnings === maxEarnings) {
      bestCombinations.push({ T: t, P: p, C: c });
    }

    // Build Theatre if time remains
    if (remainingTime > THEATRE.time) {
      tryBuildingOptions(
        remainingTime - THEATRE.time,
        t + 1, p, c,
        currentEarnings + (remainingTime - THEATRE.time) * THEATRE.rate
      );
    }

    // Build Pub if time remains
    if (remainingTime > PUB.time) {
      tryBuildingOptions(
        remainingTime - PUB.time,
        t, p + 1, c,
        currentEarnings + (remainingTime - PUB.time) * PUB.rate
      );
    }

    // Build Commercial Park if time remains
    if (remainingTime > COMMERCIAL_PARK.time) {
      tryBuildingOptions(
        remainingTime - COMMERCIAL_PARK.time,
        t, p, c + 1,
        currentEarnings + (remainingTime - COMMERCIAL_PARK.time) * COMMERCIAL_PARK.rate
      );
    }
  }

  // Start properties build
  tryBuildingOptions(timeUnits, 0, 0, 0, 0);

  return { maxEarnings, solutions: bestCombinations };
}

function calculate() {
  const input = document.getElementById("timeInput").value.trim();
  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = "";

  if (!input) {
    resultContainer.innerHTML = `<p class="error">Please enter valid time units.</p>`;
    return;
  }

  const timeUnitsArray = input.split(',').map(num => parseInt(num.trim(), 10));
  
  timeUnitsArray.forEach(units => {
    if (isNaN(units) || units <= 0) {
      resultContainer.innerHTML += `<p class="error">Invalid time unit: ${units}</p>`;
      return;
    }

    const { maxEarnings, solutions } = findMaxEarnings(units);

    const resultCard = document.createElement("div");
    resultCard.classList.add("result-card");

    let solutionsHTML = "";
    solutions.forEach((sol, idx) => {
      solutionsHTML += `<p>${idx + 1}. T: ${sol.T}, P: ${sol.P}, C: ${sol.C}</p>`;
    });

    resultCard.innerHTML = `
      <h3>Time Units: ${units}</h3>
      <p><strong>Earnings:</strong> $${maxEarnings}</p>
      <div>${solutionsHTML}</div>
    `;

    resultContainer.appendChild(resultCard);
  });
}