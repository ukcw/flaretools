import { CheckIcon, CloseIcon, CopyIcon } from "@chakra-ui/icons";
import {
  Button,
  Heading,
  HStack,
  Spacer,
  Stack,
  Tag,
  TagLabel,
  TagLeftIcon,
} from "@chakra-ui/react";

export const Humanize = (str) => {
  if (str === "js_challenge") {
    return "JS Challenge";
  } else if (str === "zero_rtt") {
    return "0-RTT Connection Resumption";
  } else if (str === "opportunistic_onion") {
    return "Onion Routing";
  } else if (str === "pseudo_ipv4") {
    return "Psuedo IPv4";
  } else if (str === "ip_geolocation") {
    return "IP Geolocation";
  } else if (str === "max_upload") {
    return "Maximum Upload Size";
  } else if (str === "true_client_ip_header") {
    return "True-Client-IP-Header";
  } else if (str === "tls_1_3") {
    return "TLS 1.3";
  } else if (str === "tls_client_auth") {
    return "Authenticated Origin Pulls";
  } else if (str === "min_tls_version") {
    return "Minimum TLS Version";
  } else if (str === "strip_uri") {
    return "Strip URI";
  } else if (str === "normalization_type") {
    return "Normalization Type";
  } else if (str === "incoming_urls") {
    return "Incoming URLs";
  } else if (str === "urls_to_origin") {
    return "URLs to origin";
  } else {
    var i,
      frags = str.split("_");
    for (i = 0; i < frags.length; i++) {
      if (frags[i] === "https") {
        frags[i] = "HTTPS";
      } else if (frags[i] === "http") {
        frags[i] = "HTTP";
      } else if (frags[i] === "ttl") {
        frags[i] = "TTL";
      } else if (frags[i] === "url") {
        frags[i] = "URL";
      } else if (frags[i] === "ssl") {
        frags[i] = "SSL";
      } else if (frags[i] === "waf") {
        frags[i] = "WAF";
      } else if (frags[i] === "ddos") {
        frags[i] = "DDoS";
      } else if (frags[i] === "http2") {
        frags[i] = "HTTP/2";
      } else if (frags[i] === "http3") {
        frags[i] = "HTTP/3 (with QUIC)";
      } else if (frags[i] === "ipv6") {
        frags[i] = "IPv6 Compatibility";
      } else if (frags[i] === "grpc") {
        frags[i] = "gRPC";
      } else if (frags[i] === "websockets") {
        frags[i] = "WebSockets";
      } else if (frags[i] === "ip") {
        frags[i] = "IP";
      } else if (frags[i] === "ipv4") {
        frags[i] = "IPv4";
      } else if (frags[i] === "ipv6") {
        frags[i] = "IPv6";
      } else if (frags[i] === "cname") {
        frags[i] = "CNAME";
      } else if (frags[i] === "html") {
        frags[i] = "HTML";
      } else if (frags[i] === "css") {
        frags[i] = "CSS";
      } else if (frags[i] === "js") {
        frags[i] = "JS";
      } else if (frags[i] === "0rtt") {
        frags[i] = "0-RTT Connection Resumption";
      } else if (frags[i] === "owasp") {
        frags[i] = "OWASP";
      } else if (frags[i] === "modsecurity") {
        frags[i] = "ModSecurity";
      } else if (frags[i] === "dns") {
        frags[i] = "DNS";
      } else if (frags[i] === "dnssec") {
        frags[i] = "DNSSEC";
      } else {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
      }
    }
    return frags.join(" ");
  }
};

export const GetExpressionOutput = (expr) => {
  if (/ip.geoip.country /.test(expr)) {
    return "Country";
  } else if (/ip.geoip.continent /.test(expr)) {
    return "Continent";
  } else if (/http.host /.test(expr)) {
    return "Hostname";
  } else if (/ip.geoip.asnum /.test(expr)) {
    return "AS Num";
  } else if (/http.cookie /.test(expr)) {
    return "Cookie";
  } else if (/ip.src /.test(expr)) {
    return "IP Source Address";
  } else if (/http.referer /.test(expr)) {
    return "Referer";
  } else if (/http.request.method /.test(expr)) {
    return "Request Method";
  } else if (/ssl /.test(expr)) {
    return "SSL/HTTPS";
  } else if (/http.request.full_uri /.test(expr)) {
    return "URI Full";
  } else if (/http.request.uri /.test(expr)) {
    return "URI";
  } else if (/http.request.uri.path /.test(expr)) {
    return "URI Path";
  } else if (/http.request.uri.query /.test(expr)) {
    return "URI Query";
  } else if (/http.request.version /.test(expr)) {
    return "HTTP Version";
  } else if (/http.user_agent /.test(expr)) {
    return "User Agent";
  } else if (/http.x_forwarded_for /.test(expr)) {
    return "X-Forwarded-For";
  } else if (/cf.tls_client_auth.cert_verified /.test(expr)) {
    return "Client Certificate Verified";
  } else if (/ip.geoip.is_in_european_union /.test(expr)) {
    return "European Union";
  } else {
    return expr;
  }
};

