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

async function getPerPageSpecifiedZoneSetting(
  zoneId,
  apiToken,
  endpoint,
  perPage,
) {
  var myHeaders = new Headers()
  myHeaders.append('Authorization', `${apiToken}`)
  myHeaders.append('Content-Type', 'application/json')

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  }

  const resp = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}${endpoint}?per_page=${perPage}`,
    requestOptions,
  )
  const data = await resp.json()

  return data
}

/**
 * This is a helper function that makes a paginated Zone Setting API request that allows for a setting for the number of results returned per page.
 * @param {*} zoneId
 * @param {*} apiToken
 * @param {*} endpoint
 * @param {*} perPage
 * @returns
 */
async function getPageSpecifiedPaginatedZoneSetting(
  zoneId,
  apiToken,
  endpoint,
  perPage,
) {
  const firstRequest = await getPerPageSpecifiedZoneSetting(
    zoneId,
    apiToken,
    endpoint,
    100,
  )

  if (
    firstRequest.result_info !== undefined &&
    firstRequest.result_info.total_pages !== undefined &&
    firstRequest.result_info.total_pages > 1
  ) {
    for (let i = 2; i <= firstRequest.result_info.total_pages; i++) {
      const pageNumber = `${endpoint}?page=${i}&per_page=${perPage}`
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
 * This is a helper function to make an Account Setting type request.
 * @param {*} accountId
 * @param {*} apiToken
 * @param {*} endpoint
 * @returns
 */
async function getAccountSetting(accountId, apiToken, endpoint) {
  var myHeaders = new Headers()
  myHeaders.append('Authorization', `${apiToken}`)
  myHeaders.append('Content-Type', 'application/json')

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  }

  const resp = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}${endpoint}`,
    requestOptions,
  )
  const data = await resp.json()

  return data
}

/**
 * This is a helper function to make a paginated Account Setting type request
 * @param {*} zoneId
 * @param {*} apiToken
 * @param {*} endpoint
 * @returns
 */
async function getPaginatedAccountSetting(accountId, apiToken, endpoint) {
  const firstRequest = await getAccountSetting(accountId, apiToken, endpoint)

  if (
    firstRequest.result_info !== undefined &&
    firstRequest.result_info.total_pages !== undefined &&
    firstRequest.result_info.total_pages > 1
  ) {
    for (let i = 2; i <= firstRequest.result_info.total_pages; i++) {
      const pageNumber = `${endpoint}?page=${i}`
      const subsequentRequest = await getAccountSetting(
        accountId,
        apiToken,
        pageNumber,
      )
      firstRequest.result.push(...subsequentRequest.result)
    }
  }

  return firstRequest
}

/**
 * This is a helper function to make a fetch request and paginate the request if there is more than one page. Use this for a Zone related request.
 * @param {*} zoneId
 * @param {*} apiToken
 * @param {*} endpoint
 * @returns
 */
async function FetchRequest(zoneId, apiToken, endpoint) {
  try {
    const resp = await getPaginatedZoneSetting(zoneId, apiToken, endpoint)

    return new Response(
      JSON.stringify({
        resp,
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
}

/**
 * This is a helper function to make a fetch request and paginate the request if there is more than one page. Use this for an Account related request.
 * @param {*} accountId
 * @param {*} apiToken
 * @param {*} endpoint
 * @returns
 */
async function FetchAccountRequest(accountId, apiToken, endpoint) {
  try {
    const resp = await getPaginatedAccountSetting(accountId, apiToken, endpoint)

    return new Response(
      JSON.stringify({
        resp,
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

// Bundler for DNS related API endpoints
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

router.post('/dns_records', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/dns_records')
})

router.post('/dnssec', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/dnssec')
})

router.post('/settings/cname_flattening', async request => {
  const { query } = await request.json()
  return FetchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/cname_flattening',
  )
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

// Bundler for SSL/TLS endpoints
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

// SSL Setting
router.post('/settings/ssl', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/ssl')
})

// Edge Certificates
router.post('/ssl/certificate_packs', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/ssl/certificate_packs')
})

// Http Strict Transport Security (HSTS)
router.post('/settings/security_header', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/security_header')
})

// Custom Hostnames
router.post('/custom_hostnames', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/custom_hostnames')
})

// SSL Recommendation
router.post('/ssl/recommendation', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/ssl/recommendation')
})

// Always Use HTTPS
router.post('/settings/always_use_https', async request => {
  const { query } = await request.json()
  return FetchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/always_use_https',
  )
})

// Minimum TLS Version
router.post('/settings/min_tls_version', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/min_tls_version')
})

// Opportunistic Encryption
router.post('/settings/opportunistic_encryption', async request => {
  const { query } = await request.json()
  return FetchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/opportunistic_encryption',
  )
})

// TLS 1.3
router.post('/settings/tls_1_3', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/tls_1_3')
})

// Automatic HTTPS Rewrites
router.post('/settings/automatic_https_rewrites', async request => {
  const { query } = await request.json()
  return FetchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/automatic_https_rewrites',
  )
})

// Universal SSL Certificate Authority
router.post('/ssl/universal/settings', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/ssl/universal/settings')
})

