import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import * as d3 from "d3";
import * as topojson from "topojson-client";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const ISO_TO_NAME = {
  "004": "Afghanistan", "008": "Albania", "012": "Algeria", "024": "Angola",
  "032": "Argentina", "051": "Armenia", "036": "Australia", "040": "Austria",
  "050": "Bangladesh", "112": "Belarus", "056": "Belgium", "068": "Bolivia",
  "076": "Brazil", "100": "Bulgaria", "116": "Cambodia", "120": "Cameroon",
  "124": "Canada", "152": "Chile", "156": "China", "170": "Colombia",
  "188": "Costa Rica", "191": "Croatia", "192": "Cuba", "203": "Czech Republic",
  "208": "Denmark", "218": "Ecuador", "818": "Egypt", "231": "Ethiopia",
  "246": "Finland", "250": "France", "276": "Germany", "288": "Ghana",
  "300": "Greece", "320": "Guatemala", "340": "Honduras", "348": "Hungary",
  "356": "India", "360": "Indonesia", "364": "Iran", "368": "Iraq",
  "372": "Ireland", "376": "Israel", "380": "Italy", "388": "Jamaica",
  "392": "Japan", "400": "Jordan", "398": "Kazakhstan", "404": "Kenya",
  "410": "South Korea", "414": "Kuwait", "418": "Laos", "428": "Latvia",
  "422": "Lebanon", "434": "Libya", "440": "Lithuania", "450": "Madagascar",
  "458": "Malaysia", "466": "Mali", "484": "Mexico", "496": "Mongolia",
  "504": "Morocco", "508": "Mozambique", "104": "Myanmar", "524": "Nepal",
  "528": "Netherlands", "554": "New Zealand", "558": "Nicaragua",
  "562": "Niger", "566": "Nigeria", "578": "Norway", "512": "Oman",
  "586": "Pakistan", "591": "Panama", "600": "Paraguay", "604": "Peru",
  "608": "Philippines", "616": "Poland", "620": "Portugal", "634": "Qatar",
  "642": "Romania", "643": "Russia", "682": "Saudi Arabia", "688": "Serbia",
  "703": "Slovakia", "705": "Slovenia", "706": "Somalia", "710": "South Africa",
  "728": "South Sudan", "724": "Spain", "144": "Sri Lanka", "729": "Sudan",
  "752": "Sweden", "756": "Switzerland", "760": "Syria", "834": "Tanzania",
  "764": "Thailand", "788": "Tunisia", "792": "Turkey", "800": "Uganda",
  "804": "Ukraine", "784": "United Arab Emirates", "826": "United Kingdom",
  "840": "United States", "858": "Uruguay", "862": "Venezuela", "704": "Vietnam",
  "887": "Yemen", "894": "Zambia", "716": "Zimbabwe", "498": "Moldova",
  "807": "North Macedonia", "499": "Montenegro", "070": "Bosnia and Herzegovina",
};

function buildCountryStatus(destinations) {
  const map = {};
  destinations.forEach((d) => {
    const s = d.status?.toLowerCase();
    const iso = Object.keys(ISO_TO_NAME).find(
      (k) => ISO_TO_NAME[k].toLowerCase() === d.country?.toLowerCase()
    );
    if (!iso) return;
    if (s === "visited") {
      map[iso] = "visited";
    } else if (s === "planned" && map[iso] !== "visited") {
      map[iso] = "planned";
    }
  });
  return map;
}

function buildTooltipMap(destinations) {
  const map = {};
  destinations.forEach((d) => {
    const iso = Object.keys(ISO_TO_NAME).find(
      (k) => ISO_TO_NAME[k].toLowerCase() === d.country?.toLowerCase()
    );
    if (!iso) return;
    if (!map[iso]) map[iso] = [];
    map[iso].push({ name: d.name, status: d.status });
  });
  return map;
}

