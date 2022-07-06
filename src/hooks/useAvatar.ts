import { useEns } from '@app/utils/EnsProvider'
import { ensNftImageUrl, imageUrlUnknownRecord } from '@app/utils/utils'
import { fallbackImage } from '@app/hooks/useRaveName'
import { useQuery } from 'react-query'
import { Rave, RaveName } from '@rave-names/rave'

const rave = new Rave()

const fetchImg = async (url: string) => {
  const response = await fetch(url)
  const imgBlob = response && (await response.blob())
  const src = URL.createObjectURL(imgBlob)
  if (imgBlob?.type.startsWith('image/')) {
    return src
  }
  return undefined
}

const getAvatarSRC = (name: string): string => {
  const query = async () => {
    const owner = await rave.resolveStringToAddress(name)
    const data: RaveName = await rave.reverse(owner)
    return data.avatar
  }
  // let a: string = ''
  // query().then((res) => {
  //   a = res
  //   console.log(name, "|", res, ";;", a)
  // })
  const a = query();
  // console.log(a)
  return a
}

export const useAvatar = (
  name: string | undefined,
  network: number | undefined,
) => {
  const { data, isLoading, status } = useQuery(
    ['getAvatar', name],
    () => getAvatarSRC(name!),
    // () => getAvatarSRC(name!),
    {
      enabled: !!name,
    },
  )

  return { avatar: data, isLoading, status }
}

export const useNFTImage = (name: string | undefined, network: number) => {
  const isCompatible = !!(
    name &&
    name.split('.').length === 2 &&
    name.endsWith('.eth')
  )
  const { ready, contracts } = useEns()
  const { data: baseRegistrarAddress } = useQuery(
    'base-registrar-address',
    () => contracts?.getBaseRegistrar()!.then((c) => c.address),
    {
      enabled: ready && !!name,
      staleTime: 60000,
    },
  )
  const { data, isLoading, status } = useQuery(
    ['getNFTImage', name],
    () => fetchImg(ensNftImageUrl(name!, network, baseRegistrarAddress!)),
    {
      enabled: ready && !!name && !!baseRegistrarAddress && isCompatible,
    },
  )

  return { image: data, isLoading, status, isCompatible }
}
