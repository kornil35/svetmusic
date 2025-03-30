import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Content-Type': 'application/json',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    })
  }

  let email = ''
  try {
    const body = await req.json()
    email = body.email
  } catch (err) {
    console.error('Invalid JSON:', err)
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: corsHeaders,
    })
  }

  if (!email) {
    return new Response(JSON.stringify({ error: 'No email provided' }), {
      status: 400,
      headers: corsHeaders,
    })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    let users: any[] = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      const { data, error } = await supabase.auth.admin.listUsers({
        page,
        perPage: 100,
      })

      if (error) {
        console.error('[check-user] Supabase error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: corsHeaders,
        })
      }

      users = users.concat(data.users)
      hasMore = data.users.length === 100
      page++
    }

    const found = users.some(
      user => user.email?.toLowerCase() === email.toLowerCase()
    )

    return new Response(JSON.stringify({
      exists: found,
      debug: {
        totalUsers: users.length,
        checkedEmail: email,
        sampleUser: users[0]?.email
      }
    }), {
      status: 200,
      headers: corsHeaders,
    })
  } catch (err) {
    console.error('[check-user] Unexpected error:', err)
    return new Response(JSON.stringify({ error: 'Unexpected error' }), {
      status: 500,
      headers: corsHeaders,
    })
  }
})
