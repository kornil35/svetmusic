export function showToast(message, type = 'default') {
    const toast = document.createElement('div')
    toast.textContent = message
    toast.className = 'toast ' + type
    document.body.appendChild(toast)
  
    setTimeout(() => {
      toast.classList.add('show')
    }, 10)
  
    setTimeout(() => {
      toast.classList.remove('show')
      setTimeout(() => toast.remove(), 300)
    }, 4000)
  }