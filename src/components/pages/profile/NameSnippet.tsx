import { AddressAvatar, AvatarWithZorb } from '@app/components/AvatarWithZorb'
import { NFTWithPlaceholder } from '@app/components/NFTWithPlaceholder'
import { shortenAddress } from '@app/utils/utils'
import { Button, Typography } from '@ensdomains/thorin'
import { useRouter } from 'next/router'
import styled, { css } from 'styled-components'
import { useTranslation } from 'react-i18next'
import type { RaveName } from '@rave-names/rave'

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
  `,
)

const OwnerContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${theme.space['1.5']};
    flex-gap: ${theme.space['1.5']};
  `,
)

const AvatarWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space['5']};
    height: ${theme.space['5']};
  `,
)

const OwnerWithEns = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    gap: ${theme.space['0.5']};
    flex-gap: ${theme.space['0.5']};

    & div:last-of-type {
      color: ${theme.colors.textTertiary};
      font-size: ${theme.fontSizes.label};
    }
  `,
)

const NameOwnerItem = ({
  address = '',
  network,
  raveName,
}: {
  address?: string
  network: number
  raveName: RaveName
}) => {
  const data = raveName
  const hasEns = data?.isOwned && data?.name

  console.log(data)

  if (hasEns) {
    return (
      <OwnerContainer>
        <OwnerWithEns>
          <Typography weight="bold">
            {data.name.length > 12 ? `${data.name.slice(0, 12)}...` : data.name}
          </Typography>
          <Typography weight="bold">{shortenAddress(address)}</Typography>
        </OwnerWithEns>
        <AvatarWrapper>
          <AvatarWithZorb
            label={data.name}
            address={address}
            name={data.name}
            network={network}
            src={data.avatar}
            raveName={raveName}
          />
        </AvatarWrapper>
      </OwnerContainer>
    )
  }

  return (
    <OwnerContainer>
      <Typography weight="bold">{shortenAddress(address)}</Typography>
      <AvatarWrapper>
        <AddressAvatar
          address={address}
          src={data.avatar}
          label={address}
          raveName={raveName}
        />
      </AvatarWrapper>
    </OwnerContainer>
  )
}

const ItemContainer = styled.div(
  () => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  `,
)

const NameDetailContainer = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2.5']};
    flex-gap: ${theme.space['2.5']};
    padding: ${theme.space['4']};
    background-color: #282937;
    border-radius: ${theme.radii['2xLarge']};
    border: ${theme.space.px} solid ${theme.colors.borderTertiary};
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.02);
  `,
)

const ButtonWrapper = styled.div(
  ({ theme }) => css`
    margin-top: ${theme.space['2']};
    & > button {
      border: ${theme.space.px} solid ${theme.colors.borderSecondary};
      border-radius: ${theme.radii.extraLarge};
    }
  `,
)

const LeftText = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
  `,
)

export const NameDetailSnippet = ({
  name,
  expiryDate,
  ownerData,
  network,
  showButton,
  raveName,
}: {
  name: string
  expiryDate?: Date | null
  ownerData: {
    owner?: string
  }
  network: number
  showButton?: boolean
  raveName: RaveName
}) => {
  const { t } = useTranslation('common')
  const router = useRouter()

  return (
    <NameDetailContainer>
      {expiryDate && (
        <ItemContainer>
          <LeftText weight="bold">{t('name.expires')}</LeftText>
          <Typography weight="bold">{`${expiryDate.toLocaleDateString(
            undefined,
            {
              month: 'long',
            },
          )} ${expiryDate.getDate()}, ${expiryDate.getFullYear()}`}</Typography>
        </ItemContainer>
      )}
      <ItemContainer>
        <LeftText weight="bold">{'Owner'}</LeftText>
        <NameOwnerItem
          address={ownerData.owner}
          network={network}
          raveName={raveName}
        />
      </ItemContainer>
      {/* {ownerData.registrant && (
        <ItemContainer>
          <LeftText weight="bold">{t('name.registrant')}</LeftText>
          <NameOwnerItem address={ownerData.registrant} network={network} />
        </ItemContainer>
      )} */}
      {false && (
        <ButtonWrapper>
          <Button
            onClick={() =>
              router.push({
                pathname: `/profile/${name}/details`,
                query: {
                  from: router.asPath,
                },
              })
            }
            variant="transparent"
            shadowless
            size="small"
          >
            {t('wallet.viewDetails')}
          </Button>
        </ButtonWrapper>
      )}
    </NameDetailContainer>
  )
}

export const NameSnippet = ({
  name,
  network,
  expiryDate,
  ownerData,
  raveName,
  showButton,
}: {
  name: string
  network: number
  expiryDate?: Date | null
  ownerData: {
    owner?: string
    registrant?: string
  }
  raveName: RaveName
  showButton?: boolean
}) => {
  return (
    <Container>
      <NFTWithPlaceholder
        name={name}
        network={network}
        style={{ width: '270px', height: '270px' }}
      />
      <NameDetailSnippet
        name={name}
        expiryDate={expiryDate}
        ownerData={ownerData}
        network={network}
        showButton={showButton}
        raveName={raveName}
      />
    </Container>
  )
}