// Authenticated Origin Pulls
router.post('/settings/tls_client_auth', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/tls_client_auth')
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
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/rulesets/phases/http_request_firewall_custom/entrypoint
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/rulesets/phases/http_ratelimit/entrypoint
  */

router.post('/firewall', async request => {
  const { query } = await request.json()

  const getManagedRulesetsResult = async resultArray => {
    for (let i = 0; i < resultArray.length; i++) {
      const current = resultArray[i]
      const currentResult = await getPaginatedZoneSetting(
        query.zoneId,
        query.apiToken,
        `/rulesets/${current.id}`,
      )
      resultArray[i].result = currentResult
    }
    return resultArray
  }

  try {
    const [
      firewall_rules,
      waf_setting,
      rulesets,
      firewall_access_rules,
      rate_limits,
      firewall_ua_rules,
      firewall_lockdowns,
      security_level,
      challenge_ttl,
      browser_check,
      privacy_pass,
      custom_rules_firewall,
      custom_rules_ratelimit,
      page_shield,
      ddos_l7,
    ] = await Promise.all([
      getPaginatedZoneSetting(query.zoneId, query.apiToken, '/firewall/rules'),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/waf'),
      getZoneSetting(query.zoneId, query.apiToken, '/rulesets'),
      getZoneSetting(
        query.zoneId,
        query.apiToken,
        '/firewall/access_rules/rules',
      ),
      getPaginatedZoneSetting(query.zoneId, query.apiToken, '/rate_limits'),
      getZoneSetting(query.zoneId, query.apiToken, '/firewall/ua_rules'),
      getZoneSetting(query.zoneId, query.apiToken, '/firewall/lockdowns'),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/security_level'),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/challenge_ttl'),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/browser_check'),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/privacy_pass'),
      getPaginatedZoneSetting(
        query.zoneId,
        query.apiToken,
        '/rulesets/phases/http_request_firewall_custom/entrypoint',
      ),
      getPaginatedZoneSetting(
        query.zoneId,
        query.apiToken,
        '/rulesets/phases/http_ratelimit/entrypoint',
      ),
      getPaginatedZoneSetting(
        query.zoneId,
        query.apiToken,
        '/script_monitor/scripts',
      ),
      getZoneSetting(
        query.zoneId,
        query.apiToken,
        '/rulesets/phases/ddos_l7/entrypoint',
      ),
    ])

    const { result: resultSet } = rulesets
    const managed_rulesets_results = await getManagedRulesetsResult(resultSet)

    return new Response(
      JSON.stringify({
        firewall_rules,
        waf_setting,
        managed_rulesets_results,
        rulesets,
        firewall_access_rules,
        rate_limits,
        firewall_ua_rules,
        firewall_lockdowns,
        security_level,
        challenge_ttl,
        browser_check,
        privacy_pass,
        custom_rules_firewall,
        custom_rules_ratelimit,
        page_shield,
        ddos_l7,
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

router.post('/firewall/deprecated', async request => {
  const { query } = await request.json()

  const getFirewallRules = async resultArray => {
    for (let i = 0; i < resultArray.length; i++) {
      const current = resultArray[i]

      const detailedList = await getPageSpecifiedPaginatedZoneSetting(
        query.zoneId,
        query.apiToken,
        `/firewall/waf/packages/${current.id}/rules`,
        100,
      )
      const dashList = await getPageSpecifiedPaginatedZoneSetting(
        query.zoneId,
        query.apiToken,
        `/firewall/waf/packages/${current.id}/groups`,
        100,
      )
      resultArray[i].dash = dashList
      resultArray[i].detailed = detailedList
    }
    return resultArray
  }

  try {
    let deprecatedFirewallRules = false

    const firewall_waf_packages = await getZoneSetting(
      query.zoneId,
      query.apiToken,
      '/firewall/waf/packages',
    )

    if (firewall_waf_packages.success === true) {
      const { result } = firewall_waf_packages
      deprecatedFirewallRules = await getFirewallRules(result)
    }

    return new Response(
      JSON.stringify({
        deprecatedFirewallRules,
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

// Firewall Rules
router.post('/firewall/rules', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/firewall/rules')
})

// WAF Setting
router.post('/settings/waf', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/waf')
})

// managed_rulesets_results, to be added
router.post(
  '/rulesets/phases/http_request_firewall_managed/entrypoint',
  async request => {
    const { query } = await request.json()
    return FetchRequest(
      query.zoneId,
      query.apiToken,
      '/rulesets/phases/http_request_firewall_managed/entrypoint',
    )
  },
)

// Rulesets
router.post('/rulesets', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/rulesets')
})

// Firewall Access Rules
router.post('/firewall/access_rules/rules', async request => {
  const { query } = await request.json()
  return FetchRequest(
    query.zoneId,
    query.apiToken,
    '/firewall/access_rules/rules',
  )
})

// Rate Limits
router.post('/rate_limits', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/rate_limits')
})

// Firewall User Agent Blocking Rules
router.post('/firewall/ua_rules', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/firewall/ua_rules')
})

// Firewall Lockdowns
router.post('/firewall/lockdowns', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/firewall/lockdowns')
})

// Security Level
router.post('/settings/security_level', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/security_level')
})

// Challenge TTL
router.post('/settings/challenge_ttl', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/challenge_ttl')
})

// Browser Check
router.post('/settings/browser_check', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/browser_check')
})

// Privacy Pass
router.post('/settings/privacy_pass', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/privacy_pass')
})

// Custom Rules
router.post(
  '/rulesets/phases/http_request_firewall_custom/entrypoint',
  async request => {
    const { query } = await request.json()
    return FetchRequest(
      query.zoneId,
      query.apiToken,
      '/rulesets/phases/http_request_firewall_custom/entrypoint',
    )
  },
)

// Custom Rules Rate Limits
router.post('/rulesets/phases/http_ratelimit/entrypoint', async request => {
  const { query } = await request.json()
  return FetchRequest(
    query.zoneId,
    query.apiToken,
    '/rulesets/phases/http_ratelimit/entrypoint',
  )
})

// Page Shield
router.post('/script_monitor/scripts', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/script_monitor/scripts')
})