export const CountryCodeLookup = (countryCode) => {
  const countryStore = {
    af: { code: "af", name: "Afghanistan" },
    ax: { code: "ax", name: "Åland Islands" },
    al: { code: "al", name: "Albania" },
    dz: { code: "dz", name: "Algeria" },
    as: { code: "as", name: "American Samoa" },
    ad: { code: "ad", name: "AndorrA" },
    ao: { code: "ao", name: "Angola" },
    ai: { code: "ai", name: "Anguilla" },
    aq: { code: "aq", name: "Antarctica" },
    ag: { code: "ag", name: "Antigua and Barbuda" },
    ar: { code: "ar", name: "Argentina" },
    am: { code: "am", name: "Armenia" },
    aw: { code: "aw", name: "Aruba" },
    au: { code: "au", name: "Australia" },
    at: { code: "at", name: "Austria" },
    az: { code: "az", name: "Azerbaijan" },
    bs: { code: "bs", name: "Bahamas" },
    bh: { code: "bh", name: "Bahrain" },
    bd: { code: "bd", name: "Bangladesh" },
    bb: { code: "bb", name: "Barbados" },
    by: { code: "by", name: "Belarus" },
    be: { code: "be", name: "Belgium" },
    bz: { code: "bz", name: "Belize" },
    bj: { code: "bj", name: "Benin" },
    bm: { code: "bm", name: "Bermuda" },
    bt: { code: "bt", name: "Bhutan" },
    bo: { code: "bo", name: "Bolivia" },
    ba: { code: "ba", name: "Bosnia and Herzegovina" },
    bw: { code: "bw", name: "Botswana" },
    bv: { code: "bv", name: "Bouvet Island" },
    br: { code: "br", name: "Brazil" },
    io: { code: "io", name: "British Indian Ocean Territory" },
    bn: { code: "bn", name: "Brunei Darussalam" },
    bg: { code: "bg", name: "Bulgaria" },
    bf: { code: "bf", name: "Burkina Faso" },
    bi: { code: "bi", name: "Burundi" },
    kh: { code: "kh", name: "Cambodia" },
    cm: { code: "cm", name: "Cameroon" },
    ca: { code: "ca", name: "Canada" },
    cv: { code: "cv", name: "Cape Verde" },
    ky: { code: "ky", name: "Cayman Islands" },
    cf: { code: "cf", name: "Central African Republic" },
    td: { code: "td", name: "Chad" },
    cl: { code: "cl", name: "Chile" },
    cn: { code: "cn", name: "China" },
    cx: { code: "cx", name: "Christmas Island" },
    cc: { code: "cc", name: "Cocos (Keeling) Islands" },
    co: { code: "co", name: "Colombia" },
    km: { code: "km", name: "Comoros" },
    cg: { code: "cg", name: "Congo" },
    cd: { code: "cd", name: "Congo, Democratic Republic" },
    ck: { code: "ck", name: "Cook Islands" },
    cr: { code: "cr", name: "Costa Rica" },
    ci: { code: "ci", name: 'Cote D"Ivoire' },
    hr: { code: "hr", name: "Croatia" },
    cu: { code: "cu", name: "Cuba" },
    cy: { code: "cy", name: "Cyprus" },
    cz: { code: "cz", name: "Czech Republic" },
    dk: { code: "dk", name: "Denmark" },
    dj: { code: "dj", name: "Djibouti" },
    dm: { code: "dm", name: "Dominica" },
    do: { code: "do", name: "Dominican Republic" },
    ec: { code: "ec", name: "Ecuador" },
    eg: { code: "eg", name: "Egypt" },
    sv: { code: "sv", name: "El Salvador" },
    gq: { code: "gq", name: "Equatorial Guinea" },
    er: { code: "er", name: "Eritrea" },
    ee: { code: "ee", name: "Estonia" },
    et: { code: "et", name: "Ethiopia" },
    fk: { code: "fk", name: "Falkland Islands (Malvinas)" },
    fo: { code: "fo", name: "Faroe Islands" },
    fj: { code: "fj", name: "Fiji" },
    fi: { code: "fi", name: "Finland" },
    fr: { code: "fr", name: "France" },
    gf: { code: "gf", name: "French Guiana" },
    pf: { code: "pf", name: "French Polynesia" },
    tf: { code: "tf", name: "French Southern Territories" },
    ga: { code: "ga", name: "Gabon" },
    gm: { code: "gm", name: "Gambia" },
    ge: { code: "ge", name: "Georgia" },
    de: { code: "de", name: "Germany" },
    gh: { code: "gh", name: "Ghana" },
    gi: { code: "gi", name: "Gibraltar" },
    gr: { code: "gr", name: "Greece" },
    gl: { code: "gl", name: "Greenland" },
    gd: { code: "gd", name: "Grenada" },
    gp: { code: "gp", name: "Guadeloupe" },
    gu: { code: "gu", name: "Guam" },
    gt: { code: "gt", name: "Guatemala" },
    gg: { code: "gg", name: "Guernsey" },
    gn: { code: "gn", name: "Guinea" },
    gw: { code: "gw", name: "Guinea-Bissau" },
    gy: { code: "gy", name: "Guyana" },
    ht: { code: "ht", name: "Haiti" },
    hm: { code: "hm", name: "Heard Island and Mcdonald Islands" },
    va: { code: "va", name: "Holy See (Vatican City State)" },
    hn: { code: "hn", name: "Honduras" },
    hk: { code: "hk", name: "Hong Kong" },
    hu: { code: "hu", name: "Hungary" },
    is: { code: "is", name: "Iceland" },
    in: { code: "in", name: "India" },
    id: { code: "id", name: "Indonesia" },
    ir: { code: "ir", name: "Iran" },
    iq: { code: "iq", name: "Iraq" },
    ie: { code: "ie", name: "Ireland" },
    im: { code: "im", name: "Isle of Man" },
    il: { code: "il", name: "Israel" },
    it: { code: "it", name: "Italy" },
    jm: { code: "jm", name: "Jamaica" },
    jp: { code: "jp", name: "Japan" },
    je: { code: "je", name: "Jersey" },
    jo: { code: "jo", name: "Jordan" },
    kz: { code: "kz", name: "Kazakhstan" },
    ke: { code: "ke", name: "Kenya" },
    ki: { code: "ki", name: "Kiribati" },
    kp: { code: "kp", name: "Korea (North)" },
    kr: { code: "kr", name: "Korea (South)" },
    xk: { code: "xk", name: "Kosovo" },
    kw: { code: "kw", name: "Kuwait" },
    kg: { code: "kg", name: "Kyrgyzstan" },
    la: { code: "la", name: "Laos" },
    lv: { code: "lv", name: "Latvia" },
    lb: { code: "lb", name: "Lebanon" },
    ls: { code: "ls", name: "Lesotho" },
    lr: { code: "lr", name: "Liberia" },
    ly: { code: "ly", name: "Libyan Arab Jamahiriya" },
    li: { code: "li", name: "Liechtenstein" },
    lt: { code: "lt", name: "Lithuania" },
    lu: { code: "lu", name: "Luxembourg" },
    mo: { code: "mo", name: "Macao" },
    mk: { code: "mk", name: "Macedonia" },
    mg: { code: "mg", name: "Madagascar" },
    mw: { code: "mw", name: "Malawi" },
    my: { code: "my", name: "Malaysia" },
    mv: { code: "mv", name: "Maldives" },
    ml: { code: "ml", name: "Mali" },
    mt: { code: "mt", name: "Malta" },
    mh: { code: "mh", name: "Marshall Islands" },
    mq: { code: "mq", name: "Martinique" },
    mr: { code: "mr", name: "Mauritania" },
    mu: { code: "mu", name: "Mauritius" },
    yt: { code: "yt", name: "Mayotte" },
    mx: { code: "mx", name: "Mexico" },
    fm: { code: "fm", name: "Micronesia" },
    md: { code: "md", name: "Moldova" },
    mc: { code: "mc", name: "Monaco" },
    mn: { code: "mn", name: "Mongolia" },
    ms: { code: "ms", name: "Montserrat" },
    ma: { code: "ma", name: "Morocco" },
    mz: { code: "mz", name: "Mozambique" },
    mm: { code: "mm", name: "Myanmar" },
    na: { code: "na", name: "Namibia" },
    nr: { code: "nr", name: "Nauru" },
    np: { code: "np", name: "Nepal" },
    nl: { code: "nl", name: "Netherlands" },
    an: { code: "an", name: "Netherlands Antilles" },
    nc: { code: "nc", name: "New Caledonia" },
    nz: { code: "nz", name: "New Zealand" },
    ni: { code: "ni", name: "Nicaragua" },
    ne: { code: "ne", name: "Niger" },
    ng: { code: "ng", name: "Nigeria" },
    nu: { code: "nu", name: "Niue" },
    nf: { code: "nf", name: "Norfolk Island" },
    mp: { code: "mp", name: "Northern Mariana Islands" },
    no: { code: "no", name: "Norway" },
    om: { code: "om", name: "Oman" },
    pk: { code: "pk", name: "Pakistan" },
    pw: { code: "pw", name: "Palau" },
    ps: { code: "ps", name: "Palestinian Territory, Occupied" },
    pa: { code: "pa", name: "Panama" },
    pg: { code: "pg", name: "Papua New Guinea" },
    py: { code: "py", name: "Paraguay" },
    pe: { code: "pe", name: "Peru" },
    ph: { code: "ph", name: "Philippines" },
    pn: { code: "pn", name: "Pitcairn" },
    pl: { code: "pl", name: "Poland" },
    pt: { code: "pt", name: "Portugal" },
    pr: { code: "pr", name: "Puerto Rico" },
    qa: { code: "qa", name: "Qatar" },
    re: { code: "re", name: "Reunion" },
    ro: { code: "ro", name: "Romania" },
    ru: { code: "ru", name: "Russian Federation" },
    rw: { code: "rw", name: "Rwanda" },
    sh: { code: "sh", name: "Saint Helena" },
    kn: { code: "kn", name: "Saint Kitts and Nevis" },
    lc: { code: "lc", name: "Saint Lucia" },
    pm: { code: "pm", name: "Saint Pierre and Miquelon" },
    vc: { code: "vc", name: "Saint Vincent and the Grenadines" },
    ws: { code: "ws", name: "Samoa" },
    sm: { code: "sm", name: "San Marino" },
    st: { code: "st", name: "Sao Tome and Principe" },
    sa: { code: "sa", name: "Saudi Arabia" },
    sn: { code: "sn", name: "Senegal" },
    rs: { code: "rs", name: "Serbia" },
    me: { code: "me", name: "Montenegro" },
    sc: { code: "sc", name: "Seychelles" },
    sl: { code: "sl", name: "Sierra Leone" },
    sg: { code: "sg", name: "Singapore" },
    sk: { code: "sk", name: "Slovakia" },
    si: { code: "si", name: "Slovenia" },
    sb: { code: "sb", name: "Solomon Islands" },
    so: { code: "so", name: "Somalia" },
    za: { code: "za", name: "South Africa" },
    gs: { code: "gs", name: "South Georgia and the South Sandwich Islands" },
    es: { code: "es", name: "Spain" },
    lk: { code: "lk", name: "Sri Lanka" },
    sd: { code: "sd", name: "Sudan" },
    sr: { code: "sr", name: "Suriname" },
    sj: { code: "sj", name: "Svalbard and Jan Mayen" },
    sz: { code: "sz", name: "Swaziland" },
    se: { code: "se", name: "Sweden" },
    ch: { code: "ch", name: "Switzerland" },
    sy: { code: "sy", name: "Syrian Arab Republic" },
    tw: { code: "tw", name: "Taiwan, Province of China" },
    tj: { code: "tj", name: "Tajikistan" },
    tz: { code: "tz", name: "Tanzania" },
    th: { code: "th", name: "Thailand" },
    tl: { code: "tl", name: "Timor-Leste" },
    tg: { code: "tg", name: "Togo" },
    tk: { code: "tk", name: "Tokelau" },
    to: { code: "to", name: "Tonga" },
    tt: { code: "tt", name: "Trinidad and Tobago" },
    tn: { code: "tn", name: "Tunisia" },
    tr: { code: "tr", name: "Turkey" },
    tm: { code: "tm", name: "Turkmenistan" },
    tc: { code: "tc", name: "Turks and Caicos Islands" },
    tv: { code: "tv", name: "Tuvalu" },
    ug: { code: "ug", name: "Uganda" },
    ua: { code: "ua", name: "Ukraine" },
    ae: { code: "ae", name: "United Arab Emirates" },
    gb: { code: "gb", name: "United Kingdom" },
    us: { code: "us", name: "United States" },
    um: { code: "um", name: "United States Minor Outlying Islands" },
    uy: { code: "uy", name: "Uruguay" },
    uz: { code: "uz", name: "Uzbekistan" },
    vu: { code: "vu", name: "Vanuatu" },
    ve: { code: "ve", name: "Venezuela" },
    vn: { code: "vn", name: "Viet Nam" },
    vg: { code: "vg", name: "Virgin Islands, British" },
    vi: { code: "vi", name: "Virgin Islands, U.S." },
    wf: { code: "wf", name: "Wallis and Futuna" },
    eh: { code: "eh", name: "Western Sahara" },
    ye: { code: "ye", name: "Yemen" },
    zm: { code: "zm", name: "Zambia" },
    zw: { code: "zw", name: "Zimbabwe" },
    t1: { code: "t1", name: "Tor" },
  };

  return countryStore[countryCode];
};

