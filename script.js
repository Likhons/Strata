(function () {

  // =========================================================
  // STATIC CAP TABLE
  // =========================================================

  const FOUNDER_SHARES = 5500000;
  const EMPLOYEE_POOL_SHARES = 1300000;

  // Common shares = Founders + Employee Option Pool
  const COMMON_POOL = FOUNDER_SHARES + EMPLOYEE_POOL_SHARES; // 6,800,000

  const INVESTORS = [
    {
      name: "Seed",
      invested: 2000000
    },
    {
      name: "Series A",
      invested: 12000000
    },
    {
      name: "Series B",
      invested: 35000000
    }
  ];

  const TOTAL_INVESTED = INVESTORS.reduce(
    (sum, investor) => sum + investor.invested,
    0
  ); // $49,000,000

  const TOTAL_SHARES = 10000000;


  // =========================================================
  // FORMATTERS
  // =========================================================

  function fmtCompact(n) {

    const sign = n < 0 ? "-" : "";

    n = Math.abs(n);

    if (n >= 1e9) {
      return (
        sign +
        "$" +
        (n / 1e9).toFixed(2).replace(/\.00$/, ".0") +
        "B"
      );
    }

    if (n >= 1e6) {
      return sign + "$" + (n / 1e6).toFixed(1) + "M";
    }

    if (n >= 1e3) {
      return sign + "$" + (n / 1e3).toFixed(0) + "K";
    }

    return sign + "$" + n.toFixed(0);
  }


  function fmtUsd(n) {

    return (
      (n < 0 ? "-" : "") +
      "$" +
      Math.abs(Math.round(n)).toLocaleString("en-US")
    );

  }


  function fmtUsd2(n) {

    return (
      (n < 0 ? "-" : "") +
      "$" +
      Math.abs(n).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    );

  }


  function fmtShares(n) {

    return Math.round(n).toLocaleString("en-US");

  }


  // =========================================================
  // GET HTML ELEMENTS
  // =========================================================

  const exitValInput = document.getElementById("exitValInput");
  const sharesInput = document.getElementById("sharesInput");
  const vestingInput = document.getElementById("vestingInput");
  const prefInput = document.getElementById("prefInput");
  const strikeInput = document.getElementById("strikeInput");

  const exitValDisplay = document.getElementById("exitValDisplay");
  const sharesDisplay = document.getElementById("sharesDisplay");
  const vestingDisplay = document.getElementById("vestingDisplay");
  const prefDisplay = document.getElementById("prefDisplay");
  const strikeDisplay = document.getElementById("strikeDisplay");

  const prevPrefStack = document.getElementById("prevPrefStack");
  const prevRemaining = document.getElementById("prevRemaining");
  const prevPrice = document.getElementById("prevPrice");
  const prevPct = document.getElementById("prevPct");
  const prevVested = document.getElementById("prevVested");
  const prevPayout = document.getElementById("prevPayout");

  const exitStageVal = document.getElementById("exitStageVal");
  const exitSegPref = document.getElementById("exitSegPref");
  const exitSegFounders = document.getElementById("exitSegFounders");
  const exitSegEmployees = document.getElementById("exitSegEmployees");

  const finalPayout = document.getElementById("finalPayout");
  const payoutSub = document.querySelector(".payout-sub");

  const brVested = document.getElementById("brVested");
  const brPrice = document.getElementById("brPrice");
  const brGross = document.getElementById("brGross");
  const brExercise = document.getElementById("brExercise");
  const brNet = document.getElementById("brNet");

  const scenarioChart = document.getElementById("scenarioChart");

  const ALL_RANGE_INPUTS = [
    exitValInput,
    sharesInput,
    vestingInput,
    prefInput,
    strikeInput
  ];


  // =========================================================
  // CORE CALCULATION
  // =========================================================

  function calc(exitVal, shares, vestingPct, prefMultiple, strike) {

    // Amount preferred investors receive first
    const totalPref = Math.min(
      TOTAL_INVESTED * prefMultiple,
      exitVal
    );

    // Amount left for common shareholders
    const remainingForCommon = Math.max(
      exitVal - totalPref,
      0
    );

    // Common share price after preference
    const pricePerShare =
      COMMON_POOL > 0
        ? remainingForCommon / COMMON_POOL
        : 0;

    // Vested portion of employee's grant
    const vestedShares =
      shares * (vestingPct / 100);

    // Gross value of vested shares
    const gross =
      vestedShares * pricePerShare;

    // Cost to exercise options
    const exerciseCost =
      vestedShares * strike;

    // Net payout
    const net =
      Math.max(gross - exerciseCost, 0);

    // Investor payout
    const investorPayout =
      Math.min(
        TOTAL_INVESTED * prefMultiple,
        exitVal
      );

    // Founder payout
    const founderGross =
      FOUNDER_SHARES * pricePerShare;

    // Employee pool payout
    const employeePoolGross =
      EMPLOYEE_POOL_SHARES * pricePerShare;

    return {
      totalPref,
      remainingForCommon,
      pricePerShare,
      vestedShares,
      gross,
      exerciseCost,
      net,
      investorPayout,
      founderGross,
      employeePoolGross
    };
  }


  // =========================================================
  // READ CURRENT INPUTS
  // =========================================================

  function currentInputs() {

    return {
      exitVal: parseFloat(exitValInput.value) || 0,
      shares: parseFloat(sharesInput.value) || 0,
      vesting: parseFloat(vestingInput.value) || 0,
      pref: parseFloat(prefInput.value) || 1,
      strike: parseFloat(strikeInput.value) || 0
    };

  }


  // =========================================================
  // SLIDER FILL
  // =========================================================

  function updateSliderFill(input) {

    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    const val = parseFloat(input.value);

    const pct =
      max > min
        ? ((val - min) / (max - min)) * 100
        : 0;

    input.style.setProperty(
      "--fill",
      pct + "%"
    );

  }


  function updateAllSliderFills() {

    ALL_RANGE_INPUTS.forEach(
      updateSliderFill
    );

  }


  // =========================================================
  // LIVE PREVIEW
  // =========================================================

  function updateLive() {

    const {
      exitVal,
      shares,
      vesting,
      pref,
      strike
    } = currentInputs();

    const r = calc(
      exitVal,
      shares,
      vesting,
      pref,
      strike
    );


    // Input display values
    exitValDisplay.textContent =
      fmtCompact(exitVal);

    sharesDisplay.textContent =
      fmtShares(shares);

    vestingDisplay.textContent =
      vesting + "%";

    prefDisplay.textContent =
      pref.toFixed(1) + "×";

    strikeDisplay.textContent =
      fmtUsd2(strike);


    // Live preview
    prevPrefStack.textContent =
      fmtCompact(r.totalPref);

    prevRemaining.textContent =
      fmtCompact(r.remainingForCommon);

    prevPrice.textContent =
      fmtUsd2(r.pricePerShare);

    prevPct.textContent =
      ((shares / TOTAL_SHARES) * 100).toFixed(2) + "%";

    prevVested.textContent =
      fmtShares(r.vestedShares);

    prevPayout.textContent =
      fmtUsd(r.net);


    // =======================================================
    // EXIT WATERFALL BAR
    // =======================================================

    exitStageVal.textContent =
      fmtCompact(exitVal);

    const prefPct =
      exitVal > 0
        ? (r.investorPayout / exitVal) * 100
        : 0;

    const foundersPct =
      exitVal > 0
        ? (r.founderGross / exitVal) * 100
        : 0;

    const employeesPct =
      exitVal > 0
        ? (r.employeePoolGross / exitVal) * 100
        : 0;


    exitSegPref.style.width =
      prefPct + "%";

    exitSegFounders.style.width =
      foundersPct + "%";

    exitSegEmployees.style.width =
      employeesPct + "%";


    updateAllSliderFills();

  }


  // =========================================================
  // SCENARIO COMPARISON
  // =========================================================

  const SCENARIOS = [
    100000000,
    250000000,
    500000000,
    750000000,
    1000000000
  ];


  function renderScenarioChart(activeExitVal) {

    const {
      shares,
      vesting,
      pref,
      strike
    } = currentInputs();


    const results = SCENARIOS.map(
      value => ({
        value,
        net: calc(
          value,
          shares,
          vesting,
          pref,
          strike
        ).net
      })
    );


    const maxNet =
      Math.max(
        ...results.map(
          result => result.net
        ),
        1
      );


    // Find closest scenario
    let closestIdx = 0;
    let closestDiff = Infinity;


    results.forEach(
      (result, index) => {

        const diff =
          Math.abs(
            result.value - activeExitVal
          );

        if (diff < closestDiff) {

          closestDiff = diff;
          closestIdx = index;

        }

      }
    );


    scenarioChart.innerHTML = "";


    results.forEach(
      (result, index) => {

        const col =
          document.createElement("div");

        col.className =
          "scenario-bar-col" +
          (index === closestIdx
            ? " is-current"
            : "");


        const bar =
          document.createElement("div");

        bar.className =
          "scenario-bar" +
          (index === closestIdx
            ? " highlight"
            : "");


        bar.style.height = "2px";


        const valTag =
          document.createElement("div");

        valTag.className =
          "bar-val";

        valTag.textContent =
          fmtCompact(result.net);

        bar.appendChild(valTag);


        const label =
          document.createElement("div");

        label.className =
          "bar-label";

        label.textContent =
          fmtCompact(result.value) +
          (
            index === closestIdx
              ? " · current"
              : ""
          );


        col.appendChild(bar);
        col.appendChild(label);

        scenarioChart.appendChild(col);


        requestAnimationFrame(() => {

          requestAnimationFrame(() => {

            const pctHeight =
              Math.max(
                (result.net / maxNet) * 100,
                2
              );

            bar.style.height =
              pctHeight + "%";

          });

        });

      }
    );

  }


  // =========================================================
  // COUNT-UP ANIMATION
  // =========================================================

  function animateCountUp(
    element,
    from,
    to,
    duration,
    formatter
  ) {

    const start =
      performance.now();


    function frame(now) {

      const t =
        Math.min(
          (now - start) / duration,
          1
        );


      const eased =
        1 - Math.pow(1 - t, 3);


      const value =
        from +
        (to - from) * eased;


      element.textContent =
        formatter(value);


      if (t < 1) {

        requestAnimationFrame(frame);

      } else {

        element.textContent =
          formatter(to);

      }

    }


    requestAnimationFrame(frame);

  }


  // =========================================================
  // RUN SIMULATION
  // =========================================================

  function runSimulation() {

    const {
      exitVal,
      shares,
      vesting,
      pref,
      strike
    } = currentInputs();


    const r =
      calc(
        exitVal,
        shares,
        vesting,
        pref,
        strike
      );


    // Get previous payout
    const previousText =
      finalPayout.textContent || "$0";


    const previousValue =
      parseFloat(
        previousText.replace(
          /[^0-9.-]/g,
          ""
        )
      ) || 0;


    // Animate final payout
    animateCountUp(
      finalPayout,
      previousValue,
      r.net,
      700,
      fmtUsd
    );


    // Subtitle
    payoutSub.textContent =
      "Net of exercise cost, at a " +
      fmtCompact(exitVal) +
      " exit";


    // Breakdown
    brVested.textContent =
      fmtShares(r.vestedShares) +
      " sh";

    brPrice.textContent =
      fmtUsd2(r.pricePerShare) +
      " / sh";

    brGross.textContent =
      fmtUsd(r.gross);

    brExercise.textContent =
      "−" +
      fmtUsd(r.exerciseCost);

    brNet.textContent =
      fmtUsd(r.net);


    // Scenario chart
    renderScenarioChart(exitVal);


    // Highlight result card
    const heroCard =
      document.querySelector(
        ".result-hero"
      );


    if (heroCard) {

      heroCard.style.transition =
        "box-shadow .4s ease, border-color .4s ease";

      heroCard.style.borderColor =
        "rgba(242,184,75,0.55)";

      heroCard.style.boxShadow =
        "0 0 0 1px rgba(242,184,75,0.25), " +
        "0 20px 50px -20px rgba(242,184,75,0.35)";


      setTimeout(() => {

        heroCard.style.borderColor = "";
        heroCard.style.boxShadow = "";

      }, 900);

    }


    // Scroll to results
    const resultsSection =
      document.getElementById(
        "results-section"
      );


    if (resultsSection) {

      resultsSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }

  }


  // =========================================================
  // EVENT LISTENERS
  // =========================================================

  ALL_RANGE_INPUTS.forEach(
    input => {

      input.addEventListener(
        "input",
        updateLive
      );

    }
  );


  const runButton =
    document.getElementById(
      "runSimBtn"
    );


  if (runButton) {

    runButton.addEventListener(
      "click",
      runSimulation
    );

  }


  // =========================================================
  // INITIALIZE
  // =========================================================

  updateAllSliderFills();

  updateLive();

  renderScenarioChart(
    parseFloat(exitValInput.value)
  );

})();