// DDoS L7
router.post('/rulesets/phases/ddos_l7/entrypoint', async request => {
  const { query } = await request.json()
  return FetchRequest(
    query.zoneId,
    query.apiToken,
    '/rulesets/phases/ddos_l7/entrypoint',
  )
})

// DDoS L7 ruleset
// DDoS L7 Ruleset ID = 4d21379b4f9f4bb088e0729962c8b3cf
// if this ID changes on Cloudflare API's side, then this value needs to be updated
router.post('/rulesets/ddos_l7', async request => {
  const { query } = await request.json()
  return FetchRequest(
    query.zoneId,
    query.apiToken,
    '/rulesets/4d21379b4f9f4bb088e0729962c8b3cf',
  )
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

// Mirage
router.post('/settings/mirage', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/mirage')
})

// Image Resizing
router.post('/settings/image_resizing', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/image_resizing')
})

// Polish
router.post('/settings/polish', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/polish')
})

// Minify
router.post('/settings/minify', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/minify')
})

// Brotli
router.post('/settings/brotli', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/brotli')
})

// Early Hints
router.post('/settings/early_hints', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/early_hints')
})

// Automatic Platform Optimization
router.post('/settings/automatic_platform_optimization', async request => {
  const { query } = await request.json()
  return FetchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/automatic_platform_optimization',
  )
})

// H2 Prioritization
router.post('/settings/h2_prioritization', async request => {
  const { query } = await request.json()
  return FetchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/h2_prioritization',
  )
})

// Rocket Loader
router.post('/settings/rocket_loader', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/rocket_loader')
})

// Railguns
router.post('/railguns', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/railguns')
})

// Prefetch Preload
router.post('/settings/prefetch_preload', async request => {
  const { query } = await request.json()
  return FetchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/prefetch_preload',
  )
})

// Mobile Redirect
router.post('/settings/mobile_redirect', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/mobile_redirect')
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

// Argo Tiered Caching
router.post('/argo/tiered_caching', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/argo/tiered_caching')
})

// Tiered Cache Topology
router.post('/cache/tiered_cache_smart_topology_enable', async request => {
  const { query } = await request.json()
  return FetchRequest(
    query.zoneId,
    query.apiToken,
    '/cache/tiered_cache_smart_topology_enable',
  )
})

// Cache Level
router.post('/settings/cache_level', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/cache_level')
})

// Browser Cache TTL
router.post('/settings/browser_cache_ttl', async request => {
  const { query } = await request.json()
  return FetchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/browser_cache_ttl',
  )
})

// Crawlhints => "cache": "crawlhints_enabled"
router.post('/flags', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/flags')
})

// Always Online
router.post('/settings/always_online', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/always_online')
})

// Development Mode
router.post('/settings/development_mode', async request => {
  const { query } = await request.json()
  return FetchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/development_mode',
  )
})

// Query String Sort
router.post('/settings/sort_query_string_for_cache', async request => {
  const { query } = await request.json()
  return FetchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/sort_query_string_for_cache',
  )
})

/* Workers */
/*
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/workers/routes
  */

