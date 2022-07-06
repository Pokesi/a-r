import { fallbackImage } from '@app/hooks/useRaveName'
import { useQuery } from 'react-query'
import { Rave, RaveName } from '@rave-names/rave'

const rave = new Rave()

const getName = (add: string): string => {
  const query = async () => {
    const data: RaveName = await rave.reverse(add)
    return data.avatar
  }
  let a: string = fallbackImage
  query().then((res) => {
    a = res
    console.log(name, "|", res, ";;", a)
  })
  return a
}

export const useName = (
  address: string | undefined,
) => {
  const { data, isLoading, status } = useQuery(
    ['getName', name],
    () => fetchImg(getName(name!)),
    {
      enabled: !!name,
    },
  )

  return { avatar: data, isLoading, status }
}
