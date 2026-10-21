# Montagna

Site de vendas de planos de saude e seguros, feito para campanhas: cada produto tem a sua propria pagina de
destino, com formulario que abre o WhatsApp ja preenchido.

## Paginas

| Arquivo | Para que serve |
|---|---|
| `index.html` | Home: apresenta a Montagna e leva para os dois caminhos |
| `planos-de-saude.html` | Pagina de campanha de planos de saude (formulario de cotacao) |
| `seguros.html` | Pagina de campanha de seguros (formulario de cotacao) |
| `privacidade.html` | Politica de privacidade (o Google Ads pede uma nas paginas de destino) |

Site estatico, sem build: `estilo.css` (folha unica), `script.js`, `img/` (logo em SVG e PNG, imagem de
compartilhamento `og.png`), `favicon.svg`. Fontes Plus Jakarta Sans (titulos) e Inter (texto), do Google Fonts.

## WhatsApp

O numero fica em um lugar so, no comeco de `script.js` (`WHATSAPP = '5511966648300'`). Todo link com `data-whats`
recebe esse numero e a mensagem do atributo `data-mensagem`; o texto `(11) 96664-8300` aparece onde houver
`data-telefone`. Os formularios montam a mensagem com os campos preenchidos (rotulo de cada campo em `data-rotulo`)
e abrem o `wa.me` numa aba nova.

## Conversao do Google Ads

`script.js` chama `window.montagnaConversao(tipo)` quando a pessoa envia um formulario ou clica num botao de
WhatsApp (`tipo` = `saude`, `seguros` ou `whatsapp`), uma vez por navegador. Para contar a conversao no Google Ads,
cole a tag do Google (gtag) no `<head>` das paginas e defina, antes do `script.js`:

```html
<script>
  window.montagnaConversao = function (tipo) {
    gtag('event', 'conversion', { send_to: 'AW-XXXXXXXXX/YYYYYYYYYYY' });
  };
</script>
```

## Logo

Desenho em `img/logo-marca.svg` (duas montanhas formando um M e um sol): a maior em navy, a menor em degrade de
azul para verde-agua. Versoes prontas em PNG: `img/logo.png` (horizontal, fundo transparente, para fundo claro),
`img/logo-branco.png` (para fundo escuro), `img/logo-quadrado.png` (avatar de redes sociais) e `img/og.png`
(compartilhamento). Nas paginas o logo e desenhado inline (marca em SVG + nome em texto), entao escala sem perder
qualidade.

## Publicar

Repositorio estatico: basta importar na Vercel (Production Branch = a branch de producao) sem comando de build.

## Pendencias de conteudo

- Numero de registro na SUSEP (obrigatorio para corretoras) no rodape, quando houver.
- Nomes das operadoras e seguradoras parceiras nas faixas das paginas de campanha, se quiser cita-las.
- Horario de atendimento no rodape (hoje: segunda a sexta, 9h as 18h).