router.post('/workers', async request => {
  const { query } = await request.json()

  try {
    const workers_routes = await getPaginatedZoneSetting(
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

// Workers Routes
router.post('/workers/routes', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/workers/routes')
})

/* Rules */
/*
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/pagerules
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/rulesets/phases/http_request_transform/entrypoint
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/rulesets/phases/http_request_late_transform/entrypoint
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/rulesets/phases/http_response_headers_transform/entrypoint
  https://api.cloudflare.com/client/v4/zones/${query.zoneId}/rulesets ":id"
  */

router.post('/rules', async request => {
  const { query } = await request.json()

  const getNormalizationSettingsId = resultArray => {
    for (let i = 0; i < resultArray.length; i++) {
      const current = resultArray[i]
      if (current.name === 'Cloudflare Normalization Ruleset') {
        return current.id
      }
    }
  }

  try {
    const [
      pagerules,
      url_rewrite,
      http_request_late_modification,
      http_response_headers_modification,
    ] = await Promise.all([
      getPaginatedZoneSetting(query.zoneId, query.apiToken, '/pagerules'),
      getPaginatedZoneSetting(
        query.zoneId,
        query.apiToken,
        '/rulesets/phases/http_request_transform/entrypoint',
      ),
      getPaginatedZoneSetting(
        query.zoneId,
        query.apiToken,
        '/rulesets/phases/http_request_late_transform/entrypoint',
      ),
      getPaginatedZoneSetting(
        query.zoneId,
        query.apiToken,
        '/rulesets/phases/http_response_headers_transform/entrypoint',
      ),
    ])

    const { result: ruleSets } = await getZoneSetting(
      query.zoneId,
      query.apiToken,
      '/rulesets',
    )
    const normalizationSettingsId = await getNormalizationSettingsId(ruleSets)

    const normalization_settings = await getZoneSetting(
      query.zoneId,
      query.apiToken,
      `/rulesets/${normalizationSettingsId}`,
    )

    return new Response(
      JSON.stringify({
        pagerules,
        url_rewrite,
        http_request_late_modification,
        http_response_headers_modification,
        normalization_settings,
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

// Page Rules
router.post('/pagerules', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/pagerules')
})

// URL Rewrite
router.post(
  '/rulesets/phases/http_request_transform/entrypoint',
  async request => {
    const { query } = await request.json()
    return FetchRequest(
      query.zoneId,
      query.apiToken,
      '/rulesets/phases/http_request_transform/entrypoint',
    )
  },
)

// HTTP Request Late Modification
router.post(
  '/rulesets/phases/http_request_late_transform/entrypoint',
  async request => {
    const { query } = await request.json()
    return FetchRequest(
      query.zoneId,
      query.apiToken,
      '/rulesets/phases/http_request_late_transform/entrypoint',
    )
  },
)

// HTTP Response Headers Modification
router.post(
  '/rulesets/phases/http_response_headers_transform/entrypoint',
  async request => {
    const { query } = await request.json()
    return FetchRequest(
      query.zoneId,
      query.apiToken,
      '/rulesets/phases/http_response_headers_transform/entrypoint',
    )
  },
)

// Normalization Settings (ENDPOINT HAS BEEN UPDATED BY CLOUDFLARE last checked 10/03/2022)
router.post('/url_normalization', async request => {
  const { query } = await request.json()

  return FetchRequest(query.zoneId, query.apiToken, '/url_normalization')
})

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

router.post('/network', async request => {
  const { query } = await request.json()

  try {
    const [
      http2,
      http3,
      zero_rtt,
      ipv6,
      grpc,
      websockets,
      opportunistic_onion,
      pseudo_ipv4,
      ip_geolocation,
      max_upload,
      response_buffering,
      true_client_ip_header,
    ] = await Promise.all([
      getZoneSetting(query.zoneId, query.apiToken, '/settings/http2'),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/http3'),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/0rtt'),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/ipv6'),
      getZoneSetting(query.zoneId, query.apiToken, '/flags'),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/websockets'),
      getZoneSetting(
        query.zoneId,
        query.apiToken,
        '/settings/opportunistic_onion',
      ),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/pseudo_ipv4'),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/ip_geolocation'),
      getZoneSetting(query.zoneId, query.apiToken, '/settings/max_upload'),
      getZoneSetting(
        query.zoneId,
        query.apiToken,
        '/settings/response_buffering',
      ),
      getZoneSetting(
        query.zoneId,
        query.apiToken,
        '/settings/true_client_ip_header',
      ),
    ])

    return new Response(
      JSON.stringify({
        http2,
        http3,
        zero_rtt,
        ipv6,
        grpc,
        websockets,
        opportunistic_onion,
        pseudo_ipv4,
        ip_geolocation,
        max_upload,
        response_buffering,
        true_client_ip_header,
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

// HTTP/2
router.post('/settings/http2', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/http2')
})

// HTTP/3 (with QUIC)
router.post('/settings/http3', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/http3')
})

// 0-RTT Connection Resumption
router.post('/settings/0rtt', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/0rtt')
})

// IPv6 Compatibility
router.post('/settings/ipv6', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/ipv6')
})

//gRPC ==> /flags "protocol": { "gRPC": boolean }

// WebSockets
router.post('/settings/websockets', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/websockets')
})

// Onion Routing
router.post('/settings/opportunistic_onion', async request => {
  const { query } = await request.json()
  return FetchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/opportunistic_onion',
  )
})

// Pseudo IPv4
router.post('/settings/pseudo_ipv4', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/pseudo_ipv4')
})

// IP Geolocation
router.post('/settings/ip_geolocation', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/ip_geolocation')
})

// Maximum Upload Size
router.post('/settings/max_upload', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/settings/max_upload')
})

// Response Buffering
router.post('/settings/response_buffering', async request => {
  const { query } = await request.json()
  return FetchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/response_buffering',
  )
})

// true_client_ip_header
router.post('/settings/true_client_ip_header', async request => {
  const { query } = await request.json()
  return FetchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/true_client_ip_header',
  )
})

/* Traffic */
/*
  to be added
  */

// can be deprecated, replaced using /load_balancers
router.post('/traffic/load_balancers', async request => {
  const { query } = await request.json()

  try {
    const load_balancers = await getZoneSetting(
      query.zoneId,
      query.apiToken,
      '/load_balancers',
    )

    return new Response(
      JSON.stringify({
        load_balancers,
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

// can be deprecated, replaced using /load_balancers/pools
router.post('/traffic/load_balancers/pools', async request => {
  const { query } = await request.json()

  try {
    const load_balancers_pools = await getAccountSetting(
      query.accountId,
      query.apiToken,
      '/load_balancers/pools',
    )

    return new Response(
      JSON.stringify({
        load_balancers_pools,
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

// Load Balancers
router.post('/load_balancers', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/load_balancers')
})

// Load Balancers Pools
router.post('/load_balancers/pools', async request => {
  const { query } = await request.json()
  return FetchAccountRequest(
    query.accountId,
    query.apiToken,
    '/load_balancers/pools',
  )
})

/* Custom Pages */
/*
  to be added
  */

/**
 * Scrape Shield
 */

router.post('/scrape_shield', async request => {
  const { query } = await request.json()

  try {
    const [
      email_obfuscation,
      server_side_exclude,
      hotlink_protection,
    ] = await Promise.all([
      getZoneSetting(
        query.zoneId,
        query.apiToken,
        '/settings/email_obfuscation',
      ),
      getZoneSetting(
        query.zoneId,
        query.apiToken,
        '/settings/server_side_exclude',
      ),
      getZoneSetting(
        query.zoneId,
        query.apiToken,
        '/settings/hotlink_protection',
      ),
    ])

    return new Response(
      JSON.stringify({
        email_obfuscation,
        server_side_exclude,
        hotlink_protection,
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
// Email Address Obfuscation
router.post('/settings/email_obfuscation', async request => {
  const { query } = await request.json()
  return FetchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/email_obfuscation',
  )
})

// Server-side Excludes
router.post('/settings/server_side_exclude', async request => {
  const { query } = await request.json()
  return FetchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/server_side_exclude',
  )
})

// Hotlink Protection
router.post('/settings/hotlink_protection', async request => {
  const { query } = await request.json()
  return FetchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/hotlink_protection',
  )
})

/**
 * Spectrum
 */

router.post('/spectrum/applications', async request => {
  const { query } = await request.json()

  try {
    const spectrum_applications = await getZoneSetting(
      query.zoneId,
      query.apiToken,
      '/spectrum/apps',
    )

    return new Response(
      JSON.stringify({
        spectrum_applications,
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

// Spectrum Applications
router.post('/spectrum/apps', async request => {
  const { query } = await request.json()
  return FetchRequest(query.zoneId, query.apiToken, '/spectrum/apps')
})

/**
 *
 *
 *
 * Zone Copier
 *
 *
 */

async function createZoneSetting(zoneId, apiToken, endpoint, data) {
  var myHeaders = new Headers()
  myHeaders.append('Authorization', `${apiToken}`)
  myHeaders.append('Content-Type', 'application/json')

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow',
    body: JSON.stringify(data),
  }

  const resp = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}${endpoint}`,
    requestOptions,
  )

  const respJSON = await resp.json()

  return respJSON
}

async function PostRequest(zoneId, apiToken, endpoint, data) {
  try {
    const resp = await createZoneSetting(zoneId, apiToken, endpoint, data)

    return new Response(
      JSON.stringify({
        resp,
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
}

async function deleteZoneSetting(zoneId, apiToken, endpoint, identifier) {
  var myHeaders = new Headers()
  myHeaders.append('Authorization', `${apiToken}`)
  myHeaders.append('Content-Type', 'application/json')

  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow',
    // body: JSON.stringify(data),
  }

  const resp = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}${endpoint}/${identifier}`,
    requestOptions,
  )

  const respJSON = await resp.json()

  return respJSON
}

async function DeleteRequest(zoneId, apiToken, endpoint, identifier) {
  try {
    const resp = await deleteZoneSetting(zoneId, apiToken, endpoint, identifier)

    return new Response(
      JSON.stringify({
        resp,
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
}

async function patchZoneSetting(zoneId, apiToken, endpoint, data) {
  var myHeaders = new Headers()
  myHeaders.append('Authorization', `${apiToken}`)
  myHeaders.append('Content-Type', 'application/json')

  var requestOptions = {
    method: 'PATCH',
    headers: myHeaders,
    redirect: 'follow',
    body: JSON.stringify(data),
  }

  const resp = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}${endpoint}`,
    requestOptions,
  )

  const respJSON = await resp.json()

  return respJSON
}

async function PatchRequest(zoneId, apiToken, endpoint, data) {
  try {
    const resp = await patchZoneSetting(zoneId, apiToken, endpoint, data)

    return new Response(
      JSON.stringify({
        resp,
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
}

async function putZoneSetting(zoneId, apiToken, endpoint, data) {
  var myHeaders = new Headers()
  myHeaders.append('Authorization', `${apiToken}`)
  myHeaders.append('Content-Type', 'application/json')

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    redirect: 'follow',
    body: JSON.stringify(data),
  }

  const resp = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}${endpoint}`,
    requestOptions,
  )

  const respJSON = await resp.json()

  return respJSON
}

async function PutRequest(zoneId, apiToken, endpoint, data) {
  try {
    const resp = await putZoneSetting(zoneId, apiToken, endpoint, data)

    return new Response(
      JSON.stringify({
        resp,
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
}

/**
 * DNS Records
 */

router.post('/copy/dns_records', async request => {
  const { query } = await request.json()
  return PostRequest(query.zoneId, query.apiToken, '/dns_records', query.data)
})

router.post('/delete/dns_records', async request => {
  const { query } = await request.json()
  return DeleteRequest(
    query.zoneId,
    query.apiToken,
    '/dns_records',
    query.identifier,
  )
})

/**
 * CNAME Flattening -- does not accept PATCH requests
 */

/**
 * SSL Setting
 */

router.post('/patch/settings/ssl', async request => {
  const { query } = await request.json()
  return PatchRequest(query.zoneId, query.apiToken, '/settings/ssl', query.data)
})

/**
 * Custom Hostnames
 */

router.post('/copy/custom_hostnames', async request => {
  const { query } = await request.json()
  return PostRequest(
    query.zoneId,
    query.apiToken,
    '/custom_hostnames',
    query.data,
  )
})

router.post('/delete/custom_hostnames', async request => {
  const { query } = await request.json()
  return DeleteRequest(
    query.zoneId,
    query.apiToken,
    '/dns_records',
    query.identifier,
  )
})

/**
 * SSL Recommendation
 */
router.post('/patch/ssl/recommendation', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/ssl/recommendation',
    query.data,
  )
})

/**
 * Always Use HTTPS
 */
router.post('/patch/settings/always_use_https', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/always_use_https',
    query.data,
  )
})

/**
 * Minimum TLS Version
 */
router.post('/patch/settings/min_tls_version', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/min_tls_version',
    query.data,
  )
})

/**
 * Opportunistic Encryption
 */
router.post('/patch/settings/opportunistic_encryption', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/opportunistic_encryption',
    query.data,
  )
})

/**
 * TLS 1.3
 */
router.post('/patch/settings/tls_1_3', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/tls_1_3',
    query.data,
  )
})

/**
 * Automatic HTTPS Rewrites
 */
router.post('/patch/settings/automatic_https_rewrites', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/automatic_https_rewrites',
    query.data,
  )
})

/**
 * Universal SSL Certificate Authority
 */
router.post('/patch/ssl/universal/settings', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/ssl/universal/settings',
    query.data,
  )
})

/**
 * Authenticated Origin Pulls
 */
router.post('/patch/settings/tls_client_auth', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/tls_client_auth',
    query.data,
  )
})

/**
 *
 *
 *
 *
 *
 *
 *
 * FIREWALL
 *
 *
 *
 *
 *
 *
 */

/**
 * Firewall Rules
 */
router.post('/copy/firewall/rules', async request => {
  const { query } = await request.json()
  return PostRequest(
    query.zoneId,
    query.apiToken,
    '/firewall/rules',
    query.data,
  )
})

router.post('/delete/firewall/rules', async request => {
  const { query } = await request.json()
  return DeleteRequest(
    query.zoneId,
    query.apiToken,
    '/firewall/rules',
    query.identifier,
  )
})

// before creating a Firewall Rule, we need to first
// create the filter at the zone to be copied to
router.post('/filters', async request => {
  const { query } = await request.json()
  return PostRequest(query.zoneId, query.apiToken, '/filters', query.data)
})

// // WAF Setting
// router.post('/settings/waf', async request => {
//   const { query } = await request.json()
//   return FetchRequest(query.zoneId, query.apiToken, '/settings/waf')
// })

// // managed_rulesets_results, to be added
// router.post(
//   '/rulesets/phases/http_request_firewall_managed/entrypoint',
//   async request => {
//     const { query } = await request.json()
//     return FetchRequest(
//       query.zoneId,
//       query.apiToken,
//       '/rulesets/phases/http_request_firewall_managed/entrypoint',
//     )
//   },
// )

// // Rulesets
// router.post('/rulesets', async request => {
//   const { query } = await request.json()
//   return FetchRequest(query.zoneId, query.apiToken, '/rulesets')
// })

/**
 * Firewall Access Rules (IP Access Rules)
 */
router.post('/copy/firewall/access_rules/rules', async request => {
  const { query } = await request.json()
  return PostRequest(
    query.zoneId,
    query.apiToken,
    '/firewall/access_rules/rules',
    query.data,
  )
})

router.post('/delete/firewall/access_rules/rules', async request => {
  const { query } = await request.json()
  return DeleteRequest(
    query.zoneId,
    query.apiToken,
    '/firewall/access_rules/rules',
    query.identifier,
  )
})

/**
 * Rate Limits
 */
router.post('/copy/rate_limits', async request => {
  const { query } = await request.json()
  return PostRequest(query.zoneId, query.apiToken, '/rate_limits', query.data)
})

router.post('/delete/rate_limits', async request => {
  const { query } = await request.json()
  return DeleteRequest(
    query.zoneId,
    query.apiToken,
    '/rate_limits',
    query.identifier,
  )
})

/**
 * Firewall User Agent Blocking Rules
 */
router.post('/copy/firewall/ua_rules', async request => {
  const { query } = await request.json()
  return PostRequest(
    query.zoneId,
    query.apiToken,
    '/firewall/ua_rules',
    query.data,
  )
})

router.post('/delete/firewall/ua_rules', async request => {
  const { query } = await request.json()
  return DeleteRequest(
    query.zoneId,
    query.apiToken,
    '/firewall/ua_rules',
    query.identifier,
  )
})

/**
 * Firewall Lockdowns
 */
router.post('/copy/firewall/lockdowns', async request => {
  const { query } = await request.json()
  return PostRequest(
    query.zoneId,
    query.apiToken,
    '/firewall/lockdowns',
    query.data,
  )
})

router.post('/delete/firewall/lockdowns', async request => {
  const { query } = await request.json()
  return DeleteRequest(
    query.zoneId,
    query.apiToken,
    '/firewall/lockdowns',
    query.identifier,
  )
})

/**
 * Security Level
 */
router.post('/patch/settings/security_level', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/security_level',
    query.data,
  )
})

/**
 * Challenge TTL
 */
router.post('/patch/settings/challenge_ttl', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/challenge_ttl',
    query.data,
  )
})

/**
 * Browser Check
 */
router.post('/patch/settings/browser_check', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/browser_check',
    query.data,
  )
})

/**
 * Privacy Pass
 */
router.post('/patch/settings/privacy_pass', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/privacy_pass',
    query.data,
  )
})

