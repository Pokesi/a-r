/* eslint-disable @typescript-eslint/no-unused-vars */
import { NameSnippet } from '@app/components/pages/profile/NameSnippet'
import { ProfileDetails } from '@app/components/pages/profile/ProfileDetails'
import { ProfileSnippet } from '@app/components/ProfileSnippet'
import { useChainId } from '@app/hooks/useChainId'
import { useInitial } from '@app/hooks/useInitial'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { Content } from '@app/layouts/Content'
import { ContentGrid } from '@app/layouts/ContentGrid'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { Button } from '@ensdomains/thorin'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'
import { Rave, RaveName } from '@rave-names/rave'

const rave = new Rave()

const useRaveName = async (name: any) => {
  let data: any
  try {
    await rave.resolveStringToAddress(name).then(async (res) => {
      await rave.reverse(res).then((r) => {
        data = r
      })
    })
  } catch (e) {
    data = {
      name: '',
      isOwned: false,
      owner: '',
      addresses: {},
    }
  }
  return data
}

const DetailsWrapper = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
    width: 100%;
  `,
)

const SelfButtons = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};

    & > button {
      border-radius: ${theme.radii.extraLarge};
      border: ${theme.space.px} solid ${theme.colors.borderTertiary};
      box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.02);
      background-color: ${theme.colors.background};
    }
  `,
)

interface StrictOBJ {
  [key: string]: string
}

export default function Page() {
  const router = useRouter()
  const { t } = useTranslation('profile')
  const breakpoints = useBreakpoint()
  const _name = router.query.name as string
  const isSelf = router.query.connected === 'true'

  const initial = useInitial()
  const chainId = useChainId()

  const { data: accountData, isLoading: accountLoading } = useAccount()
  const address = accountData?.address

  const [data, setData] = useState({
    name: '',
    isOwned: false,
    owner: '',
    addresses: {},
  })
  const [loadingName, setLoadingName] = useState(true)

  useRaveName(_name).then((res) => {
    setData(res)
    if (typeof data.addresses !== 'object') {
      setData({
        ...data,
        addresses: {
          ftm: data.owner ? data.owner : '',
        },
      })
    }
    setLoadingName(false)
  })

  const name = isSelf && data.name ? data.name : _name

  const isLoading = accountLoading || loadingName

  useProtectedRoute(
    '/',
    // if is self, user must be connected
    isLoading
      ? true
      : (isSelf ? address : true) &&
          typeof name === 'string' &&
          name.length > 0,
  )

  const normalisedName = name

  const error = data.isOwned ? null : 'Name not owned'

  const ownerData = {
    owner: data.owner,
  }

  const getAddressRecord = (key: any): string => {
    const entries = Object.entries(data.addresses as StrictOBJ)
    for (let i = 0; i < entries.length; i += 1) {
      const x = entries[i]
      if (x[0] === key) {
        return x[1] === '' ? 'None set' : x[1]
      }
    }
    return 'None'
  }

  return (
    <Content
      title={isSelf ? t('yourProfile') : normalisedName}
      subtitle={isSelf ? normalisedName : 'Profile'}
      loading={isLoading}
    >
      {{
        warning: error
          ? {
              type: 'warning',
              message: error,
            }
          : undefined,
        leading: breakpoints.md && ownerData && (
          <NameSnippet
            name={normalisedName}
            network={chainId}
            ownerData={ownerData}
            showButton={!isSelf}
            raveName={data}
          />
        ),
        trailing: (
          <DetailsWrapper>
            <ProfileSnippet
              name={normalisedName}
              button={isSelf || breakpoints.md ? undefined : 'viewDetails'}
              size={breakpoints.md ? 'medium' : 'small'}
            />
            {isSelf && (
              <SelfButtons>
                <Button
                  onClick={() =>
                    router.push({
                      pathname: `/profile/${normalisedName}/details`,
                      query: {
                        from: router.asPath,
                      },
                    })
                  }
                  shadowless
                  variant="transparent"
                  size="small"
                >
                  {t('viewDetails')}
                </Button>
              </SelfButtons>
            )}
            <ProfileDetails
              addresses={(typeof data.addresses === 'object'
                ? Object.keys(data.addresses)
                : []
              ).map((item: any) => ({
                key: item,
                value: getAddressRecord(item) as string,
              }))}
            />
          </DetailsWrapper>
        ),
      }}
    </Content>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid>{page}</ContentGrid>
}
