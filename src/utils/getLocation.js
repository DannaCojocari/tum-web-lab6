export async function getLocationInfo(cityName) {
  try {
    // Nominatim (OpenStreetMap) - gets country from city name
    const nominatimRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1&addressdetails=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const nominatimData = await nominatimRes.json();

    let country = "";
    let continent = "Europe";

    if (nominatimData.length > 0) {
      const address = nominatimData[0].address;
      country = address.country || "";
      continent = mapCountryToContinent(address.country_code?.toUpperCase());
    }

    // Wikipedia - gets description
    const wikiRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`
    );
    const wikiData = await wikiRes.json();
    const description = wikiData.extract
      ? wikiData.extract.split(".")[0] + "."
      : `Discover the beauty of ${cityName}.`;

    return { country, continent, description };

  } catch (err) {
    console.error("Failed to fetch location info:", err);
    return {
      country: "",
      continent: "Europe",
      description: `Discover the beauty of ${cityName}.`
    };
  }
}

function mapCountryToContinent(countryCode) {
  const europe = ["AL","AD","AT","BY","BE","BA","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IE","IT","XK","LV","LI","LT","LU","MT","MD","MC","ME","NL","MK","NO","PL","PT","RO","RU","SM","RS","SK","SI","ES","SE","CH","UA","GB","VA"];
  const asia = ["AF","AM","AZ","BH","BD","BT","BN","KH","CN","GE","IN","ID","IR","IQ","IL","JP","JO","KZ","KW","KG","LA","LB","MY","MV","MN","MM","NP","KP","OM","PK","PS","PH","QA","SA","SG","KR","LK","SY","TW","TJ","TH","TL","TR","TM","AE","UZ","VN","YE"];
  const africa = ["DZ","AO","BJ","BW","BF","BI","CM","CV","CF","TD","KM","CG","CD","CI","DJ","EG","GQ","ER","ET","GA","GM","GH","GN","GW","KE","LS","LR","LY","MG","MW","ML","MR","MU","YT","MA","MZ","NA","NE","NG","RE","RW","ST","SN","SC","SL","SO","ZA","SS","SD","SZ","TZ","TG","TN","UG","EH","ZM","ZW"];
  const americas = ["AG","AR","BS","BB","BZ","BO","BR","CA","CL","CO","CR","CU","DM","DO","EC","SV","GD","GT","GY","HT","HN","JM","MX","NI","PA","PY","PE","KN","LC","VC","SR","TT","US","UY","VE"];
  const oceania = ["AU","FJ","KI","MH","FM","NR","NZ","PW","PG","WS","SB","TO","TV","VU"];

  if (europe.includes(countryCode)) return "Europe";
  if (asia.includes(countryCode)) return "Asia";
  if (africa.includes(countryCode)) return "Africa";
  if (americas.includes(countryCode)) return "America";
  if (oceania.includes(countryCode)) return "Oceania";
  return "Europe";
}