export default function (req, res, next) {
  const redirects = [
    {
      from: '/rmrk/collections',
      to: '/rmrk/explore',
    },
    {
      from: '/rmrk/gallery',
      to: '/rmrk/explore?tab=GALLERY',
    },
    {
      from: '/statemine/collections',
      to: '/statemine/explore',
    },
    {
      from: '/statemine/gallery',
      to: '/statemine/explore?tab=GALLERY',
    },
    {
      from: '/westmint/collections',
      to: '/westmint/explore',
    },
    {
      from: '/westmint/gallery',
      to: '/westmint/explore?tab=GALLERY',
    },
  ]
  const redirect = redirects.find((r) => r.from === req.url)
  if (redirect) {
    res.writeHead(301, { Location: redirect.to })
    res.end()
  } else {
    next()
  }
}
