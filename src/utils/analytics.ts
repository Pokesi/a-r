import ReactGA from 'react-ga'

const TrackingID = {
  live: 'UA-138903307-1',
  dev: 'UA-138903307-2',
}

function isProduction() {
  return window.location.host === 'app.ens.domains'
}

function isDev() {
  return window.location.host === 'ensappdev.surge.sh'
}

export function setUtm() {
  const urlParams = new URLSearchParams(window.location.search)
  const utmSource = urlParams.get('utm_source')
  if (utmSource) {
    window.sessionStorage.setItem('utmSource', utmSource)
  }
}

export function getUtm() {
  return window.sessionStorage.getItem('utmSource')
}

export const setupAnalytics = () => {
  if (isProduction()) {
    ReactGA.initialize(TrackingID.live)
    ReactGA.plugin.require('ecommerce')
  } else {
    ReactGA.initialize(TrackingID.dev)
    ReactGA.plugin.require('ecommerce', { debug: true })
    console.log('Analytics setup for dev with ', TrackingID.dev)
  }

  setUtm()
}

export const pageview = () => {
  const page = window.location.pathname + window.location.search
  if (isProduction() || isDev()) {
    ReactGA.pageview(page)
  }
}

export const trackReferral = async ({
  labels, // labels array
  transactionId, // hash
  type, // renew/register
  price, // in wei,
  premium = 0,
  years,
}: {
  labels: any[]
  transactionId: any
  type: any
  price: any
  premium: number
  years: number
}) => {
  const mainnet = false
  const referrer = getUtm()
  const unitPrice = (price - premium) / years / labels.length

  function track() {
    ReactGA.event(
      {
        category: 'referral',
        action: `${type} domain`,
        dimension1: transactionId,
        dimension2: type,
        dimension3: referrer || '',
      },
      labels,
    )
    ReactGA.plugin.execute('ecommerce', 'addTransaction', {
      id: transactionId, // Transaction ID. Required.
      affiliation: referrer, // Affiliation or store name.
      revenue: price, // Grand Total.
    })

    labels.forEach((label) => {
      ReactGA.plugin.execute('ecommerce', 'addItem', {
        id: transactionId,
        name: label,
        sku: label,
        category: type,
        price: unitPrice,
        quantity: years,
      })
      if (premium > 0) {
        ReactGA.plugin.execute('ecommerce', 'addItem', {
          id: transactionId,
          name: label,
          sku: label,
          category: type,
          price: premium,
          quantity: 1,
        })
      }
    })
    ReactGA.plugin.execute('ecommerce', 'send', undefined)
    ReactGA.plugin.execute('ecommerce', 'clear', undefined)
  }

  if (isProduction() && mainnet) {
    console.log('calling tracking from live')
    track()
    console.log('Completed tracking from live')
  } else if (isDev()) {
    console.log('calling tracking from dev')
    track()
    console.log('Completed tracking from dev')
  } else {
    console.log(
      'Referral triggered on local development',
      JSON.stringify({
        labels,
        transactionId,
        type,
        price,
        unitPrice,
        premium,
        years,
        referrer,
      }),
    )
  }
}
