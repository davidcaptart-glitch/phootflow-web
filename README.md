# phootflow-web

Landing de **PhootFlow Desktop**, publicada en <https://phootflow.com> con GitHub Pages.

El botón de descarga apunta siempre a la última versión publicada en
[phootflow-releases](https://github.com/davidcaptart-glitch/phootflow-releases/releases/latest),
así que no hay que tocar la web en cada release.

## Desarrollo

```
npm ci --legacy-peer-deps --registry=https://registry.npmjs.org/ --replace-registry-host=always
npm run dev
```

## Publicación

Cada push a `main` compila la web y la publica en GitHub Pages
(`.github/workflows/pages.yml`). El dominio está en `public/CNAME`.

Requisito (una vez): **Settings → Pages → Source: «GitHub Actions»** y
*Custom domain* `phootflow.com`.

DNS:

- `phootflow.com`: registros A a `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- `www`: CNAME a `davidcaptart-glitch.github.io`
