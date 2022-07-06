import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { zorbImageDataURI } from '@app/utils/gradient'
import { useAvatar } from '@app/hooks/useAvatar'
import { useNameWithQuery } from '@app/hooks/useRaveName'
import { shortenAddress } from '@app/utils/utils'
import { Button, mq, Dropdown, Avatar, Typography } from '@ensdomains/thorin'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useRouter } from 'next/router'
import type { TFunction } from 'react-i18next'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useDisconnect } from 'wagmi'
import React from 'react'

interface ContainerProps {
  $size: Size
  $hasChevron?: boolean
  $open: boolean
}

const ReducedLineText = styled(Typography)(
  () => css`
    line-height: initial;
  `,
)

const StyledButtonWrapper = styled.div<{ $isTabBar?: boolean }>(
  ({ theme, $isTabBar }) =>
    $isTabBar
      ? css`
          align-self: flex-end;
          justify-self: flex-end;
          & button {
            padding: 0 ${theme.space['4']};
            width: ${theme.space.full};
            height: ${theme.space['12']};
            border-radius: ${theme.radii.full};
            font-size: ${theme.fontSizes.base};
            ${mq.xs.min(css`
              padding: 0 ${theme.space['8']};
            `)}
          }
        `
      : css`
          & button {
            border-radius: ${theme.radii['2xLarge']};
          }
        `,
)

const ProfileInnerContainer = styled.div<{
  $size?: 'small' | 'medium' | 'large'
}>(
  ({ theme, $size }) => css`
    display: ${$size === 'small' ? 'none' : 'block'};
    margin: 0 ${theme.space['1.5']};
    min-width: ${theme.space['none']};
  `,
)

const AvatarContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space['12']};
  `,
)

const StyledDropdown = styled(Dropdown)(
  () => css`
    background-color: transparent;
  `
)

export const getTestId = (props: any, fallback: string): string => {
  return props['data-testid'] ? String(props['data-testid']) : fallback
}

const ProfileInner = ({ size, avt, address, name }: Props) => (
  <>
    <AvatarContainer>
      <Avatar label="profile-avatar" src={avt} />
    </AvatarContainer>
    <ProfileInnerContainer $size={size}>
      <ReducedLineText
        color={name ? 'text' : 'textTertiary'}
        ellipsis
        forwardedAs="h3"
        variant={name && size === 'large' ? 'extraLarge' : 'large'}
        weight="bold"
      >
        {name || 'No name set'}
      </ReducedLineText>
      <ReducedLineText
        color={name ? 'textTertiary' : 'text'}
        forwardedAs="h4"
        variant="small"
        weight="bold"
      >
        {shortenAddress(
          address,
          size === 'large' ? 30 : 10,
          size === 'large' ? 10 : 5,
          size === 'large' ? 10 : 5,
        )}
      </ReducedLineText>
    </ProfileInnerContainer>
  </>
)

const IconDownIndicatorSvg = () => {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.2552 17.8659C11.6526 18.3095 12.3474 18.3095 12.7448 17.8659L22.5063 6.97001C23.0833 6.32597 22.6262 5.30274 21.7615 5.30274H2.2385C1.37381 5.30274 0.916704 6.32597 1.49369 6.97001L11.2552 17.8659Z" fill="currentColor"/>
  </svg>
}

const Chevron = styled.svg<{ $open: boolean }>(
  ({ theme, $open }) => css`
    margin-left: ${theme.space['1']};
    width: ${theme.space['3']};
    margin-right: ${theme.space['0.5']};
    transition-duration: ${theme.transitionDuration['200']};
    transition-property: all;
    transition-timing-function: ${theme.transitionTimingFunction['inOut']};
    opacity: 0.3;
    transform: rotate(0deg);
    display: flex;
    color: ${theme.colors.foreground};
    ${$open &&
    css`
      opacity: 1;
      transform: rotate(180deg);
    `}
  `,
)

const Container = styled.div<ContainerProps>(
  ({ theme, $size, $hasChevron, $open }) => css`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-radius: ${theme.radii['full']};
    transition-duration: ${theme.transitionDuration['150']};
    transition-property: color, border-color, background-color, transform,
      filter, box-shadow;
    transition-timing-function: ${theme.transitionTimingFunction['inOut']};
    position: relative;
    z-index: 10;
    cursor: pointer;
    padding: ${theme.space['2']} ${theme.space['4']} ${theme.space['2']}
      ${theme.space['2.5']};
    box-shadow: ${theme.shadows['0.25']};
    color: ${theme.colors.foregroundSecondary};
    background-color: ${theme.colors.groupBackground};
    ${$hasChevron &&
    css`
      cursor: pointer;
      &:hover {
        transform: translateY(-1px);
        filter: brightness(1.05);
      }
    `}
    ${$open &&
    css`
      box-shadow: ${theme.shadows['0']};
      background-color: ${theme.colors.foregroundSecondary};
    `}
  ${() => {
      switch ($size) {
        case 'small':
          return css`
            max-width: ${theme.space['48']};
          `
        case 'medium':
          return css`
            max-width: ${theme.space['52']};
          `
        case 'large':
          return css`
            max-width: ${theme.space['80']};
          `
        default:
          return ``
      }
    }}
  ${() => {
      if ($size === 'small' && $hasChevron)
        return css`
          max-width: ${theme.space['52']};
        `
      if ($size === 'medium' && $hasChevron)
        return css`
          max-width: ${theme.space['56']};
        `
      if ($size === 'large' && $hasChevron)
        return css`
          max-width: calc(${theme.space['80']} + ${theme.space['4']});
        `
    }}
  `,
)

const Profile = ({
  size = 'medium',
  avatar,
  dropdownItems,
  address,
  ensName,
  alignDropdown = 'left',
  disconnect,
  ...props
}: Props) => {
  const router = useRouter()
  const name = useNameWithQuery(address)
  const avt = useAvatar(name).avatar
  console.log(avt)
  if (dropdownItems.length === 1) dropdownItems.push({
    label: 'My profile',
    color: 'text',
    onClick: () => router.push(`/profile/${name}`),
  })

  /*if (false) {
    return (
      <StyledDropdown
        {...{ items: dropdownItems, isOpen, setIsOpen, align: alignDropdown }}
      >
        <Container
          {...props}
          $hasChevron
          $open={false}
          $size={size}
          onClick={() => setIsOpen(!isOpen)}
        >
          <ProfileInner {...{ size, avt, address, name }} />
          <Chevron $open={isOpen} as={IconDownIndicatorSvg} />
        </Container>
      </StyledDropdown>
    )
  }*/

  return (
    <Container
      {...{
        ...props,
        'data-testid': getTestId(props, 'profile'),
      }}
      $open={true}
      $size={size}
      onClick={disconnect}
    >
      <ProfileInner {...{ size, avt, address, name }} />
    </Container>
  )
}

export type AccountRenderProps = {
  address: string
  balanceDecimals?: number
  balanceFormatted?: string
  balanceSymbol?: string
  displayBalance?: string
  displayName: string
  ensAvatar?: string
  ensName?: string
  hasPendingTransactions: boolean
  disconnect: () => void
  router: ReturnType<typeof useRouter>
  t: TFunction
  zorb: string
}

export const ConnectButtonWrapper = ({
  isTabBar,
  children,
}: {
  isTabBar?: boolean
  children: {
    hasAccount: (renderProps: AccountRenderProps) => React.ReactNode
    noAccountBefore?: React.ReactNode
    noAccountAfter?: React.ReactNode
  }
}) => {
  const router = useRouter()
  const { t } = useTranslation('common')
  const breakpoints = useBreakpoint()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { disconnect } = useDisconnect()

  return (
    <ConnectButton.Custom>
      {({ account, openConnectModal }) =>
        !account ? (
          <>
            {children.noAccountBefore}
            <StyledButtonWrapper $isTabBar={isTabBar}>
              <Button
                onClick={() => openConnectModal()}
                variant="primary"
                size={breakpoints.md ? 'medium' : 'extraSmall'}
              >
                {t('wallet.connect')}
              </Button>
            </StyledButtonWrapper>
          </>
        ) : (
          children.hasAccount({
            ...account,
            disconnect,
            router,
            t,
            zorb: zorbImageDataURI(account.address, 'address'),
          })
        )
      }
    </ConnectButton.Custom>
  )
}

export const HeaderConnect = () => {
  return (
    <ConnectButtonWrapper>
      {{
        hasAccount: ({
          address,
          ensName,
          ensAvatar,
          router,
          t,
          disconnect,
          zorb,
        }) => (

          <Profile
            address={address}
            ensName={ensName}
            disconnect={disconnect}
            dropdownItems={[
              {
                label: t('wallet.disconnect'),
                color: 'red',
                onClick: () => disconnect(),
              },
            ]}
            avatar={ensAvatar || zorb}
            size="medium"
            alignDropdown="right"
          />
        ),
      }}
    </ConnectButtonWrapper>
  )
}
