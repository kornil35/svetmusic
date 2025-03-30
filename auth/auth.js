import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
import { showToast } from './toast.js'

const supabase = createClient(
  'https://exfqnxdtpnvgyyuagtsn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZnFueGR0cG52Z3l5dWFndHNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMTI0MTMsImV4cCI6MjA1ODc4ODQxM30.2C1raGNsGJCgrtxnFCp2bRIXfO9SoiFZDGYkUn64cf4'
)

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm')

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const email = form.email.value.trim()
      const password = form.password.value.trim()
      const username = form.username.value.trim()

      // Проверка по базе через Edge Function
      console.log('[REGISTRATION] Checking email...', email)
      const emailExists = await checkEmailExists(email)
      console.log('[REGISTRATION] Result:', emailExists)
      
      if (emailExists) {
        showToast('This email is already in use', 'error')
        return
      }

const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: 'https://carigoo.rent/auth/after-confirm.html',
    data: {
      username: username
    }
  }
})


      if (error) {
        showToast('Ошибка: ' + error.message, 'error')
      } else {
        showToast('Success! Please confirm your email via the link in the message', 'success')
      }
    })
  }
})

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm')

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault()
      const email = loginForm.email.value.trim()
      const password = loginForm.password.value.trim()

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        showToast('Error: ' + error.message, 'error')
      } else {
        showToast('✅ Logged in successfully!', 'success')
        loginForm.reset()
        setTimeout(() => {
          window.location.href = '/auth/profile.html'
        }, 2000)
      }
    })
  }
})

const checkEmailExists = async (email) => {
  try {
    const res = await fetch('https://exfqnxdtpnvgyyuagtsn.functions.supabase.co/check-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })

    if (!res.ok) {
      console.error('Error while verifying email:', await res.text())
      return false
    }

    const result = await res.json()
    console.log('[check-user result]', result)
    return result.exists
    
  } catch (err) {
    console.error('Check-user request error:', err)
    return false
  }
}
