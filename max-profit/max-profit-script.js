const THEATRE = { time: 5, rate: 1500 };
const PUB = { time: 4, rate: 1000 };
const COMMERCIAL_PARK = { time: 10, rate: 3000 };

function findMaxEarnings(timeUnits) {

  const dp = new Array(timeUnits + 1).fill(null).map(() => ({
    earnings: 0,
    combinations: []
  }));

  dp[0] = { earnings: 0, combinations: [{ T: 0, P: 0, C: 0 }] };


  for (let t = 1; t <= timeUnits; t++) {
    let maxEarnings = 0;
    let bestCombinations = [];

    if (t >= THEATRE.time) {
      const remainingTime = t - THEATRE.time;
      const earnings = dp[remainingTime].earnings + (remainingTime * THEATRE.rate);
      
      if (earnings > maxEarnings) {
        maxEarnings = earnings;
        bestCombinations = dp[remainingTime].combinations.map(combo => ({
          T: combo.T + 1,
          P: combo.P,
          C: combo.C
        }));
      } else if (earnings === maxEarnings) {
        bestCombinations.push(...dp[remainingTime].combinations.map(combo => ({
          T: combo.T + 1,
          P: combo.P,
          C: combo.C
        })));
      }
    }

    if (t >= PUB.time) {
      const remainingTime = t - PUB.time;
      const earnings = dp[remainingTime].earnings + (remainingTime * PUB.rate);
      
      if (earnings > maxEarnings) {
        maxEarnings = earnings;
        bestCombinations = dp[remainingTime].combinations.map(combo => ({
          T: combo.T,
          P: combo.P + 1,
          C: combo.C
        }));
      } else if (earnings === maxEarnings) {
        bestCombinations.push(...dp[remainingTime].combinations.map(combo => ({
          T: combo.T,
          P: combo.P + 1,
          C: combo.C
        })));
      }
    }

    if (t >= COMMERCIAL_PARK.time) {
      const remainingTime = t - COMMERCIAL_PARK.time;
      const earnings = dp[remainingTime].earnings + (remainingTime * COMMERCIAL_PARK.rate);
      
      if (earnings > maxEarnings) {
        maxEarnings = earnings;
        bestCombinations = dp[remainingTime].combinations.map(combo => ({
          T: combo.T,
          P: combo.P,
          C: combo.C + 1
        }));
      } else if (earnings === maxEarnings) {
        bestCombinations.push(...dp[remainingTime].combinations.map(combo => ({
          T: combo.T,
          P: combo.P,
          C: combo.C + 1
        })));
      }
    }

    if (maxEarnings === 0) {
      dp[t] = dp[t - 1];
    } else {
      const uniqueCombinations = Array.from(new Set(bestCombinations.map(JSON.stringify))).map(JSON.parse);
      dp[t] = {
        earnings: maxEarnings,
        combinations: uniqueCombinations
      };
    }
  }

  return dp[timeUnits];
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

    const { earnings, combinations } = findMaxEarnings(units);

    const resultCard = document.createElement("div");
    resultCard.classList.add("result-card");

    let solutionsHTML = "";
    combinations.forEach((sol, idx) => {
      solutionsHTML += `<p>${idx + 1}. T: ${sol.T}, P: ${sol.P}, C: ${sol.C}</p>`;
    });

    resultCard.innerHTML = `
      <h3>Time Units: ${units}</h3>
      <p><strong>Earnings:</strong> $${earnings}</p>
      <div>${solutionsHTML}</div>
    `;

    resultContainer.appendChild(resultCard);
  });
}