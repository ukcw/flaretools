import { Router } from 'itty-router'

// Create a new router
const router = Router()

const corsHeaders = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Origin': '*',
}

/*
async function getZoneSetting(request, endpoint) {
  const { query } = await request.json()

  var myHeaders = new Headers()
  // myHeaders.append("Authorization", "Bearer HsCys9ldf0ScxEDcza0Sq0dtkQ3wEbTw97RyAmR3");
  myHeaders.append('Authorization', `${query.apiToken}`)
  myHeaders.append('Content-Type', 'application/json')

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  }

  // const resp = await fetch("https://api.cloudflare.com/client/v4/zones/e6bf1f06148cb143e391370e9edf3aef/settings", requestOptions);
  const resp = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${query.zoneId}/${endpoint}`,
    requestOptions,
  )
  const data = await resp.json()
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-type': 'application/json',
      ...corsHeaders,
    },
  })
}
*/

async function getZoneSetting(zoneId, apiToken, endpoint) {
  var myHeaders = new Headers()
  myHeaders.append('Authorization', `${apiToken}`)
  myHeaders.append('Content-Type', 'application/json')

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  }

  const resp = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}${endpoint}`,
    requestOptions,
  )
  const data = await resp.json()
  return data
}

/**
 * To enable preflight requests to succeed.
 */
router.options('*', () => {
  return new Response('OK', { headers: corsHeaders })
})

/* DNS */
/*
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/dns_records
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/custom_ns
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/dnssec
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/cname_flattening
  */

router.post('/dns', async request => {
  const { query } = await request.json()

  try {
    const [
      dns_records,
      name_servers,
      custom_ns,
      dnssec,
      cname_flattening,
    ] = await Promise.all([
      getZoneSetting(query.zoneId, query.apiToken, '/dns_records'),
      getZoneSetting(query.zoneId, query.apiToken, '/'),
      getZoneSetting(query.zoneId, query.apiToken, '/'),
      getZoneSetting(query.zoneId, query.apiToken, '/dnssec'),
      getZoneSetting(
        query.zoneId,
        query.apiToken,
        '/settings/cname_flattening',
      ),
    ])

    return new Response(
      JSON.stringify({
        dns_records,
        name_servers,
        custom_ns,
        dnssec,
        cname_flattening,
      }),
      {
        headers: {
          'Content-type': 'application/json',
          ...corsHeaders,
        },
      },
    )
  } catch (e) {
    return new Response(JSON.stringify(e.message), {
      headers: {
        'Content-type': 'application/json',
        ...corsHeaders,
      },
    })
  }
})

/* SSL/TLS */
/*
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/ssl
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/ssl/recommendation
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/ssl/certificate_packs
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/always_use_https
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/security_header
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/min_tls_version
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/opportunistic_encryption
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/tls_1_3
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/automatic_https_rewrites
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/ssl/universal/settings
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/tls_client_auth
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/custom_hostnames
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/custom_hostnames/:identifier
  */

router.post('/ssl_tls', async request => {
  const { query } = await request.json()

  try {
    const [
      ssl_setting,
      ssl_recommendation,
      ssl_certificate_packs,
      always_use_https,
      security_header,
      min_tls_version,
      opportunistic_encryption,
      tls_1_3,
      automatic_https_rewrites,
      ssl_universal,
      tls_client_auth,
      custom_hostnames,
    ] = await Promise.all([
      getZoneSetting(query.zoneId, query.apiToken, '/settings/ssl'),
      getZoneSetting(query.zoneId, query.apiToken, '/ssl/recommendation'),
      getZoneSetting(query.zoneId, query.apiToken, '/ssl/certificate_packs'),
      getZoneSetting(
        query.zoneId,
        query.apiToken,
        '/settings/always_use_https',
      ),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/security_header'),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/min_tls_version'),
      getZoneSetting(
        query.zoneId,
        query.apiToken,
        '/settings/opportunistic_encryption',
      ),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/tls_1_3'),
      getZoneSetting(
        query.zoneId,
        query.apiToken,
        '/settings/automatic_https_rewrites',
      ),
      getZoneSetting(query.zoneId, query.apiToken, '/ssl/universal/settings'),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/tls_client_auth'),
      getZoneSetting(query.zoneId, query.apiToken, '/custom_hostnames'),
    ])

    return new Response(
      JSON.stringify({
        ssl_setting,
        ssl_recommendation,
        ssl_certificate_packs,
        always_use_https,
        security_header,
        min_tls_version,
        opportunistic_encryption,
        tls_1_3,
        automatic_https_rewrites,
        ssl_universal,
        tls_client_auth,
        custom_hostnames,
      }),
      {
        headers: {
          'Content-type': 'application/json',
          ...corsHeaders,
        },
      },
    )
  } catch (e) {
    return new Response(JSON.stringify(e.message), {
      headers: {
        'Content-type': 'application/json',
        ...corsHeaders,
      },
    })
  }
})

/* Firewall */
/*
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/firewall/rules
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/waf
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/firewall/waf/packages
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/rulesets
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/firewall/access_rules/rules
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/rate_limits
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/firewall/ua_rules
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/firewall/lockdowns
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/security_level
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/challenge_ttl
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/browser_check
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/privacy_pass
  */

router.post('/firewall', async request => {
  const { query } = await request.json()

  try {
    const [
      firewall_rules,
      waf_setting,
      firewall_waf_packages,
      rulesets,
      firewall_access_rules,
      rate_limits,
      firewall_ua_rules,
      firewall_lockdowns,
      security_level,
      challenge_ttl,
      browser_check,
      privacy_pass,
    ] = await Promise.all([
      getZoneSetting(query.zoneId, query.apiToken, '/firewall/rules'),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/waf'),
      getZoneSetting(query.zoneId, query.apiToken, '/rulesets'),
      getZoneSetting(
        query.zoneId,
        query.apiToken,
        '/firewall/access_rules/rules',
      ),
      getZoneSetting(query.zoneId, query.apiToken, '/rate_limits'),
      getZoneSetting(query.zoneId, query.apiToken, '/firewall/ua_rules'),
      getZoneSetting(query.zoneId, query.apiToken, '/firewall/lockdowns'),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/security_level'),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/challenge_ttl'),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/browser_check'),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/privacy_pass'),
    ])

    return new Response(
      JSON.stringify({
        firewall_rules,
        waf_setting,
        firewall_waf_packages,
        rulesets,
        firewall_access_rules,
        rate_limits,
        firewall_ua_rules,
        firewall_lockdowns,
        security_level,
        challenge_ttl,
        browser_check,
        privacy_pass,
      }),
      {
        headers: {
          'Content-type': 'application/json',
          ...corsHeaders,
        },
      },
    )
  } catch (e) {
    return new Response(JSON.stringify(e.message), {
      headers: {
        'Content-type': 'application/json',
        ...corsHeaders,
      },
    })
  }
})

/* Speed */
/*
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/mirage
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/image_resizing
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/polish
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/minify
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/brotli
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/early_hints
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/automatic_platform_optimization
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/h2_prioritization
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/rocket_loader
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/railguns
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/prefetch_preload
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/mobile_redirect
  */

/* Caching */
/*
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}//argo/tiered_caching
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/cache/tiered_cache_smart_topology_enable
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/cache_level
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/browser_cache_ttl
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/flags "cache": "crawlhints_enabled"
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/always_online
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/development_mode
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/sort_query_string_for_cache
  */

/* Workers */
/*
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/workers/routes
  */

/* Rules */
/*
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/pagerules
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/rulesets/phases/http_request_transform/entrypoint
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/rulesets/phases/http_request_late_transform/entrypoint
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/rulesets/phases/http_response_headers_transform/entrypoint
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/rulesets ":id"
  */

/* Network */
/*
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/http2
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/http3
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/0rtt
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/ipv6
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/flags "protocol": { "gRPC": boolean }
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/websockets
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/opportunistic_onion
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/pseudo_ipv4
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/ip_geolocation
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/max_upload
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/response_buffering
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/true_client_ip_header
  */

/* Traffic */
/*
  to be added
  */

/* Custom Pages */
/*
  to be added
  */

/**
 * Respond with hello worker text
 * @param {Request} request
 */
/*
async function handleRequest(request) {

  if (request.method === "OPTIONS") {
    return new Response("OK", {headers: corsHeaders})
  }

  if (request.method === "POST") {
    return getZoneSetting(request)
  }
}*/

addEventListener('fetch', event => {
  event.respondWith(router.handle(event.request))
})