/**
 * Custom Rules WAF -- not tested yet
 */
router.post(
  '/put/rulesets/phases/http_request_firewall_custom/entrypoint',
  async request => {
    const { query } = await request.json()
    return PutRequest(
      query.zoneId,
      query.apiToken,
      '/rulesets/phases/http_request_firewall_custom/entrypoint',
      query.data,
    )
  },
)

/**
 * Custom Rules Rate Limits -- not tested yet
 */
router.post('/put/rulesets/phases/http_ratelimit/entrypoint', async request => {
  const { query } = await request.json()
  return PutRequest(
    query.zoneId,
    query.apiToken,
    '/rulesets/phases/http_ratelimit/entrypoint',
    query.data,
  )
})

// // Page Shield
// router.post('/script_monitor/scripts', async request => {
//   const { query } = await request.json()
//   return FetchRequest(query.zoneId, query.apiToken, '/script_monitor/scripts')
// })

// // DDoS L7
// router.post('/rulesets/phases/ddos_l7/entrypoint', async request => {
//   const { query } = await request.json()
//   return FetchRequest(
//     query.zoneId,
//     query.apiToken,
//     '/rulesets/phases/ddos_l7/entrypoint',
//   )
// })

// // DDoS L7 ruleset
// // DDoS L7 Ruleset ID = 4d21379b4f9f4bb088e0729962c8b3cf
// // if this ID changes on Cloudflare API's side, then this value needs to be updated
// router.post('/rulesets/ddos_l7', async request => {
//   const { query } = await request.json()
//   return FetchRequest(
//     query.zoneId,
//     query.apiToken,
//     '/rulesets/4d21379b4f9f4bb088e0729962c8b3cf',
//   )
// })

