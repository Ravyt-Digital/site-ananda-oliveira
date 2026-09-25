# Site Ananda Oliveira

Site estático da Ananda Oliveira. Os arquivos prontos para publicação estão em `dist/`.

## Cloudflare Pages

Conecte este repositório à Cloudflare Pages com as seguintes configurações:

- Branch de produção: `main`
- Framework preset: `None`
- Comando de build: deixe vazio
- Diretório de saída: `dist`
- Diretório raiz: `/` (padrão)

Cada novo commit na branch `main` iniciará um deploy automático **depois que a integração GitHub ↔ Cloudflare Pages estiver conectada**.

Não é preciso instalar dependências. `dist/index.html` é a página inicial e referencia `dist/site.css`, `dist/site.js`, `dist/ambient-background.js` e os arquivos em `dist/assets/`.
