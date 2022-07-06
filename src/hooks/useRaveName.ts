import { Rave, RaveName } from '@rave-names/rave'
import { useQuery } from 'react-query'

const rave = new Rave()

export const useRaveName = async (
  input: any = '',
  type: 'address' | 'name',
) => {
  let data: any
  if (type === 'address') {
    await rave.resolveStringToAddress(input).then(async (res) => {
      await rave.reverse(res).then((r) => {
        data = r
      })
    })
  } else {
    await rave.reverse(input).then((res) => {
      data = res
    })
  }
  return data
}

const getName = (address) => {
  const query = async () => {
    const data: RaveName = await useRaveName(address, 'name')
    return data.name
  }

  const a = query()

  return a
}

// only address => name
export const useNameWithQuery = (
  input: string,
) : string => {
  const { data, isLoading, status } = useQuery(
    ['getName', name],
    () => getName(input!),
    {
      enabled: !!input,
    },
  )

  return data
}

export const fallbackAvatar = 'https://cyber.fantoms.art/Opr.png'
export const fallbackImage = fallbackAvatar