export const TimeToText = (value) => {
  if (value === 0) {
    return value;
  } else if (value < 60) {
    return `${value} seconds`;
  } else if (value === 60) {
    return `1 minute`;
  } else if (value === 3600) {
    return `1 hour`;
  } else if (value === 86400) {
    return `1 day`;
  } else if (value === 2678400) {
    return `1 month`;
  } else if (value >= 60 && value < 3600) {
    return `${value / 60} minutes`;
  } else if (value >= 3600 && value < 86400) {
    return `${value / 3600} hours`;
  } else if (value >= 86400 && value < 2678400) {
    return `${value / 86400} days`;
  } else if (value >= 2678400 && value < 31536000) {
    return `${value / 2678400} months`;
  } else {
    return "1 year";
  }
};

/**
 * Takes in a boolean value and returns a green tick if true else returns a red cross
 * @param {boolean} value
 * @returns
 */
export const TickOrCross = (value) => {
  if (value === false) {
    return <CloseIcon color={"red"} />;
  } else if (value === true) {
    return <CheckIcon color={"green"} />;
  } else {
    return value;
  }
};

/**
 * Takes in a boolean value and returns a green TAG if true else returns a red TAG
 * @param {boolean} value
 * @returns
 */
export const DisabledOrEnabled = (value) => {
  if (value === false) {
    return <Tag colorScheme={"red"}>Disabled</Tag>;
  } else if (value === true) {
    return <Tag colorScheme={"green"}>Enabled</Tag>;
  } else {
    return value;
  }
};

