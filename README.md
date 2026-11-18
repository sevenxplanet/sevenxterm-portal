# SevenXterm Portal

Public product website and binary distribution for SevenXterm. This project is called **Portal**.

- Website: https://sevenxplanet.github.io/sevenxterm-portal/
- Downloads: https://github.com/sevenxplanet/sevenxterm-portal/releases
- Application source remains in a separate private repository.

## Deployment

Enable Settings → Pages → Source: GitHub Actions. Pushes to `main`, manual workflow runs, and `release-published` repository dispatches deploy the website. The workflow builds `downloads.json` from the latest listed stable public release. Without a public release the site displays unavailable downloads.

## Installer synchronization

In the private SevenXterm repository, configure `PORTAL_RELEASE_TOKEN` as an Actions secret: a fine-grained token limited to this Portal repository with Contents read/write. The private Release workflow calls `Publish public installers` only after all platform builds succeed. Existing releases can be copied with its manual `tag` input.

Only five explicitly named installers and SHA256SUMS.txt are uploaded. Private source, commit history and private release notes are not copied. Tokens never appear in the website.

## Local preview

Run `python -m http.server 8000` in this directory. Website assets are maintained here; product screenshots are in `product-screenshots/`.