/**
 * DDoS L7
 */
router.post('/put/rulesets/phases/ddos_l7/entrypoint', async request => {
  const { query } = await request.json()
  return PutRequest(
    query.zoneId,
    query.apiToken,
    '/rulesets/phases/ddos_l7/entrypoint',
    query.data,
  )
})

/**
 *
 *
 *
 *
 *
 * Speed
 *
 *
 *
 *
 *
 *
 */

/**
 * Mirage
 */
router.post('/patch/settings/mirage', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/mirage',
    query.data,
  )
})

/**
 * Image Resizing
 */
router.post('/patch/settings/image_resizing', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/image_resizing',
    query.data,
  )
})

/**
 * Polish
 */
router.post('/patch/settings/polish', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/polish',
    query.data,
  )
})

/**
 * Minify
 */
router.post('/patch/settings/minify', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/minify',
    query.data,
  )
})

/**
 * Brotli
 */
router.post('/patch/settings/brotli', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/brotli',
    query.data,
  )
})

/**
 * Early Hints
 */
router.post('/patch/settings/early_hints', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/early_hints',
    query.data,
  )
})

/**
 * Automatic Platform Optimization
 */
router.post(
  '/patch/settings/automatic_platform_optimization',
  async request => {
    const { query } = await request.json()
    return PatchRequest(
      query.zoneId,
      query.apiToken,
      '/settings/automatic_platform_optimization',
      query.data,
    )
  },
)

