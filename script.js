/* Montagna: menu do celular, borda do topo ao rolar, animacao de entrada, FAQ e os formularios de cotacao,
   que montam uma mensagem e abrem o WhatsApp. O numero fica aqui, num lugar so. */
(function () {
  'use strict';
  var WHATSAPP = '5511966648300';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* conversao do anuncio: quem for ligar o Google Ads troca esta funcao (ver README). Conta uma vez por navegador. */
  function conversao(tipo) {
    try {
      if (sessionStorage.getItem('mt-conv-' + tipo)) return;
      sessionStorage.setItem('mt-conv-' + tipo, '1');
    } catch (e) {}
    if (typeof window.montagnaConversao === 'function') window.montagnaConversao(tipo);
  }
  function linkWhats(texto) { return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto); }

  /* links do WhatsApp: todos apontam para o numero daqui, com a mensagem do data-mensagem (se houver) */
  $$('a[data-whats]').forEach(function (a) {
    a.href = linkWhats(a.getAttribute('data-mensagem') || 'Olá! Vim pelo site da Montagna e quero uma cotação.');
    a.target = '_blank'; a.rel = 'noopener';
    a.addEventListener('click', function () { conversao(a.getAttribute('data-conversao') || 'whatsapp'); });
  });
  $$('[data-telefone]').forEach(function (el) { el.textContent = '(11) 96664-8300'; });

  /* topo */
  var topo = $('#topo');
  function aoRolar() { if (topo) topo.classList.toggle('rolou', window.scrollY > 10); }
  aoRolar(); window.addEventListener('scroll', aoRolar, { passive: true });

  /* menu do celular */
  var botao = $('#menuBotao'), menu = $('#menu');
  if (botao && menu) {
    botao.addEventListener('click', function () {
      var aberto = menu.classList.toggle('aberto');
      botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('aberto'); botao.setAttribute('aria-expanded', 'false'); }); });
    document.addEventListener('click', function (ev) { if (!menu.contains(ev.target) && !botao.contains(ev.target)) { menu.classList.remove('aberto'); botao.setAttribute('aria-expanded', 'false'); } });
  }

  /* entrada suave */
  var sobem = $$('.sobe');
  if ('IntersectionObserver' in window && sobem.length) {
    var obs = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visivel'); obs.unobserve(e.target); } }); }, { threshold: 0.12 });
    sobem.forEach(function (el) { obs.observe(el); });
  } else sobem.forEach(function (el) { el.classList.add('visivel'); });

  /* botao fixo do WhatsApp: escondido enquanto a abertura esta na tela (ela ja tem formulario ou botoes) */
  var fixo = $('.whats-fixo'), abertura = $('.abertura');
  if (fixo && abertura && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { es.forEach(function (e) { fixo.classList.toggle('escondido', e.isIntersecting && e.intersectionRatio > 0.15); }); }, { threshold: [0, 0.15, 0.5] }).observe(abertura);
  }

  /* FAQ: um aberto por vez */
  $$('.faq details').forEach(function (d) {
    d.addEventListener('toggle', function () { if (d.open) $$('.faq details').forEach(function (o) { if (o !== d) o.open = false; }); });
  });

  /* telefone com mascara leve */
  $$('input[data-mascara="telefone"]').forEach(function (i) {
    i.addEventListener('input', function () {
      var d = i.value.replace(/\D/g, '').slice(0, 11);
      if (d.length > 6) i.value = '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
      else if (d.length > 2) i.value = '(' + d.slice(0, 2) + ') ' + d.slice(2);
      else i.value = d;
    });
  });

  /* formularios de cotacao */
  $$('form[data-cotacao]').forEach(function (form) {
    var tipo = form.getAttribute('data-cotacao');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var ok = true;
      $$('[required]', form).forEach(function (c) {
        var vazio = c.type === 'radio' ? !$$('input[name="' + c.name + '"]:checked', form).length : !c.value.trim();
        c.classList.toggle('erro', vazio);
        if (vazio) ok = false;
      });
      if (!ok) { var primeiro = $('.erro', form); if (primeiro && primeiro.focus) primeiro.focus(); return; }
      var dados = {};
      $$('input, select, textarea', form).forEach(function (c) {
        if (!c.name) return;
        if (c.type === 'radio') { if (c.checked) dados[c.name] = c.value; return; }
        dados[c.name] = c.value.trim();
      });
      var linhas = ['Olá! Vim pelo site da Montagna e quero uma cotação de ' + (tipo === 'saude' ? 'plano de saúde' : 'seguro') + '.', ''];
      $$('input, select, textarea', form).forEach(function (c) {
        if (!c.name || c.type === 'radio' && !c.checked) return;
        var rotulo = c.getAttribute('data-rotulo') || c.name;
        if (dados[c.name]) linhas.push(rotulo + ': ' + dados[c.name]);
      });
      conversao(tipo);
      window.open(linkWhats(linhas.join('\n')), '_blank', 'noopener');
      var aviso = $('.form-ok', form);
      if (aviso) aviso.classList.add('ver');
    });
  });
})();
