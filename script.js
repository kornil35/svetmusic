// отключаем восстановление позиции скролла
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

const scrollBtn = document.getElementById('scrollToPitch')
const pitchSection = document.querySelector('.pitch-alt')

if (scrollBtn && pitchSection) {
  scrollBtn.addEventListener('click', (e) => {
    e.preventDefault()
    pitchSection.scrollIntoView({ behavior: 'smooth' })
  })
}



document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('audio').forEach(audio => {
      audio.volume = 0.1
    })
  
    document.body.classList.add('lock-scroll')
  
    let unlocked = false
  
    window.addEventListener('wheel', () => {
      if (unlocked) return
  
      unlocked = true
      document.body.classList.remove('lock-scroll')
  
      const pitchSection = document.querySelector('.pitch-alt')
      pitchSection.classList.add('show')
    }, { once: true })
  })
  
  document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('burger')
    const nav = document.getElementById('navLinks')
  
    burger.addEventListener('click', () => {
      nav.classList.toggle('active')
    })
  })
  
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.parentElement;
      item.classList.toggle('active');
    });
  });

  // Modal functionality for contact form
  // Show modal when button is clicked and hide when close button or outside of modal is clicked
  document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('contactModal')
    const openBtn = document.getElementById('openContactModal')
    const closeBtn = document.getElementById('closeModal')
  
    openBtn.addEventListener('click', () => {
      modal.style.display = 'flex'
      document.body.classList.add('modal-open')
    })
    
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none'
      document.body.classList.remove('modal-open')
    })
    
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none'
        document.body.classList.remove('modal-open')
      }
    })
    
  })
  
  let nextClickCount = 0
  let errorToastTimeout

  document.addEventListener('DOMContentLoaded', () => {
    const nextBtn = document.getElementById('nextBtn')
    const backBtn = document.getElementById('backToStep1')
    const step1 = document.querySelector('.step-1')
    const step2 = document.querySelector('.step-2')
  
nextBtn.addEventListener('click', () => {
  const name = step1.querySelector('input[name="name"]').value.trim()
  const email = step1.querySelector('input[name="email"]').value.trim()
  const msg = step1.querySelector('textarea[name="message"]').value.trim()

  if (!name || !email || !msg) {
        nextClickCount++
        const errorToast = document.getElementById('errorToast')
        let message = 'Please fill in all fields.'
        if (nextClickCount > 1) {
          message += `  (x${nextClickCount})`
        }
        errorToast.textContent = message
        
        errorToast.classList.add('show')

        // сбрасываем предыдущий таймер, если есть
        clearTimeout(errorToastTimeout)
        
        // запускаем новый таймер
        errorToastTimeout = setTimeout(() => {
          errorToast.classList.remove('show')
          nextClickCount = 0 // сбрасываем счётчик
          errorToastTimeout = null
        }, 3500)
        
        return
      }
      
      
  
      step1.style.display = 'none'
      step2.style.display = 'flex'
      step2.style.flexDirection = 'column'
      step2.style.gap = '16px'
      backBtn.style.display = 'block' // показать стрелку
    })
  
    backBtn.addEventListener('click', () => {
      step2.style.display = 'none'
      step1.style.display = 'flex'
      backBtn.style.display = 'none' // спрятать стрелку
    })
  })
  
  
  document.addEventListener('DOMContentLoaded', () => {
    const radios = document.querySelectorAll('input[name="exclusive"]')
    const detailsBox = document.getElementById('customTrackDetails')
  
    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.value === 'Yes') {
          detailsBox.style.display = 'block'
          setTimeout(() => {
            detailsBox.classList.add('active')
          }, 10)
        } else {
          detailsBox.classList.remove('active')
          setTimeout(() => {
            detailsBox.style.display = 'none'
          }, 400)
        }
      })
    })
  })
  
// Contact form submission using Formspree
// вынеси эту функцию выше, чтобы была доступна везде
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(String(email).toLowerCase())
}

