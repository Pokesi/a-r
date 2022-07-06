import dynamic from 'next/dynamic'

export const addressIconTypes = {
  btc: dynamic(() => import('./AddressBitcoin.svg')),
  bnb: dynamic(() => import('./AddressBNB.svg')),
  eth: dynamic(() => import('./AddressEthereum.svg')),
  doge: dynamic(() => import('./AddressDoge.svg')),
  ltc: dynamic(() => import('./AddressLitecoin.svg')),
  dot: dynamic(() => import('./AddressPolkadot.svg')),
  sol: dynamic(() => import('./AddressSolana.svg')),
  ftm: dynamic(() => import('./AddressFantom.svg')),
  xrp: dynamic(() => import('./AddressXRP.svg')),
  bch: dynamic(() => import('./AddressBCH.svg')),
  avax: dynamic(() => import('./AddressAvalance.svg')),
  luna: dynamic(() => import('./AddressLuna.svg')),
}

export const DynamicAddressIcon = ({
  name,
  ...props
}: JSX.IntrinsicAttributes & {
  name: keyof typeof addressIconTypes
}) => {
  const Icon = addressIconTypes[name]
  return <Icon {...props} />
}
