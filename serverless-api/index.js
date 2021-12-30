addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const corsHeaders = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Origin': '*',
}

async function getZoneSetting(request) {

  const { query } = await request.json();

  var myHeaders = new Headers();
  //myHeaders.append("Authorization", "Bearer HsCys9ldf0ScxEDcza0Sq0dtkQ3wEbTw97RyAmR3");
  myHeaders.append("Authorization", `${query.apiToken}`);
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  //const resp = await fetch("https://api.cloudflare.com/client/v4/zones/e6bf1f06148cb143e391370e9edf3aef/settings", requestOptions);
  const resp = await fetch(`https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings`, requestOptions);
  const data = await resp.json();
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-type': 'application/json',
      ...corsHeaders
    }
  });

  /* DNS */
  /*
  const dnsReqs = https://api.cloudflare.com/client/v4/zones/${query.zoneId}/dns_records
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/custom_ns
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/dnssec
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/cname_flattening
  */

  /* SSL/TLS */
  /*
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/ssl
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/ssl/recommendation
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/ssl/certificate_packs
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/always_use_https
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/min_tls_version
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/opportunistic_encryption
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/tls_1_3
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/automatic_https_rewrites
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/ssl/universal/settings
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/tls_client_auth
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/custom_hostnames
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/custom_hostnames/:identifier
  */

  /* Firewall */
  /*
  https://api.cloudflare.com/client/v4/zones/{{:zone_identifier}}/firewall/rules
  https://api.cloudflare.com/client/v4/zones/{{:zone_identifier}}/settings/waf
  https://api.cloudflare.com/client/v4/zones/{{:zone_identifier}}/firewall/waf/packages
  https://api.cloudflare.com/client/v4/zones/{{:zone_identifier}}/rulesets
  https://api.cloudflare.com/client/v4/zones/{{:zone_identifier}}/firewall/access_rules/rules
  https://api.cloudflare.com/client/v4/zones/{{:zone_identifier}}/rate_limits
  https://api.cloudflare.com/client/v4/zones/{{:zone_identifier}}/firewall/ua_rules
  https://api.cloudflare.com/client/v4/zones/{{:zone_identifier}}/firewall/lockdowns
  https://api.cloudflare.com/client/v4/zones/{{:zone_identifier}}/settings/security_level
  https://api.cloudflare.com/client/v4/zones/{{:zone_identifier}}/settings/challenge_ttl
  https://api.cloudflare.com/client/v4/zones/{{:zone_identifier}}/settings/browser_check
  https://api.cloudflare.com/client/v4/zones/{{:zone_identifier}}/settings/privacy_pass
  */

  /* Speed */
  /*
  https://api.cloudflare.com/client/v4/zones/{{:zone_identifier}}/settings/mirage
  https://api.cloudflare.com/client/v4/zones/{{:zone_identifier}}/settings/image_resizing
  https://api.cloudflare.com/client/v4/zones/{{:zone_identifier}}/settings/polish
  https://api.cloudflare.com/client/v4/zones/{{:zone_identifier}}/settings/minify
  https://api.cloudflare.com/client/v4/zones/{{:zone_identifier}}/settings/brotli
  https://api.cloudflare.com/client/v4/zones/{{:zone_identifier}}/settings/early_hints
  https://api.cloudflare.com/client/v4/zones/{{:zone_identifier}}/settings/automatic_platform_optimization
  */
}

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {

  if (request.method === "OPTIONS") {
    return new Response("OK", {headers: corsHeaders})
  }

  if (request.method === "POST") {
    return getZoneSetting(request)
  }
}
