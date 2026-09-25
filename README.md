# Site Ananda Oliveira

Site estático da Ananda Oliveira. A versão publicada está em `dist/`.

## Cloudflare Workers Builds

Este repositório está conectado ao Worker `site-ananda-oliveira`. O arquivo `wrangler.toml` aponta os recursos estáticos para `./dist`, e um push na branch `main` dispara o build automático.

Configuração esperada no Cloudflare:

- Branch de produção: `main`.
- Diretório raiz: `/`.
- Comando de build: vazio; o site já está pronto em `dist/`.
- Comando de deploy: `npx wrangler deploy`.

`dist/index.html` referencia `site.css`, `site.js`, `ambient-background.js` e os recursos em `dist/assets/`. Não há dependências de build para o site estático.
