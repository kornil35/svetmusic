import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
import { showToast } from './toast.js'

const supabase = createClient(
  'https://exfqnxdtpnvgyyuagtsn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZnFueGR0cG52Z3l5dWFndHNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMTI0MTMsImV4cCI6MjA1ODc4ODQxM30.2C1raGNsGJCgrtxnFCp2bRIXfO9SoiFZDGYkUn64cf4'
)

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm')
  const passwordHint = document.getElementById("passwordHint");

  if (form) {

// проверка пароля на надежность

const strengthBar = document.querySelector(".strength-bar");

    const strengthFill = document.getElementById("strengthFill");
const strengthLabel = document.getElementById("strengthLabel");
const passwordInput = form.password;
const strengthWrapper = document.querySelector(".password-strength");
strengthWrapper.classList.add("hidden"); // по умолчанию скрыт


passwordInput.addEventListener("input", () => {
  
  const value = passwordInput.value;

  const isValidLatin = /^[a-zA-Z0-9!@#$%^&*]*$/.test(value);

if (!isValidLatin) {
  passwordHint.style.display = "block";
  passwordInput.style.borderColor = "#e74c3c";
} else {
  passwordHint.style.display = "none";
  passwordInput.style.borderColor = "";
}


  // Показать блок, если начали вводить
  if (value.length > 0) {
    strengthWrapper.classList.remove("hidden");
  } else {
    strengthWrapper.classList.add("hidden");
  }


  
  // Оценка силы
  let strength = 0;
  if (value.length >= 6) strength++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength++;
  if (/\d/.test(value)) strength++;
  if (value.length >= 10) strength++;

  let color = "#ddd", label = "";

  switch (strength) {
    case 0:
    case 1:
      color = "#e74c3c"; label = "Weak"; break;
    case 2:
      color = "#f39c12"; label = "Okay"; break;
    case 3:
      color = "#27ae60"; label = "Good"; break;
    case 4:
      color = "#2ecc71"; label = "Strong"; break;
  }

  strengthBar.style.setProperty("--strength-color", color);
  strengthBar.style.setProperty("--strength-width", `${(strength / 4) * 100}%`);
  strengthBar.style.setProperty("background", "#ddd");
  strengthBar.style.setProperty("position", "relative");
// Убрать transition при первом вводе
if (!strengthFill.classList.contains('filled')) {
  strengthFill.classList.add('instant');
  strengthFill.offsetHeight; // force reflow
  strengthFill.classList.remove('instant');
  strengthFill.classList.add('filled'); // помечаем, что уже начали анимацию
}

strengthFill.style.width = `${(strength / 4) * 100}%`;
strengthFill.style.background = color;



  
  strengthLabel.textContent = label;
});




    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const email = form.email.value.trim()
      const password = form.password.value.trim()
      const username = form.username.value.trim()
      // Проверка на не-латиницу в пароле
const isValidLatin = /^[a-zA-Z0-9!@#$%^&*]*$/.test(password);
if (!isValidLatin) {
  passwordHint.style.display = "block";
  passwordInput.style.borderColor = "#e74c3c";
  showToast("Password contains non-Latin characters", "error");
  return;
}

// Проверка минимальной длины
if (password.length < 6) {
  showToast("Password must be at least 6 characters", "error");
  passwordInput.style.borderColor = "#e74c3c";
  return;
}

// Проверка на силу пароля — если слабый, не пускаем
let strength = 0;
if (password.length >= 6) strength++;
if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
if (/\d/.test(password)) strength++;
if (password.length >= 10) strength++;

if (strength < 2) {
  showToast("Password is too weak. Use mixed case or numbers.", "error");
  passwordInput.style.borderColor = "#e74c3c";
  return;
}


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

    const usernameInput = form.username;
const usernameHint = document.getElementById("usernameHint");

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
    console.error('Ошибка запроса check-user:', err)
    return false
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const googleButton = document.getElementById('googleLogin')

  if (googleButton) {
    googleButton.addEventListener('click', async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/profile.html'
        }
      })

      if (error) {
        showToast('There was an error signing in with Google Google: ' + error.message, 'error')
      }
    })
  }
})
