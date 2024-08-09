import Html from '@kitajs/html'

interface Props {
  children?: Html.Children
  title?: string
  description?: string
  includeDisableElementExtension?: boolean
}
export const BaseHtml = (props: Props) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="shortcut icon" href="/logo.ico" type="image/x-icon">
  <meta http-equiv="Permissions-Policy" content="interest-cohort=()">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${
  props.description ||
  'Become part of large community and ignite your sells from your home.'
}">
  <title>${props.title || 'Preebee | Makeup and skin care marketplace'}</title>
  <script src="/scripts/htmx.js" defer></script>
  ${
    props.includeDisableElementExtension
      ? (
        `<script defer src="https://unpkg.com/htmx.org/dist/ext/disable-element.js"></script>`
      )
      : ''
  }
  <script src="/scripts/alpine-persist.js" defer></script>
  <script src="/scripts/alpine.js" defer></script>
  <script src="/scripts/svg-inject.js" ></script>
  <script src="/scripts/mask.js" ></script>
  <link href="/styles/global.css" rel="stylesheet">
  <link href="/styles/general-sans.css" rel="stylesheet" defer>
  <link href="/styles/boska.css" rel="stylesheet" defer>
  ${
  process.env.NODE_ENV === 'production'
    ? ''
    : '<script src="http://localhost:35729/livereload.js"></script>'
}
</head>

${props.children}
`
