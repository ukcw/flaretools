export const Humanize = (str) => {
  var i,
    frags = str.split("_");
  for (i = 0; i < frags.length; i++) {
    if (frags[i] === "https") {
      frags[i] = "HTTPS";
    } else if (frags[i] === "ttl") {
      frags[i] = "TTL";
    } else if (frags[i] === "url") {
      frags[i] = "URL";
    } else if (frags[i] === "ssl") {
      frags[i] = "SSL";
    } else if (frags[i] === "waf") {
      frags[i] = "WAF";
    } else {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
  }
  return frags.join(" ");
};