/**
 * H2 Prioritization
 */
router.post('/patch/settings/h2_prioritization', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/h2_prioritization',
    query.data,
  )
})

/**
 * Rocket Loader
 */
router.post('/patch/settings/rocket_loader', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/rocket_loader',
    query.data,
  )
})

/**
 * Railguns - "API Tokens are not supported by this API for now"
 * When the API is supported then all these router functions need to be updated
 */
router.post('/patch/railguns', async request => {
  const { query } = await request.json()
  return PatchRequest(query.zoneId, query.apiToken, '/railguns', query.data)
})

router.post('/copy/railguns', async request => {
  const { query } = await request.json()
  return PostRequestSetting(query.apiToken, '/railguns', query.data)
})

router.post('/delete/railguns', async request => {
  const { query } = await request.json()
  return DeleteRequest(
    query.zoneId,
    query.apiToken,
    '/railguns',
    query.identifier,
  )
})

async function createSetting(apiToken, endpoint, data) {
  var myHeaders = new Headers()
  myHeaders.append('Authorization', `${apiToken}`)
  myHeaders.append('Content-Type', 'application/json')

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow',
    body: JSON.stringify(data),
  }

  const resp = await fetch(
    `https://api.cloudflare.com/client/v4/${endpoint}`,
    requestOptions,
  )

  const respJSON = await resp.json()

  return respJSON
}

async function PostRequestSetting(apiToken, endpoint, data) {
  try {
    const resp = await createSetting(apiToken, endpoint, data)
    return new Response(
      JSON.stringify({
        resp,
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
}

/**
 * Prefetch Preload
 */
router.post('/patch/settings/prefetch_preload', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/prefetch_preload',
    query.data,
  )
})

/**
 * Mobile Redirect
 */
router.post('/patch/settings/mobile_redirect', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/mobile_redirect',
    query.data,
  )
})

/**
 *
 *
 *
 * Caching
 *
 *
 *
 */

/**
 * Argo Tiered Caching
 */
router.post('/patch/argo/tiered_caching', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/argo/tiered_caching',
    query.data,
  )
})

/**
 * Tiered Cache Topology
 */
router.post(
  '/patch/cache/tiered_cache_smart_topology_enable',
  async request => {
    const { query } = await request.json()
    return PatchRequest(
      query.zoneId,
      query.apiToken,
      '/cache/tiered_cache_smart_topology_enable',
      query.data,
    )
  },
)

/**
 * Cache Level
 */
router.post('/patch/settings/cache_level', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/cache_level',
    query.data,
  )
})

/**
 * Browser Cache TTL
 */
router.post('/patch/settings/browser_cache_ttl', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/browser_cache_ttl',
    query.data,
  )
})

// Crawlhints => "cache": "crawlhints_enabled"
/**
 * Crawlhints
 */
router.post('/post/flags/products/cache/changes', async request => {
  const { query } = await request.json()
  return PostRequest(
    query.zoneId,
    query.apiToken,
    '/flags/products/cache/changes',
    query.data,
  )
})

/**
 * Always Online
 */
router.post('/patch/settings/always_online', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/always_online',
    query.data,
  )
})

/**
 * Development Mode
 */
router.post('/patch/settings/development_mode', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/development_mode',
    query.data,
  )
})

/**
 * Query String Sort
 */
router.post('/patch/settings/sort_query_string_for_cache', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/sort_query_string_for_cache',
    query.data,
  )
})

/**
 *
 *
 *
 *
 * Workers
 *
 *
 *
 */

/**
 * Workers Routes
 */

router.post('/copy/workers/routes', async request => {
  const { query } = await request.json()
  return PostRequest(
    query.zoneId,
    query.apiToken,
    '/workers/routes',
    query.data,
  )
})