// а это пусть остаётся внутри DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm')
  const modal = document.getElementById('contactModal')
  const toast = document.getElementById('successToast')

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const formData = new FormData(form)
    const email = formData.get('email').trim()

    if (!validateEmail(email)) {
      errorToast.textContent = 'Invalid email format.'
      errorToast.classList.add('show')
    
      clearTimeout(errorToastTimeout)
      errorToastTimeout = setTimeout(() => {
        errorToast.classList.remove('show')
        errorToastTimeout = null
      }, 3500)
    
      return
    }
    

    try {
      const response = await fetch('https://formspree.io/f/mzzevnqy', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      })

      if (response.ok) {
        form.reset()
      
        const detailsBox = document.getElementById('customTrackDetails')
        detailsBox.classList.remove('active')
        detailsBox.style.display = 'none'
      
        document.querySelectorAll('input[name="exclusive"]').forEach(r => r.checked = false)
      
        toast.classList.add('show')
        setTimeout(() => {
          toast.classList.remove('show')
        }, 3500)
      
        document.querySelector('.step-1').style.display = 'flex'
        document.querySelector('.step-2').style.display = 'none'
        document.getElementById('backToStep1').style.display = 'none'
        
        modal.style.display = 'none'
        document.body.classList.remove('modal-open')

      } else {
        showCustomErrorToast()
      }
    } catch (err) {
      showCustomErrorToast()
    }
  })
})

function showCustomErrorToast() {
  const errorToast = document.getElementById('errorToast')
  errorToast.textContent =
    'Something went wrong during submission. Please contact support and describe the issue.'
  errorToast.classList.add('show')

  clearTimeout(errorToastTimeout)
  errorToastTimeout = setTimeout(() => {
    errorToast.classList.remove('show')
    errorToastTimeout = null
  }, 4500)
}





// Back button functionality for step 2 of the form
document.addEventListener('DOMContentLoaded', () => {
  const backBtn = document.getElementById('backToStep1')
  const step1 = document.querySelector('.step-1')
  const step2 = document.querySelector('.step-2')

  backBtn.addEventListener('click', () => {
    backBtn.style.display = 'none'

    step2.style.display = 'none'
    step1.style.display = 'flex'
  })
})


// Smooth scroll for navigation links and footer links
// добавляем обработку для ссылок в навигации и футере
document.querySelectorAll('.nav-links a, .footer-links a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault()
    const targetText = link.textContent.toLowerCase().trim()

    let targetSection
    switch (targetText) {
      case 'home':
        targetSection = document.querySelector('.hero-two-col')
        break
      case 'about':
        targetSection = document.querySelector('.pitch-alt')
        break
      case 'tracks':
        targetSection = document.querySelector('.tracks')
        break
      case 'reviews': // вот добавляем обработку
        targetSection = document.querySelector('.testimonials')
        break
      case 'faq':
        targetSection = document.querySelector('.faq-section')
        break
      case 'contact':
        targetSection = document.querySelector('.contact-title')
        break
      default:
        targetSection = null
    }

    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' })
    }
  })
})


document.addEventListener('DOMContentLoaded', () => {
  const scrollToTopBtn = document.getElementById('scrollToTop')

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add('show')
    } else {
      scrollToTopBtn.classList.remove('show')
    }
  })

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
})


// Copy email to clipboard functionality
document.addEventListener('DOMContentLoaded', () => {
  const emailElement = document.getElementById('copyEmail')
  const tooltip = document.getElementById('copyTooltip')

  emailElement.addEventListener('click', () => {
    navigator.clipboard.writeText(emailElement.textContent)

    emailElement.parentElement.classList.add('copied')

    setTimeout(() => {
      emailElement.parentElement.classList.remove('copied')
    }, 2000)
  })
})


// Set today's date as the default value for the date input field in the contact form
// добавляем установку текущей даты в поле ввода даты в форме контактов
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.querySelector('input[name="event_date_year_month_day"]')
  if (dateInput) {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    dateInput.value = `${yyyy}-${mm}-${dd}`
  }
})

// Prevent default double-click behavior (like text selection) on the entire document
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('dblclick', (e) => {
    e.preventDefault()
  }, { passive: false })
})
