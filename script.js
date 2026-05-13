/**
 * DashAdvance — main.js
 * Comportamientos interactivos de la web.
 *
 * 1. Header sticky con efecto blur al hacer scroll
 * 2. Botón flotante de WhatsApp que aparece tras 600px
 * 3. Acordeón de FAQ
 * 4. Reveal animations al hacer scroll (IntersectionObserver)
 * 5. Smooth scroll para anchor links
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------
  // 1. Header scroll effect + WhatsApp float visibility
  // --------------------------------------------------------------------
  const header = document.getElementById('header');

  function handleScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --------------------------------------------------------------------
  // 2. Robot chatbot FAQ
  // --------------------------------------------------------------------
  var ANSWERS = {
    precio:      'Depende del servicio. Como estamos en programa fundacional, nuestros precios están entre un 30 y un 50% por debajo del mercado. La auditoría gratuita incluye una propuesta con cifras concretas adaptadas a tu rent a car.',
    resultados:  'Web nueva: 4-6 semanas hasta tenerla en marcha. Reputación y reseñas: cambios visibles en 60-90 días. Email marketing: las primeras reservas recuperadas suelen llegar en el primer mes.',
    flota:       'Trabajamos con flotas a partir de 15 coches. Por debajo de eso, nuestros servicios no son rentables para el cliente.',
    islas:       'Solo Gran Canaria. Es deliberado. Queremos ser los mejores en una isla antes de plantearnos las demás.',
    tamano:      'No. Somos dos socios en Las Palmas. Para cada proyecto montamos un equipo con colaboradores especialistas. Si buscas una agencia con 20 personas y oficina en Madrid, no somos nosotros.',
    ads:         'Porque preferimos certificarnos oficialmente antes de gestionar el dinero publicitario de un cliente. Estamos en ello. Cuando los activemos, los clientes existentes serán los primeros en saberlo.'
  };

  var botFloatBtn  = document.getElementById('botFloatBtn');
  var botPopup     = document.getElementById('botPopup');
  var botCloseBtn  = document.getElementById('botPopupClose');
  var botBody      = document.getElementById('botPopupBody');
  var botQuestions = document.getElementById('botQuestions');

  if (botFloatBtn && botPopup) {
    botFloatBtn.addEventListener('click', function () {
      var isOpen = botPopup.classList.toggle('open');
      botFloatBtn.classList.toggle('active', isOpen);
    });

    botCloseBtn.addEventListener('click', function () {
      botPopup.classList.remove('open');
      botFloatBtn.classList.remove('active');
    });

    document.querySelectorAll('.bot-q-btn').forEach(function (qBtn) {
      qBtn.addEventListener('click', function () {
        var key = qBtn.getAttribute('data-q');
        var answer = ANSWERS[key];
        var questionText = qBtn.textContent;

        // Hide question list
        botQuestions.style.display = 'none';

        // User bubble
        var userBubble = document.createElement('div');
        userBubble.className = 'bot-bubble user-says';
        userBubble.textContent = questionText;
        botBody.appendChild(userBubble);
        botBody.scrollTop = botBody.scrollHeight;

        // Typing indicator
        var typing = document.createElement('div');
        typing.className = 'bot-bubble bot-says';
        typing.innerHTML = '<span style="opacity:.55;font-size:18px;letter-spacing:3px">···</span>';
        botBody.appendChild(typing);
        botBody.scrollTop = botBody.scrollHeight;

        setTimeout(function () {
          // Replace typing with answer
          typing.innerHTML = answer;

          // Back button
          var backBtn = document.createElement('button');
          backBtn.className = 'bot-q-btn';
          backBtn.style.marginTop = '6px';
          backBtn.textContent = '← Ver más preguntas';
          botBody.appendChild(backBtn);
          botBody.scrollTop = botBody.scrollHeight;

          backBtn.addEventListener('click', function () {
            botBody.removeChild(userBubble);
            botBody.removeChild(typing);
            botBody.removeChild(backBtn);
            botQuestions.style.display = 'flex';
          });
        }, 700);
      });
    });
  }

  // --------------------------------------------------------------------
  // 3. Reveal on scroll
  // --------------------------------------------------------------------
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback para navegadores antiguos: revelar todo de inmediato
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // --------------------------------------------------------------------
  // 4. Smooth scroll para anchor links
  // --------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --------------------------------------------------------------------
  // 5. Speed lines animation (Three.js)
  //    Carretera infinita con líneas que aceleran/desaceleran según
  //    la posición del mouse en horizontal. Vertical controla la
  //    inclinación de la cámara (parallax cinematográfico).
  // --------------------------------------------------------------------
  function initSpeedAnimation() {
    if (typeof THREE === 'undefined') return;

    const canvas = document.getElementById('speedCanvas');
    if (!canvas) return;

    const hero = canvas.parentElement;

    // --- Setup escena ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0A0A0B, 30, 110);

    const camera = new THREE.PerspectiveCamera(
      55,
      hero.clientWidth / hero.clientHeight,
      0.1,
      200
    );
    // Cámara descentrada a la izquierda — la carretera fluye por la mitad
    // inferior, evitando el dashboard de la derecha del hero
    camera.position.set(-2, 5, 9);
    camera.lookAt(-2, 1.2, -30);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(hero.clientWidth, hero.clientHeight, false);

    // --- Parámetros del mundo ---
    const ROAD_LENGTH = 200;          // largo total de carretera
    const LINE_COUNT = 28;            // cuántas líneas centrales
    const LINE_SPACING = ROAD_LENGTH / LINE_COUNT;
    const LANE_LIGHTS = 14;           // luces laterales

    // --- Líneas blancas centrales (las del medio de la carretera) ---
    const lineGeo = new THREE.PlaneGeometry(0.18, 4);
    const lineMat = new THREE.MeshBasicMaterial({
      color: 0xF5F2ED,
      transparent: true,
      opacity: 0.85
    });
    const centerLines = [];
    for (let i = 0; i < LINE_COUNT; i++) {
      const m = new THREE.Mesh(lineGeo, lineMat);
      m.rotation.x = -Math.PI / 2;
      m.position.set(0, 0.01, -i * LINE_SPACING);
      scene.add(m);
      centerLines.push(m);
    }

    // --- Luces laterales (puntos amarillos como balizas de carretera) ---
    const lightGeoR = new THREE.SphereGeometry(0.18, 8, 8);
    const lightMatR = new THREE.MeshBasicMaterial({
      color: 0xF4B400,
      transparent: true,
      opacity: 0.9
    });
    const lightMatL = new THREE.MeshBasicMaterial({
      color: 0xF5F2ED,
      transparent: true,
      opacity: 0.55
    });
    const sideLights = [];
    for (let i = 0; i < LANE_LIGHTS; i++) {
      const right = new THREE.Mesh(lightGeoR, lightMatR);
      right.position.set(7, 0.6, -i * (ROAD_LENGTH / LANE_LIGHTS));
      scene.add(right);
      sideLights.push(right);

      const left = new THREE.Mesh(lightGeoR, lightMatL);
      left.position.set(-7, 0.6, -i * (ROAD_LENGTH / LANE_LIGHTS));
      scene.add(left);
      sideLights.push(left);
    }

    // --- Carretera (plano oscuro con sutil reflejo) ---
    const roadGeo = new THREE.PlaneGeometry(14, ROAD_LENGTH);
    const roadMat = new THREE.MeshBasicMaterial({
      color: 0x14141A,
      transparent: true,
      opacity: 0.85
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, -ROAD_LENGTH / 2);
    scene.add(road);

    // --- Bordes laterales (subtle warm glow de los lados) ---
    const edgeGeo = new THREE.PlaneGeometry(0.05, ROAD_LENGTH);
    const edgeMat = new THREE.MeshBasicMaterial({
      color: 0xF4B400,
      transparent: true,
      opacity: 0.35
    });
    const edgeR = new THREE.Mesh(edgeGeo, edgeMat);
    edgeR.rotation.x = -Math.PI / 2;
    edgeR.position.set(7, 0.02, -ROAD_LENGTH / 2);
    scene.add(edgeR);

    const edgeL = new THREE.Mesh(edgeGeo, edgeMat.clone());
    edgeL.material.opacity = 0.18;
    edgeL.rotation.x = -Math.PI / 2;
    edgeL.position.set(-7, 0.02, -ROAD_LENGTH / 2);
    scene.add(edgeL);

    // --- Estado del mouse: 0 = lento, 1 = rápido ---
    // Velocidad base en el centro, escala con X del mouse.
    let targetSpeed = 0.5;        // 0.5 = velocidad media
    let currentSpeed = 0.5;
    let targetTilt = 0;
    let currentTilt = 0;
    let isVisible = true;

    function onMouseMove(e) {
      const rect = hero.getBoundingClientRect();
      // Solo reaccionar si el mouse está sobre el hero
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;

      const xNorm = (e.clientX - rect.left) / rect.width;   // 0..1
      const yNorm = (e.clientY - rect.top) / rect.height;   // 0..1

      // Curva más natural: izquierda muy lento, derecha muy rápido
      // Min 0.15 (lento), max 1.4 (rápido pero no mareante)
      targetSpeed = 0.15 + Math.pow(xNorm, 1.4) * 1.25;

      // Tilt sutil con Y (cabeceo de la cámara, en radianes)
      // Centro = sin tilt; arriba/abajo = ligero pitch
      targetTilt = (yNorm - 0.5) * 0.08;
    }

    function onMouseLeave() {
      // Volver a velocidad media de crucero
      targetSpeed = 0.5;
      targetTilt = 0;
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    hero.addEventListener('mouseleave', onMouseLeave);

    // En móvil/touch: animación con velocidad cíclica suave
    const isTouch = 'ontouchstart' in window;
    let touchPhase = 0;

    // --- Pause cuando el hero ya no está visible (ahorra batería) ---
    if ('IntersectionObserver' in window) {
      const visObs = new IntersectionObserver(function (entries) {
        isVisible = entries[0].isIntersecting;
      }, { threshold: 0 });
      visObs.observe(hero);
    }

    // --- Resize ---
    function onResize() {
      const w = hero.clientWidth;
      const h = hero.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
    window.addEventListener('resize', onResize, { passive: true });

    // --- Loop de animación ---
    let lastTime = performance.now();

    function animate(now) {
      requestAnimationFrame(animate);

      const dt = Math.min((now - lastTime) / 1000, 0.05); // cap a 50ms para evitar saltos
      lastTime = now;

      if (!isVisible) return;

      // Modo táctil: oscilar suavemente
      if (isTouch) {
        touchPhase += dt * 0.4;
        targetSpeed = 0.45 + Math.sin(touchPhase) * 0.25;
      }

      // Smoothing exponencial — lerp hacia el target
      currentSpeed += (targetSpeed - currentSpeed) * Math.min(dt * 4, 1);
      currentTilt += (targetTilt - currentTilt) * Math.min(dt * 3, 1);

      // Velocidad real en unidades del mundo
      const speedUnits = currentSpeed * 80 * dt; // pixeles-mundo por frame

      // Mover líneas centrales hacia la cámara
      for (let i = 0; i < centerLines.length; i++) {
        centerLines[i].position.z += speedUnits;
        if (centerLines[i].position.z > 10) {
          centerLines[i].position.z -= ROAD_LENGTH;
        }
      }

      // Mover luces laterales (más rápido para reforzar parallax)
      for (let i = 0; i < sideLights.length; i++) {
        sideLights[i].position.z += speedUnits * 1.05;
        if (sideLights[i].position.z > 10) {
          sideLights[i].position.z -= ROAD_LENGTH;
        }
      }

      // Cámara con tilt suave
      camera.rotation.x = -0.05 + currentTilt;

      // Opacidad de las líneas escala con velocidad — más rápido = más motion glow
      const intensity = 0.7 + Math.min(currentSpeed, 1) * 0.3;
      lineMat.opacity = intensity;

      renderer.render(scene, camera);
    }

    requestAnimationFrame(animate);
  }

  // Inicializar cuando Three.js esté disponible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSpeedAnimation);
  } else {
    initSpeedAnimation();
  }

  // -------- WHATSAPP DEMO CHAT --------
  function initWADemo() {
    const chatBody = document.getElementById('waChatBody');
    if (!chatBody) return;

    const messages = [
      { type: 'client', text: 'Hola, necesito un coche del 12 al 15 de julio.', delay: 0.3 },
      { type: 'bot', text: 'Perfecto 👌 ¿Qué tipo de vehículo buscas?', delay: 1.8 },
      { type: 'client', text: 'Un SUV automático.', delay: 3.3 },
      { type: 'bot', text: 'Tenemos disponible un BMW X1 o un Range Rover Evoque. ¿Cuál prefieres?', delay: 5.1 },
      { type: 'client', text: 'El BMW.', delay: 6.6 },
      { type: 'bot', text: 'Perfecto. El precio total son 290€. ¿Quieres confirmar la reserva?', delay: 8.4 },
      { type: 'client', text: 'Sí.', delay: 9.9 },
      { type: 'bot', text: 'Reserva confirmada ✅ Te envío ahora el enlace de pago.', delay: 11.7 }
    ];

    let currentIndex = 0;

    function addMessage(msg, delay) {
      setTimeout(function() {
        const msgEl = document.createElement('div');
        msgEl.className = 'wa-msg ' + msg.type;

        let text = msg.text;
        msgEl.innerHTML = text + '<span class="wa-msg-time"></span>';

        chatBody.appendChild(msgEl);
        chatBody.scrollTop = chatBody.scrollHeight;
      }, delay * 1000);
    }

    function addTyping(type, delay) {
      setTimeout(function() {
        const typingEl = document.createElement('div');
        typingEl.className = 'wa-typing ' + type;
        typingEl.innerHTML = '<span></span><span></span><span></span>';
        chatBody.appendChild(typingEl);
        chatBody.scrollTop = chatBody.scrollHeight;

        return typingEl;
      }, delay * 1000);
    }

    messages.forEach(function(msg, idx) {
      if (msg.type === 'bot') {
        const typingDelay = msg.delay - 0.6;
        addTyping('bot', typingDelay);
      }
      addMessage(msg, msg.delay);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWADemo);
  } else {
    initWADemo();
  }

  // -------- CALCULADORA DE PÉRDIDAS --------
  function initCalculator() {
    const inputClients = document.getElementById('calcClients');
    const inputTicket = document.getElementById('calcTicket');
    const inputResponse = document.getElementById('calcResponse');
    const inputLost = document.getElementById('calcLost');

    if (!inputClients) return;

    function updateCalc() {
      const clients = parseInt(inputClients.value);
      const ticket = parseInt(inputTicket.value);
      const response = parseInt(inputResponse.value);
      const lost = parseInt(inputLost.value) / 100;

      // Actualizar outputs
      document.getElementById('calcClientsOut').textContent = clients;
      document.getElementById('calcTicketOut').textContent = ticket + '€';

      // Mostrar respuesta en formato legible
      if (response < 60) {
        document.getElementById('calcResponseOut').textContent = response + ' min';
      } else {
        document.getElementById('calcResponseOut').textContent = Math.round(response / 60) + ' h';
      }
      document.getElementById('calcLostOut').textContent = lost * 100 + ' %';

      // Calcular pérdidas
      const lostBookingsMonth = Math.round(clients * lost);
      const lostRevenueMonth = Math.round(lostBookingsMonth * ticket);
      const lostRevenueYear = lostRevenueMonth * 12;

      // Actualizar resultados con animación de números
      animateValue('calcResultMonth', parseInt(document.getElementById('calcResultMonth').textContent.replace('.', '')), lostRevenueMonth, 300);
      animateValue('calcResultYear', parseInt(document.getElementById('calcResultYear').textContent.replace('.', '').replace('€', '')), lostRevenueYear, 300);
      document.getElementById('calcResultBookings').textContent = lostBookingsMonth;

      // Actualizar barras
      const maxMonth = 50000;
      const maxYear = 600000;
      const monthPercent = Math.min((lostRevenueMonth / maxMonth) * 100, 100);
      const yearPercent = Math.min((lostRevenueYear / maxYear) * 100, 100);

      document.getElementById('calcBarMonth').style.width = monthPercent + '%';
      document.getElementById('calcBarYear').style.width = yearPercent + '%';

      // Formato con puntos
      const formatted = lostRevenueMonth.toLocaleString('es-ES');
      document.getElementById('calcResultMonth').textContent = formatted;
      const formattedYear = lostRevenueYear.toLocaleString('es-ES');
      document.getElementById('calcResultYear').textContent = formattedYear + '€';
    }

    function animateValue(id, start, end, duration) {
      const obj = document.getElementById(id);
      const range = end - start;
      const increment = range / (duration / 16);
      let current = start;

      const timer = setInterval(function() {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
          current = end;
          clearInterval(timer);
        }
        obj.textContent = Math.round(current).toLocaleString('es-ES');
      }, 16);
    }

    inputClients.addEventListener('input', updateCalc);
    inputTicket.addEventListener('input', updateCalc);
    inputResponse.addEventListener('input', updateCalc);
    inputLost.addEventListener('input', updateCalc);

    updateCalc(); // Valores iniciales
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalculator);
  } else {
    initCalculator();
  }

  // -------- WINS COUNTER ANIMATION --------
  function initWinsCounter() {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const numbers = entry.target.querySelectorAll('.win-num');
          numbers.forEach(function(num) {
            const target = parseInt(num.getAttribute('data-target'));
            animateCounter(num, target);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.wins-grid').forEach(function(el) {
      observer.observe(el);
    });

    function animateCounter(el, target) {
      let current = 0;
      const increment = target / 30;
      const timer = setInterval(function() {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.round(current);
      }, 30);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWinsCounter);
  } else {
    initWinsCounter();
  }

  // -------- CURSOR GLOW --------
  (function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow || window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = -999, mouseY = -999;
    let glowX = -999, glowY = -999;
    let raf;

    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function loop() {
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;
      glow.style.transform = 'translate(' + (glowX - 240) + 'px,' + (glowY - 240) + 'px)';
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
  })();

  // -------- MAGNETIC BUTTONS --------
  (function initMagnetic() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.querySelectorAll('[data-magnetic]').forEach(function(btn) {
      btn.addEventListener('mousemove', function(e) {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.35;
        const dy = (e.clientY - cy) * 0.35;
        btn.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      });
      btn.addEventListener('mouseleave', function() {
        btn.style.transform = '';
      });
    });
  })();

  // -------- CARD TILT --------
  (function initCardTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.querySelectorAll('.glass-card,.tech-card,.ai-card,.loss-card,.win-card').forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(800px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateZ(4px)';
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = '';
      });
    });
  })();

})();