/**
 * A POST request containing the data required to create a resource at the specified endpoint
 * @param {*} query
 * @param {*} endpoint
 * @returns
 */
export const createZoneSetting = async (query, endpoint) => {
  const url = `https://serverless-api.ulysseskcw96.workers.dev${endpoint}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  return resp.json();
};

/**
 * A POST request containing the data required to patch a resource at the specified endpoint
 * @param {*} query
 * @param {*} endpoint
 * @returns
 */
export const patchZoneSetting = async (query, endpoint) => {
  const url = `https://serverless-api.ulysseskcw96.workers.dev${endpoint}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  return resp.json();
};

/**
 * A POST request containing the data required to patch a resource at the specified endpoint
 * @param {*} query
 * @param {*} endpoint
 * @returns
 */
export const putZoneSetting = async (query, endpoint) => {
  const url = `https://serverless-api.ulysseskcw96.workers.dev${endpoint}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  return resp.json();
};

/**
 *
 * @param {*} query
 * @param {*} endpoint
 * @returns
 */
export const getZoneSetting = async (query, endpoint) => {
  const url = `https://serverless-api.ulysseskcw96.workers.dev${endpoint}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  return resp.json();
};

/**
 *
 * @param {*} query
 * @param {*} endpoint
 * @returns
 */
