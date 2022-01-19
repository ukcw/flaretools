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

async function getPaginatedZoneSetting(zoneId, apiToken, endpoint) {
  const firstRequest = await getZoneSetting(zoneId, apiToken, endpoint)

  if (
    firstRequest.result_info !== undefined &&
    firstRequest.result_info.total_pages !== undefined &&
    firstRequest.result_info.total_pages > 1
  ) {
    for (let i = 2; i <= firstRequest.result_info.total_pages; i++) {
      const pageNumber = `${endpoint}?page=${i}`
      const subsequentRequest = await getZoneSetting(
        zoneId,
        apiToken,
        pageNumber,
      )
      firstRequest.result.push(...subsequentRequest.result)
    }
  }

  return firstRequest
}

/**
 * To enable preflight requests to succeed.
 */
router.options('*', () => {
  return new Response('OK', { headers: corsHeaders })
})

/**
 * Basic Zone Details for a Zone
 */

router.post('/zone_details', async request => {
  const { query } = await request.json()

  try {
    const zone_details = await getZoneSetting(query.zoneId, query.apiToken, '/')

    return new Response(
      JSON.stringify({
        zone_details,
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
      getPaginatedZoneSetting(query.zoneId, query.apiToken, '/dns_records'),
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
      getPaginatedZoneSetting(
        query.zoneId,
        query.apiToken,
        '/ssl/certificate_packs',
      ),
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
      getPaginatedZoneSetting(
        query.zoneId,
        query.apiToken,
        '/custom_hostnames',
      ),
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

router.post('/speed', async request => {
  const { query } = await request.json()

  try {
    const [
      mirage,
      image_resizing,
      polish,
      minify,
      brotli,
      early_hints,
      automatic_platform_optimization,
      h2_prioritization,
      rocket_loader,
      railguns,
      prefetch_preload,
      mobile_redirect,
    ] = await Promise.all([
      getZoneSetting(query.zoneId, query.apiToken, '/settings/mirage'),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/image_resizing'),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/polish'),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/minify'),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/brotli'),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/early_hints'),
      getZoneSetting(
        query.zoneId,
        query.apiToken,
        '/settings/automatic_platform_optimization',
      ),
      getZoneSetting(
        query.zoneId,
        query.apiToken,
        '/settings/h2_prioritization',
      ),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/rocket_loader'),
      getZoneSetting(query.zoneId, query.apiToken, '/railguns'),
      getZoneSetting(
        query.zoneId,
        query.apiToken,
        '/settings/prefetch_preload',
      ),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/mobile_redirect'),
    ])

    return new Response(
      JSON.stringify({
        mirage,
        image_resizing,
        polish,
        minify,
        brotli,
        early_hints,
        automatic_platform_optimization,
        h2_prioritization,
        rocket_loader,
        railguns,
        prefetch_preload,
        mobile_redirect,
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
/* Caching */
/*
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/argo/tiered_caching
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/cache/tiered_cache_smart_topology_enable
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/cache_level
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/browser_cache_ttl
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/flags "cache": "crawlhints_enabled"
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/always_online
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/development_mode
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/settings/sort_query_string_for_cache
  */

router.post('/caching', async request => {
  const { query } = await request.json()

  try {
    const [
      argo_tiered_caching,
      tiered_cache_topology,
      cache_level,
      browser_cache_ttl,
      crawlhints,
      always_online,
      development_mode,
      query_string_sort,
    ] = await Promise.all([
      getZoneSetting(query.zoneId, query.apiToken, '/argo/tiered_caching'),
      getZoneSetting(
        query.zoneId,
        query.apiToken,
        '/cache/tiered_cache_smart_topology_enable',
      ),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/cache_level'),
      getZoneSetting(
        query.zoneId,
        query.apiToken,
        '/settings/browser_cache_ttl',
      ),
      getZoneSetting(query.zoneId, query.apiToken, '/flags'),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/always_online'),
      getZoneSetting(
        query.zoneId,
        query.apiToken,
        '/settings/development_mode',
      ),
      getZoneSetting(
        query.zoneId,
        query.apiToken,
        '/settings/sort_query_string_for_cache',
      ),
    ])

    return new Response(
      JSON.stringify({
        argo_tiered_caching,
        tiered_cache_topology,
        cache_level,
        browser_cache_ttl,
        crawlhints,
        always_online,
        development_mode,
        query_string_sort,
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

/* Workers */
/*
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/workers/routes
  */

router.post('/workers', async request => {
  const { query } = await request.json()

  try {
    const workers_routes = await getZoneSetting(
      query.zoneId,
      query.apiToken,
      '/workers/routes',
    )

    return new Response(
      JSON.stringify({
        workers_routes,
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
