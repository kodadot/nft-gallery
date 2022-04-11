export default function (req, res, next) {
  const redirects = [
    {
      from: '*/collections',
      to: '/*/explore',
    },
    {
      from: '*/gallery',
      to: '/*/explore?tab=GALLERY',
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