export const deleteZoneSetting = async (query, endpoint) => {
  const url = `https://serverless-api.ulysseskcw96.workers.dev${endpoint}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  return resp.json();
};
/**
 * Returns an array with the results of the same API call for different zones
 *
 * @param {*} zoneKeys - This an array of keys
 * @param {*} credentials - This is an object of keys (which are objects containing zoneId and apiToken key)
 * @param {*} endpoint - This is the endpoint to be requested
 * @returns
 */
export const getMultipleZoneSettings = async (
  zoneKeys,
  credentials,
  endpoint
) => {
  const resp = await Promise.all(
    zoneKeys.map((key) => {
      const payload = {
        zoneId: credentials[key].zoneId,
        apiToken: `Bearer ${credentials[key].apiToken}`,
      };
      return getZoneSetting(payload, endpoint);
    })
  );
  return resp;
};

/**
 * Returns an array with the results of the same API call for different accounts
 *
 * @param {*} zoneKeys - This an array of keys
 * @param {*} credentials - This is an object of keys (which are objects containing zoneId and apiToken key)
 * @param {*} zoneDetailsObj - This is an object containing keys (which are objects containing Zone Details)
 * @param {*} endpoint - This is the endpoint to be requested
 * @returns
 */
export const getMultipleAccountSettings = async (
  zoneKeys,
  credentials,
  zoneDetailsObj,
  endpoint
) => {
  const resp = await Promise.all(
    zoneKeys.map((key) => {
      const payload = {
        accountId: zoneDetailsObj[key].account.id,
        apiToken: `Bearer ${credentials[key].apiToken}`,
      };
      return getZoneSetting(payload, endpoint);
    })
  );
  return resp;
};

/**
 * Produces extension of headers for comparison zones
 * @param {*} len - This is the length of the data array (including base zone and all other zones)
 * @returns
 */
export const HeaderFactory = (len) => {
  let output = [];
  for (let i = 2; i <= len; i++) {
    output.push({
      Header: `Zone ${i}`,
      accessor: `zone${i}`,
      Cell: (props) =>
        props.value ? (
          <Tag colorScheme={"green"}>Match</Tag>
        ) : (
          <Tag colorScheme={"red"}>No Match</Tag>
        ),
    });
  }
  return output;
};

/**
 * Produces extension of headers for comparison zones with output formatted using TAGS
 * @param {*} len - This is the length of the data array (including base zone and all other zones)
 * @returns
 */
export const HeaderFactoryWithTags = (len, enabledTag) => {
  let output = [];
  for (let i = 2; i <= len; i++) {
    output.push({
      Header: `Zone ${i}`,
      accessor: `zone${i}`,
      Cell: (props) => {
        if (enabledTag) {
          return props.value ? (
            <Tag colorScheme={"green"}>Match</Tag> // <Tag colorScheme={"green"}>Enabled</Tag>
          ) : (
            <Tag colorScheme={"red"}>No Match</Tag> // <Tag colorScheme={"red"}>Disabled</Tag>
          );
        } else {
          return props.value ? (
            <Tag colorScheme={"green"}>Match</Tag> // <Tag colorScheme={"green"}>Configured</Tag>
          ) : (
            <Tag colorScheme={"red"}>No Match</Tag> // <Tag colorScheme={"red"}>Not Configured</Tag>
          );
        }
      },
    });
  }
  return output;
};

/**
 * Produces extension of headers for comparison zones with output formatted using a passed in converting function
 * @param {*} len - This is the length of the data array (including base zone and all other zones)
 * @param {*} convertOutput - This is the function to convert the output value and should render JSX
 * @returns
 */
export const HeaderFactoryOverloaded = (len, convertOutput) => {
  let output = [];
  for (let i = 2; i <= len; i++) {
    output.push({
      Header: `Zone ${i}`,
      accessor: `zone${i}`,
      Cell: (props) => convertOutput(props.value),
    });
  }
  return output;
};

/**
 * Compares a base zone to any number of other zones and returns an array
 * @param {*} baseData
 * @param {*} restData
 * @param {*} matchConditions - The conditions on which to compare an object from the base zone to an object from another zone
 * @param {string} settingTitle - The title to name the "Setting" if the Base Zone has no records
 * @returns
 */
export const CompareBaseToOthers = (
  baseData,
  restData,
  matchConditions,
  settingTitle
) => {
  if (baseData.success === true && baseData.result.length) {
    const baseZoneData = baseData.result;
    return baseZoneData.map((baseObj) => {
      for (let j = 0; j < restData.length; j++) {
        if (restData[j].success === true) {
          const currentCompareZoneData = restData[j].result;
          let foundMatch = false;
          currentCompareZoneData.forEach((compareObj) => {
            if (matchConditions(baseObj, compareObj)) {
              foundMatch = true;
            }
          });
          foundMatch
            ? (baseObj[`zone${j + 2}`] = true)
            : (baseObj[`zone${j + 2}`] = false);
        } else {
          baseObj[`zone${j + 2}`] = false; // added this line to cover cases where calls are unsuccessful to default to a false entry
        }
      }
      return baseObj;
    });
  } else {
    // base zone is unsuccessful or has no entries
    let newObj = {
      setting: settingTitle,
      value: false,
    };
    for (let j = 0; j < restData.length; j++) {
      // reverse the logic --> we want to say that if base zone has no entries or is unsuccessful AND the compare zone has some entries
      // --------------------- then match is false
      // --------------------- otherwise, if both base zone has no entries or is unsuccessful AND the compare zone has no entries or is unsuccessful
      // --------------------- then match is true
      restData[j].success === true && restData[j].result.length
        ? (newObj[`zone${j + 2}`] = false)
        : (newObj[`zone${j + 2}`] = true);
    }
    return [newObj];
  }
};

/**
 * Compares a base zone to any number of other zones and returns an array
 * @param {*} baseData
 * @param {*} restData
 * @param {*} matchConditions - The conditions on which to compare an object from the base zone to an object from another zone
 * @param {string} settingTitle - The title to name the "Setting" if the Base Zone has no records
 * @returns
 */
export const CompareBaseToOthersCategorical = (
  baseData,
  restData,
  returnConditions,
  settingTitle
) => {
  let newObj = {
    setting: settingTitle,
    value: false, // default to false, if baseZone has some activated state, then it will be set here
  };
  if (baseData.success === true) {
    const baseZoneData = baseData;
    newObj.value = returnConditions(baseZoneData);
  }
  for (let j = 0; j < restData.length; j++) {
    if (restData[j].success === true) {
      const currentCompareZoneData = restData[j];
      newObj[`zone${j + 2}`] =
        newObj.value === returnConditions(currentCompareZoneData);
    } else {
      newObj[`zone${j + 2}`] = false;
    }
    return newObj;
  }
};

/**
 * Takes in a comparison function and data, and returns an array for React-Table
 * @param {*} comp_fn - This is a comparison function that takes in four arguments: base zone data, other zones data, conditions to match, title for this setting
 * @param {*} data - This needs to be an array containing the data from the base zone in index 0 and other zones in all other indexes
 * @param {*} conditions - This a function that should take in two objects, one from the base zone and one from the other zone and do the equality checks
 * @param {*} title - This is the title for the setting
 * @returns
 */
export const CompareData = (comp_fn, data, conditions, title) => {
  return comp_fn(data[0], data.slice(1), conditions, title);
};

/**
 * General Unsuccessful Headers Template
 */
export const UnsuccessfulHeaders = [
  {
    Header: "Setting",
    accessor: "setting",
  },
  {
    Header: "Value",
    accessor: "value",
    Cell: (props) =>
      props.value ? <CheckIcon color={"green"} /> : <CloseIcon color={"red"} />,
  },
];

/**
 * General Unsucccesful Headers Template that uses TAGS
 */
export const UnsuccessfulHeadersWithTags = [
  {
    Header: "Setting",
    accessor: "setting",
  },
  {
    Header: "Value",
    accessor: "value",
    Cell: (props) =>
      props.value ? (
        <Tag colorScheme={"green"}>Configured</Tag>
      ) : (
        <Tag colorScheme={"red"}>Not Configured</Tag>
      ),
  },
];

/**
 * This is a utility function to count the differences in records between a base zone and any number of zones.
 * @param {*} keys
 * @param {*} processedData
 * @param {*} unprocessedData
 * @returns
 */
export const CountDeltaDifferences = (keys, processedData, unprocessedData) => {
  const deltaObj = {};
  const keysArray = keys.map((key) => key.replace("_", "")).slice(1);
  keysArray.forEach((key) => {
    const zoneNumber = parseInt(key.replace("zone", ""));
    const zoneData = unprocessedData[zoneNumber - 1];
    if (zoneData.success === true && zoneData.result.length) {
      deltaObj[key] = zoneData.result.length;
    } else {
      deltaObj[key] = 0;
    }
  });
  processedData.forEach((row) => {
    keysArray.forEach((key) => {
      if (row[key]) {
        // check if zoneX has a matching record, minus the count in delta
        deltaObj[key] = deltaObj[key] - 1;
      }
    });
  });
  return [deltaObj];
};

export const ZoneComparisonLeftSidebarData = {
  DNS: [
    "dns_management",
    "cloudflare_nameservers",
    "custom_nameservers",
    "dnssec",
    "cname_flattening",
  ],
  "SSL/TLS": [
    "ssl_setting",
    "edge_certificates",
    "http_strict_transport_security",
    "custom_hostnames",
    "ssl_subcategories",
  ],
  Firewall: [
    "managed_rules",
    "cloudflare_managed_ruleset",
    "owasp_modsecurity_core_ruleset",
    "custom_rules_firewall",
    "custom_rules_rate_limits",
    "firewall_rules",
    "http_ddos_attack_protection",
    "ip_access_rules",
    "rate_limiting",
    "user_agent_blocking",
    "zone_lockdown",
    "firewall_subcategories",
  ],
  Speed: [
    "automatic_platform_optimization",
    "mobile_redirect",
    "minify",
    "railguns",
    "speed_subcategories",
  ],
  Caching: ["caching_subcategories"],
  Workers: ["http_routes"],
  Rules: [
    "page_rules",
    "url_rewrite",
    "http_request_header_modification",
    "http_response_header_modification",
    "normalization_settings",
  ],
  Network: ["network_subcategories"],
  Traffic: ["load_balancers"],
  "Scrape Shield": ["scrape_shield_subcategories"],
  Spectrum: ["spectrum_applications"],
};

export const ZoneViewerLeftSidebarData = {
  DNS: [
    "dns_management",
    "cloudflare_nameservers",
    "custom_nameservers",
    "dnssec",
    "cname_flattening",
  ],
  "SSL/TLS": [
    "ssl_setting",
    "edge_certificates",
    "http_strict_transport_security",
    "custom_hostnames",
    "ssl_subcategories",
  ],
  Firewall: [
    "web_application_firewall",
    //"custom_rules_firewall",
    //"custom_rules_rate_limits",
    "firewall_rules",
    "http_ddos_attack_protection",
    "ip_access_rules",
    "rate_limiting",
    "user_agent_blocking",
    "zone_lockdown",
    "firewall_subcategories",
  ],
  Speed: [
    "speed_subcategories",
    "automatic_platform_optimization",
    "mobile_redirect",
    "minify",
    "railguns",
  ],
  Caching: ["caching_subcategories"],
  Workers: ["http_routes"],
  Rules: [
    "page_rules",
    "url_rewrite",
    "http_request_header_modification",
    "http_response_header_modification",
    "normalization_settings",
  ],
  Network: ["network_subcategories"],
  Traffic: ["load_balancers"],
  "Scrape Shield": ["scrape_shield_subcategories"],
  Spectrum: ["spectrum_applications"],
};

/**
 * Factory component used to create a Category Title for Zone Comparison
 * @param {*} props
 * @returns
 */
export const CategoryTitle = (props) => {
  return (
    <Stack w="100%">
      <HStack>
        <Heading size="md" id={props.id}>
          {Humanize(props.id)}
        </Heading>
        <Spacer />
        {props.copyable && props.showCopyButton ? (
          <Button size={"sm"} onClick={props.copy}>
            {`Copy ${Humanize(props.id)}`}
          </Button>
        ) : null}
      </HStack>
      {props.copyable ? (
        <Tag w="20%" colorScheme={"green"}>
          <TagLeftIcon as={CopyIcon}></TagLeftIcon>
          <TagLabel>Can be copied</TagLabel>
        </Tag>
      ) : (
        <Tag w="20%" colorScheme={"red"}>
          <TagLeftIcon as={CopyIcon}></TagLeftIcon>
          <TagLabel>Cannot be copied</TagLabel>
        </Tag>
      )}
    </Stack>
  );
};

export const SubcategoriesSuccessMessage = (
  subcategories,
  baseZone,
  otherZone
) => {
  return `
  Your settings for ${Object.keys(subcategories)
    .filter((subcat) => subcategories[subcat] !== undefined)
    .map((subcat) => Humanize(subcat))
    .join(", ")} have been successfully copied
  from ${baseZone} to ${otherZone}.
  ${
    Object.keys(subcategories).filter(
      (subcat) => subcategories[subcat] === undefined
    ).length > 0
      ? `Your settings for ${Object.keys(subcategories)
          .filter((subcat) => subcategories[subcat] === undefined)
          .map((subcat) => Humanize(subcat))
          .join(", ")} could not be copied
  from ${baseZone} to ${otherZone}.`
      : ""
  }
  `;
};

export const RulesetsSuccessMessage = (rulesets, baseZone, otherZone) => {
  const objKeys = Object.keys(rulesets);
  let allSettingsMatch = true;
  for (let i = 0; i < objKeys.length; i++) {
    if (rulesets[objKeys[i]] !== undefined) {
      allSettingsMatch = false;
    }
  }

  if (allSettingsMatch) {
    return `Your settings have been successfully copied from ${baseZone} to ${otherZone}.`;
  } else {
    return `Your settings for ${Object.keys(rulesets)
      .filter((ruleset) => rulesets[ruleset] !== undefined)
      .map((ruleset) => Humanize(ruleset))
      .join(", ")} have been successfully copied
    from ${baseZone} to ${otherZone}.
  `;
  }
};

export const defaultManageRulesetIds = [
  "4814384a9e5d4991b9815dcfc25d2f1f",
  "c2e184081120413c86c3ab7e14069605",
  "efb7b8c949ac4650a09736fc376e9aee",
];
