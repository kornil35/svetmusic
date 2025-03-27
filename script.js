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
    })
  
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none'
    })
  
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none'
      }
    })
  })
  
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
        alert('Please fill in all fields before continuing.')
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
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm')
  const modal = document.getElementById('contactModal')
  const toast = document.getElementById('successToast')

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const formData = new FormData(form)

    try {
      const response = await fetch('https://formspree.io/f/mzzevnqy', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      })

      if (response.ok) {
        form.reset()
      
        // скрыть кастомное поле вручную
        const detailsBox = document.getElementById('customTrackDetails')
        detailsBox.classList.remove('active')
        detailsBox.style.display = 'none'
      
        // сброс radio (если браузер не делает этого сам)
        document.querySelectorAll('input[name="exclusive"]').forEach(r => r.checked = false)
      
        // показать уведомление
        toast.classList.add('show')
        setTimeout(() => {
          toast.classList.remove('show')
        }, 3500)
      
        // вернуть к первому шагу
        document.querySelector('.step-1').style.display = 'flex'
        document.querySelector('.step-2').style.display = 'none'
        document.getElementById('backToStep1').style.display = 'none'
        
        modal.style.display = 'none' // вот эта строка — закрывает форму

            
      
      } else {
        alert('Ошибка при отправке. Попробуй ещё раз.')
      }
    } catch (err) {
      alert('Ошибка сети.')
    }
  })
})

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