router.post('/delete/workers/routes', async request => {
  const { query } = await request.json()
  return DeleteRequest(
    query.zoneId,
    query.apiToken,
    '/workers/routes',
    query.identifier,
  )
})

/**
 *
 *
 *
 *
 * Rules
 *
 *
 *
 *
 */

/**
 * Page Rules
 */

router.post('/copy/pagerules', async request => {
  const { query } = await request.json()
  return PostRequest(query.zoneId, query.apiToken, '/pagerules', query.data)
})

router.post('/delete/pagerules', async request => {
  const { query } = await request.json()
  return DeleteRequest(
    query.zoneId,
    query.apiToken,
    '/pagerules',
    query.identifier,
  )
})

/**
 * URL Rewrite
 */
router.post(
  '/put/rulesets/phases/http_request_transform/entrypoint',
  async request => {
    const { query } = await request.json()
    return PutRequest(
      query.zoneId,
      query.apiToken,
      '/rulesets/phases/http_request_transform/entrypoint',
      query.data,
    )
  },
)

/**
 * HTTP Request Late Modification
 */
router.post(
  '/put/rulesets/phases/http_request_late_transform/entrypoint',
  async request => {
    const { query } = await request.json()
    return PutRequest(
      query.zoneId,
      query.apiToken,
      '/rulesets/phases/http_request_late_transform/entrypoint',
      query.data,
    )
  },
)

/**
 * HTTP Response Headers Modification
 */
router.post(
  '/put/rulesets/phases/http_response_headers_transform/entrypoint',
  async request => {
    const { query } = await request.json()
    return PutRequest(
      query.zoneId,
      query.apiToken,
      '/rulesets/phases/http_response_headers_transform/entrypoint',
      query.data,
    )
  },
)

/**
 * Normalization Settings (ENDPOINT HAS BEEN UPDATED BY CLOUDFLARE last checked 10/03/2022)
 */
router.post('/put/url_normalization', async request => {
  const { query } = await request.json()
  return PutRequest(
    query.zoneId,
    query.apiToken,
    '/url_normalization',
    query.data,
  )
})

/**
 *
 *
 *
 *
 *
 * Network
 *
 *
 *
 *
 */

/**
 * HTTP/2
 */
router.post('/patch/settings/http2', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/http2',
    query.data,
  )
})

/**
 * HTTP/3 (with QUIC)
 */
router.post('/patch/settings/http3', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/http3',
    query.data,
  )
})

/**
 * 0-RTT Connection Resumption
 */
router.post('/patch/settings/0rtt', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/0rtt',
    query.data,
  )
})

/**
 * IPv6 Compatibility
 */
router.post('/patch/settings/ipv6', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/ipv6',
    query.data,
  )
})

//gRPC ==> /flags "protocol": { "gRPC": boolean }
router.post('/post/flags/products/protocols/changes', async request => {
  const { query } = await request.json()
  return PostRequest(
    query.zoneId,
    query.apiToken,
    '/flags/products/protocols/changes',
    query.data,
  )
})

/**
 * WebSockets
 */
router.post('/patch/settings/websockets', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/websockets',
    query.data,
  )
})

/**
 * Onion Routing
 */
router.post('/patch/settings/opportunistic_onion', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/opportunistic_onion',
    query.data,
  )
})

/**
 * Psuedo IPv4
 */
router.post('/patch/settings/pseudo_ipv4', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/pseudo_ipv4',
    query.data,
  )
})

/**
 * IP Geolocation
 */
router.post('/patch/settings/ip_geolocation', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/ip_geolocation',
    query.data,
  )
})

/**
 * Maximum Upload Size
 */
router.post('/patch/settings/max_upload', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/max_upload',
    query.data,
  )
})

/**
 * Response Buffering
 */
router.post('/patch/settings/response_buffering', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/response_buffering',
    query.data,
  )
})

/**
 * True Client IP Header
 */

router.post('/patch/settings/true_client_ip_header', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/true_client_ip_header',
    query.data,
  )
})
/**
 *
 *
 *
 *
 * Traffic
 *
 *
 *
 *
 */

/**
 * Load Balancers
 */

router.post('/copy/load_balancers', async request => {
  const { query } = await request.json()
  return PostRequest(
    query.zoneId,
    query.apiToken,
    '/load_balancers',
    query.data,
  )
})

router.post('/delete/load_balancers', async request => {
  const { query } = await request.json()
  return DeleteRequest(
    query.zoneId,
    query.apiToken,
    '/load_balancers',
    query.identifier,
  )
})

/**
 *
 *
 *
 *
 * Scrape Shield
 *
 *
 *
 */

/**
 * Email Address Obfuscation
 */
router.post('/patch/settings/email_obfuscation', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/email_obfuscation',
    query.data,
  )
})

/**
 * Server-Side Exclude
 */
router.post('/patch/settings/server_side_exclude', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/server_side_exclude',
    query.data,
  )
})

/**
 * Hotlink Protection
 */
router.post('/patch/settings/hotlink_protection', async request => {
  const { query } = await request.json()
  return PatchRequest(
    query.zoneId,
    query.apiToken,
    '/settings/hotlink_protection',
    query.data,
  )
})

/**
 *
 *
 *
 * Spectrum
 *
 *
 *
 */

/**
 * Spectrum Applications
 */
router.post('/copy/spectrum/apps', async request => {
  const { query } = await request.json()
  return PostRequest(query.zoneId, query.apiToken, '/spectrum/apps', query.data)
})

router.post('/delete/spectrum/apps', async request => {
  const { query } = await request.json()
  return DeleteRequest(
    query.zoneId,
    query.apiToken,
    '/spectrum/apps',
    query.identifier,
  )
})
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
