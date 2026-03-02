/* ══════════════════════════════════════
   HOLI GIFT SURPRISE — SCRIPT
   ══════════════════════════════════════ */

;(function () {
  'use strict'

  /* ─── DOM References ─── */
  const $ = (sel) => document.querySelector(sel)
  const stage1    = $('#stage1')
  const stage2    = $('#stage2')
  const stage3    = $('#stage3')
  const senderLine = $('#senderLine')
  const holiTitle  = $('#holiTitle')
  const giftBtn    = $('#giftBtn')
  const bgMusic    = $('#bgMusic')
  const musicToggle = $('#musicToggle')
  const reelVideo  = $('#reelVideo')
  const skipReel   = $('#skipReel')
  const recipientInput = $('#recipientName')
  const shareBtn   = $('#shareBtn')
  const replayBtn  = $('#replayBtn')
  const finalMsg   = $('#finalMsg')
  const particlesContainer = $('#particles')

  /* ─── URL Parameters ─── */
  const params = new URLSearchParams(window.location.search)
  const senderName = params.get('name') || params.get('sender') || 'Tumhara Dost'

  /* ─── Personalize Stage 1 ─── */
  senderLine.innerHTML = `<strong>${senderName}</strong> ne aapko ek 🎁 <strong>Holi Gift</strong> bheja hai!`
  holiTitle.textContent = `${senderName} ki taraf se\nHappy Holi! 🌈`
  finalMsg.innerHTML = `<strong>${senderName}</strong> ki taraf se aapko<br><span style="font-size:1.3em;background:linear-gradient(90deg,var(--pink),var(--yellow),var(--cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:800">Happy Holi! 🌈🎨</span><br><br>Rang barse, pyaar barse! Is Holi par bas khushiyan 🥳`

  /* ─── Floating Particles ─── */
  const COLORS = ['#ff2d95','#00e5ff','#76ff03','#ffe600','#ff6d00','#b000ff','#ff4081','#69f0ae']
  function createParticles () {
    for (let i = 0; i < 30; i++) {
      const el = document.createElement('span')
      el.className = 'particle'
      const size = 6 + Math.random() * 14
      el.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random()*100}%;
        background:${COLORS[Math.floor(Math.random()*COLORS.length)]};
        animation-duration:${8+Math.random()*14}s;
        animation-delay:${Math.random()*10}s;
        filter:blur(${Math.random()*2}px);
      `
      particlesContainer.appendChild(el)
    }
  }
  createParticles()

  /* ─── Shayari Typewriter ─── */
  const shayaris = [
    'Rang laga ke, gale mil ke, dulaar de ke\u2026\nHoli hai bhai, Holi hai! \ud83c\udfa8',
    'Bura na mano, Holi hai!\nPyaar ke rang mein rang jao, Holi hai! \ud83d\udc9c',
    'Gulaal ka rang, pichkari ki dhaar,\nMubaarak ho aapko Holi ka tyohaar! \ud83c\udf08',
    'Holi ke din dil khil jaate hain,\nRangon mein sab rang mil jaate hain! \ud83e\udd73',
    'Meethi Thandai, meethi yaadein,\nHoli ki dhoom, Holi ki baharein! \ud83c\udf89',
  ]
  const shayariText = $('#shayariText')
  const chosenShayari = shayaris[Math.floor(Math.random() * shayaris.length)]
  let charIdx = 0

  function typeShayari () {
    if (charIdx < chosenShayari.length) {
      const ch = chosenShayari[charIdx]
      shayariText.innerHTML += (ch === '\n') ? '<br>' : ch
      charIdx++
      setTimeout(typeShayari, 45 + Math.random() * 35)
    } else {
      shayariText.classList.add('done')
    }
  }
  setTimeout(typeShayari, 800)

  /* ─── Music ─── */
  let musicPlaying = false

  function tryPlayMusic () {
    if (musicPlaying) return
    bgMusic.volume = 0.5
    bgMusic.play().then(() => {
      musicPlaying = true
      musicToggle.textContent = '🔊'
    }).catch(() => {})
  }

  // Attempt autoplay immediately
  tryPlayMusic()

  // Retry every 500ms until it plays (some browsers need a tiny delay)
  const autoplayRetry = setInterval(() => {
    if (musicPlaying) { clearInterval(autoplayRetry); return }
    tryPlayMusic()
  }, 500)
  // Stop retrying after 5s — will rely on first touch
  setTimeout(() => clearInterval(autoplayRetry), 5000)

  musicToggle.addEventListener('click', () => {
    if (musicPlaying) {
      bgMusic.pause()
      musicPlaying = false
      musicToggle.textContent = '🔇'
    } else {
      tryPlayMusic()
    }
  })

  /* Start music on first interaction anywhere (fallback for strict browsers) */
  const startOnInteraction = () => { tryPlayMusic(); clearInterval(autoplayRetry) }
  document.addEventListener('click', startOnInteraction, { once: true })
  document.addEventListener('touchstart', startOnInteraction, { once: true })
  document.addEventListener('scroll', startOnInteraction, { once: true })
  document.addEventListener('keydown', startOnInteraction, { once: true })

  /* ─── Stage Navigation ─── */
  function goTo (from, to) {
    from.classList.remove('active')
    setTimeout(() => to.classList.add('active'), 100)
  }

  /* ─── Confetti Burst (inline canvas-confetti CDN) ─── */
  let confettiLoaded = false
  const confettiScript = document.createElement('script')
  confettiScript.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js'
  confettiScript.onload = () => { confettiLoaded = true }
  document.head.appendChild(confettiScript)

  function fireConfetti () {
    if (!confettiLoaded || typeof confetti !== 'function') return
    const colors = ['#ff2d95','#00e5ff','#76ff03','#ffe600','#ff6d00','#b000ff']
    const burst = (delay) =>
      setTimeout(() =>
        confetti({
          particleCount: 150,
          spread: 140,
          startVelocity: 50,
          gravity: 0.8,
          ticks: 100,
          origin: { x: Math.random(), y: Math.random() * 0.5 },
          colors,
        }), delay)
    burst(0); burst(180); burst(380); burst(600); burst(850)
  }

  /* ─── Gift Click → Stage 2 ─── */
  giftBtn.addEventListener('click', () => {
    if (giftBtn.classList.contains('opened')) return
    giftBtn.classList.add('opened')
    fireConfetti()

    // STOP bg music for reel (reel has its own audio)
    bgMusic.pause()
    musicPlaying = false
    musicToggle.textContent = '🔇'

    setTimeout(() => {
      goTo(stage1, stage2)
      reelVideo.play().catch(() => {})
    }, 900)
  })

  /* ─── Skip / Video End → Stage 3 ─── */
  function goToShare () {
    reelVideo.pause()
    // Resume bg music on share screen
    bgMusic.volume = 0.35
    bgMusic.play().then(() => {
      musicPlaying = true
      musicToggle.textContent = '🔊'
    }).catch(() => {})
    fireConfetti()
    goTo(stage2, stage3)
  }
  skipReel.addEventListener('click', goToShare)
  reelVideo.addEventListener('ended', goToShare)

  /* ─── WhatsApp Share ─── */
  shareBtn.addEventListener('click', () => {
    const myName = recipientInput.value.trim() || 'Tumhara Dost'
    const url = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(myName)}`
    const msg =
      `🎁 *Hey!* Tere liye ek special Holi surprise aaya hai!\n\n` +
      `🌈 *${myName}* ne tujhe Holi ka gift bheja hai... jaldi khol! 🎨🌈\n\n` +
      `👉 Yahan click kar:\n${url}`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  })

  /* ─── Replay ─── */
  replayBtn.addEventListener('click', () => {
    giftBtn.classList.remove('opened')
    reelVideo.currentTime = 0
    bgMusic.volume = 0.5
    charIdx = 0
    shayariText.innerHTML = ''
    shayariText.classList.remove('done')
    goTo(stage3, stage1)
    setTimeout(typeShayari, 800)
  })

  /* ─── Color Splash on Touch ─── */
  const splashLayer = $('#splashLayer')
  if (splashLayer) {
    document.addEventListener('click', (e) => {
      for (let i = 0; i < 3; i++) {
        const sp = document.createElement('div')
        sp.className = 'splash'
        const size = 50 + Math.random() * 120
        const ox = (Math.random() - 0.5) * 40
        const oy = (Math.random() - 0.5) * 40
        sp.style.cssText = `
          width:${size}px;height:${size}px;
          left:${e.clientX - size/2 + ox}px;
          top:${e.clientY - size/2 + oy}px;
          background:radial-gradient(circle,${COLORS[Math.floor(Math.random()*COLORS.length)]}88,transparent 70%);
        `
        splashLayer.appendChild(sp)
        setTimeout(() => sp.remove(), 1000)
      }
    })
  }

  /* ─── Emoji Rain ─── */
  const HOLI_EMOJIS = ['\ud83c\udfa8','\ud83d\udc9c','\ud83d\udfe1','\ud83d\udd34','\ud83d\udfe2','\ud83d\udd35','\ud83d\udfe3','\ud83d\udca7','\ud83c\udf08','\ud83c\udf89','\ud83e\udd73','\ud83d\udc90','\ud83e\udeb7','\u2728']
  const emojiRainEl = $('#emojiRain')
  if (emojiRainEl) {
    function dropEmoji () {
      const em = document.createElement('span')
      em.className = 'rain-emoji'
      em.textContent = HOLI_EMOJIS[Math.floor(Math.random() * HOLI_EMOJIS.length)]
      em.style.left = Math.random() * 100 + '%'
      em.style.animationDuration = (3 + Math.random() * 5) + 's'
      em.style.fontSize = (1 + Math.random() * 0.8) + 'rem'
      emojiRainEl.appendChild(em)
      setTimeout(() => em.remove(), 8500)
    }
    setInterval(dropEmoji, 650)
    dropEmoji()
  }

  /* ─── Button Ripple ─── */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rp = document.createElement('span')
      rp.className = 'ripple'
      const rect = this.getBoundingClientRect()
      const sz = Math.max(rect.width, rect.height)
      rp.style.width = rp.style.height = sz + 'px'
      rp.style.left = (e.clientX - rect.left - sz / 2) + 'px'
      rp.style.top = (e.clientY - rect.top - sz / 2) + 'px'
      this.appendChild(rp)
      setTimeout(() => rp.remove(), 600)
    })
  })

})()
