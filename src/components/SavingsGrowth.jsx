import { useId, useMemo, useState } from "react";
import "./SavingsGrowth.css";

// Nigerian Naira
export const CURRENCY = "₦";

// Illustrative annual returns, not guaranteed rates
const RATES = [
  { id: "save", label: "Savings account", rate: 0.04 },
  { id: "index", label: "Index fund", rate: 0.08 },
];

// Format amounts in Nigerian Naira
const money = (n) =>
  `₦${Math.round(n).toLocaleString("en-NG", {
    maximumFractionDigits: 0,
  })}`;

// Future value of weekly deposits with weekly compounding
function project(weekly, years, rate) {
  const r = rate / 52;
  const points = [];

  for (let y = 0; y <= years; y++) {
    const n = 52 * y;

    const value =
      r === 0
        ? weekly * n
        : weekly * ((Math.pow(1 + r, n) - 1) / r);

    points.push({
      y,
      value,
      paid: weekly * n,
    });
  }

  return points;
}

const CW = 480;
const CH = 200;

function SavingsGrowth() {
  const uid = useId();

  const [weekly, setWeekly] = useState(5000);
  const [years, setYears] = useState(10);
  const [rateId, setRateId] = useState("index");

  const rate = RATES.find((r) => r.id === rateId).rate;

  const points = useMemo(
    () => project(weekly, years, rate),
    [weekly, years, rate]
  );

  const final = points[points.length - 1];
  const growth = final.value - final.paid;

  // Scale the chart to the largest projected value
  const max = Math.max(...points.map((p) => p.value), 1);

  const x = (year) => (year / years) * CW;

  const yPos = (value) =>
    CH - (value / max) * (CH - 16);

  const line = (key) =>
    points
      .map(
        (p, i) =>
          `${i ? "L" : "M"}${x(p.y).toFixed(1)},${yPos(
            p[key]
          ).toFixed(1)}`
      )
      .join(" ");

  const valueLine = line("value");
  const paidLine = line("paid");

  const area = (d) => `${d} L${CW},${CH} L0,${CH} Z`;

  return (
    <div className="growthCard">
      <div className="growthTop">
        <p className="growthLabel">
          Your savings after {years}{" "}
          {years === 1 ? "year" : "years"}
        </p>

        <p className="growthTotal num" aria-live="polite">
          {money(final.value)}
        </p>

        <p className="growthSplit num">
          <span className="dot paid" />
          {money(final.paid)} saved

          <span className="dot grown" />
          {money(growth)} growth
        </p>
      </div>

      <svg
        className="growthChart"
        viewBox={`0 0 ${CW} ${CH}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`Saving ${money(weekly)} a week for ${years} years grows to approximately ${money(final.value)}`}
      >
        <defs>
          <linearGradient
            id={`${uid}-g`}
            x1="0"
            x2="0"
            y1="0"
            y2="1"
          >
            <stop
              offset="0"
              stopColor="var(--growth)"
              stopOpacity="0.45"
            />
            <stop
              offset="1"
              stopColor="var(--growth)"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1="0"
            x2={CW}
            y1={CH * f}
            y2={CH * f}
            className="gridLine"
          />
        ))}

        <path
          d={area(valueLine)}
          fill={`url(#${uid}-g)`}
        />

        <path
          d={area(paidLine)}
          className="paidArea"
        />

        <path
          d={paidLine}
          className="paidLine"
        />

        <path
          d={valueLine}
          className="valueLine"
          pathLength="1"
        />
      </svg>

      <div className="growthControls">
        <label className="slider">
          <span>
            Save each week{" "}
            <strong className="num">
              {money(weekly)}
            </strong>
          </span>

          <input
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={weekly}
            style={{
              "--fill": `${((weekly - 1000) / 99000) * 100}%`,
            }}
            onChange={(e) =>
              setWeekly(Number(e.target.value))
            }
          />
        </label>

        <label className="slider">
          <span>
            For{" "}
            <strong className="num">
              {years} {years === 1 ? "year" : "years"}
            </strong>
          </span>

          <input
            type="range"
            min="1"
            max="30"
            value={years}
            style={{
              "--fill": `${((years - 1) / 29) * 100}%`,
            }}
            onChange={(e) =>
              setYears(Number(e.target.value))
            }
          />
        </label>

        <div
          className="rateToggle"
          role="radiogroup"
          aria-label="Where the money is invested"
        >
          {RATES.map((r) => (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={rateId === r.id}
              className={rateId === r.id ? "on" : ""}
              onClick={() => setRateId(r.id)}
            >
              {r.label}{" "}
              <span className="num">
                {Math.round(r.rate * 100)}%
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="growthNote">
        Illustration only. Assumes a fixed annual return,
        compounded weekly, with weekly contributions.
        Actual returns vary, and fees, taxes, and inflation
        are not included.
      </p>
    </div>
  );
}

export default SavingsGrowth;