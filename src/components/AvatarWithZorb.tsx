import { fallbackAvatar } from '@app/hooks/useRaveName'
import { useAvatar } from '@app/hooks/useAvatar'
import { Avatar } from '@ensdomains/thorin'
import { ComponentProps } from 'react'
import type { RaveName } from '@rave-names/rave'

export const AvatarWithZorb = ({
  src,
  name,
  address,
  network,
  raveName,
  ...props
}: ComponentProps<typeof Avatar> & {
  src?: string
  name?: string
  address: string
  network: number
  raveName: RaveName
}) => {
  const {avatar} = useAvatar(raveName.name)

  console.log(avatar)

  return (
    <Avatar
      {...props}
      src={avatar}
    />
  )
}

export const AddressAvatar = ({
  src,
  address,
  raveName,
  ...props
}: ComponentProps<typeof Avatar> & {
  src?: string
  address: string
  raveName: RaveName
}) => {
  const {avatar} = useAvatar(raveName.name)

  console.log(avatar)

  return (
    <Avatar
      {...props}
      style={{
        zIndex: '100'
      }}
      src={avatar}
    />
  )
}