export default function WorldMap() {
  const { destinations } = useContext(AppContext);
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const countryStatus = buildCountryStatus(destinations);
  const tooltipMap = buildTooltipMap(destinations);

  const visited = Object.values(countryStatus).filter((s) => s === "visited").length;
  const planned = Object.values(countryStatus).filter((s) => s === "planned").length;
  const pct = Math.round((visited / 195) * 100);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    const width = container.clientWidth || 900;
    const height = Math.round(width * 0.5);

    svg.attr("viewBox", `0 0 ${width} ${height}`)
       .attr("width", "100%")
       .attr("preserveAspectRatio", "xMidYMid meet");

    const projection = d3.geoNaturalEarth1()
      .scale(width / 6.2)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    const g = svg.append("g");

    d3.json(GEO_URL).then((world) => {
      const countries = topojson.feature(world, world.objects.countries);

      g.selectAll("path")
        .data(countries.features)
        .join("path")
        .attr("d", path)
        .attr("fill", (d) => {
          const iso = String(d.id).padStart(3, "0");
          const s = countryStatus[iso];
          if (s === "visited") return "#2A6496";
          if (s === "planned") return "#C0603A";
          return "var(--map-country, #c8bfa8)";
        })
        .attr("stroke", (d) => {
          const iso = String(d.id).padStart(3, "0");
          const s = countryStatus[iso];
          if (s === "visited") return "#1a4a72";
          if (s === "planned") return "#9a4a28";
          return "var(--map-border, #b0a48c)";
        })
        .attr("stroke-width", 0.4)
        .style("cursor", (d) => {
          const iso = String(d.id).padStart(3, "0");
          return tooltipMap[iso] ? "pointer" : "default";
        })
        .on("mousemove", function (event, d) {
          const iso = String(d.id).padStart(3, "0");
          const data = tooltipMap[iso];
          if (!data) return;
          setTooltip({
            x: event.clientX,
            y: event.clientY,
            country: ISO_TO_NAME[iso] || String(d.id),
            items: data,
          });
        })
        .on("mouseleave", function () {
          setTooltip(null);
        });

      setLoaded(true);
    });

    return () => {
      svg.selectAll("*").remove();
      svg.on(".zoom", null);
    };
  }, [destinations]);

  return (
    <div className="map-page">
      <div className="map-header">
        <h1>My World Map</h1>
        <p>Track everywhere you've been and where you're going</p>
      </div>

      <div className="map-legend">
        <span className="legend-item">
          <span className="legend-dot" style={{ background: "var(--map-country, #c8bfa8)", border: "1px solid var(--map-border, #b0a48c)" }} />
          Not visited
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: "#C0603A" }} />
          Planned
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: "#2A6496" }} />
          Visited
        </span>
        <span className="legend-hint">Scroll to zoom · Drag to pan</span>
      </div>

      <div className="map-container" ref={containerRef}>
        {!loaded && <div className="map-loading">Loading map...</div>}
        <svg ref={svgRef} />
        {tooltip && (
          <div
            className="map-tooltip"
            style={{ left: tooltip.x + 14, top: tooltip.y - 14 }}
          >
            <strong>{tooltip.country}</strong>
            {tooltip.items.map((it, i) => (
              <div key={i} className="tooltip-line">
                {it.name} · {it.status}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="map-stats">
        <div className="map-stat">
          <span className="map-stat-num">{visited}</span>
          <span className="map-stat-sub">{pct}% of world</span>
          <span className="map-stat-label">🌍 Countries Visited</span>
        </div>
        <div className="map-stat">
          <span className="map-stat-num">{planned}</span>
          <span className="map-stat-sub">&nbsp;</span>
          <span className="map-stat-label">📌 Countries Planned</span>
        </div>
        <div className="map-stat">
          <span className="map-stat-num">195</span>
          <span className="map-stat-sub">&nbsp;</span>
          <span className="map-stat-label">🗺️ Countries Total</span>
        </div>
      </div>
    </div>
  );
}