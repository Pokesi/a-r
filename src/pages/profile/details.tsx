import { NFTWithPlaceholder } from '@app/components/NFTWithPlaceholder'
import { NameSnippetMobile } from '@app/components/pages/profile/NameSnippetMobile'
import { OwnerButton } from '@app/components/pages/profile/OwnerButton'
import { DetailSnippet } from '@app/components/pages/profile/[name]/details/DetailSnippet'
import More from '@app/components/pages/profile/[name]/details/MoreTab/MoreTab'
import { RecordsTab } from '@app/components/pages/profile/[name]/details/RecordsTab'
import { SubnamesTab } from '@app/components/pages/profile/[name]/details/SubnamesTab'
import { useChainId } from '@app/hooks/useChainId'
import { Content } from '@app/layouts/Content'
import { ContentGrid } from '@app/layouts/ContentGrid'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { mq, Typography } from '@ensdomains/thorin'
import { useRouter } from 'next/router'
import { ReactElement, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { Rave, RaveName } from '@rave-names/rave'

const rave = new Rave()

const useRaveName = async (name: any) => {
  let data: any
  await rave.resolveStringToAddress(name).then(async (res) => {
    await rave.reverse(res).then((r) => {
      data = r
    })
  })
  return data
}

const DetailsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: ${theme.space['1']};
    ${mq.sm.min(css`
      flex-direction: row;
      justify-content: center;
    `)}
    ${mq.md.min(css`
      flex-direction: column;
      justify-content: flex-start;
    `)}
  `,
)

const OwnerButtons = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: stretch;
    gap: ${theme.space['1']};
    flex-gap: ${theme.space['1']};
    ${mq.xs.min(css`
      flex-direction: row;
    `)}
    ${mq.sm.min(css`
      flex-direction: column;
      & > div {
        max-width: initial !important;
      }
    `)}
  `,
)

const TabButtonContainer = styled.div(
  ({ theme }) => css`
    margin-left: ${theme.radii.extraLarge};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['3']};
    flex-gap: ${theme.space['3']};
  `,
)

const TabButton = styled.button<{ $selected: boolean }>(
  ({ theme, $selected }) => css`
    display: block;
    outline: none;
    border: none;
    padding: 0;
    margin: 0;
    background: none;
    color: ${$selected ? theme.colors.accent : theme.colors.textTertiary};
    font-size: ${theme.fontSizes.extraLarge};
    transition: all 0.15s ease-in-out;
    cursor: pointer;

    &:hover {
      color: ${$selected ? theme.colors.accent : theme.colors.textSecondary};
    }
  `,
)

export default function Page() {
  const { t } = useTranslation('profile')
  const breakpoints = useBreakpoint()
  const router = useRouter()
  const name = router.query.name as string

  const chainId = useChainId()
  const { data: accountData, isLoading: accountLoading } = useAccount()
  const address = accountData?.address

  let data: RaveName = {
    name: '',
    isOwned: false,
    owner: '',
  }
  useRaveName(name).then((res) => {
    data = res
  })

  const normalisedName = data.name

  const selfAbilities = useMemo(() => {
    const abilities = {
      canEdit: false,
      canSend: false,
    }
    if (!address || !data) return abilities
    if (data.owner === address) {
      abilities.canSend = true
      abilities.canEdit = true
    }
    return abilities
  }, [address, data])

  const isLoading = accountLoading

  const [tab, setTab] = useState<'records' | 'more'>('records')

  return (
    <Content
      title={normalisedName}
      subtitle={t('details.title')}
      loading={isLoading}
    >
      {{
        leading: (
          <DetailsContainer>
            {breakpoints.md ? (
              <NFTWithPlaceholder
                name={normalisedName}
                network={chainId}
                style={{ width: '270px', height: '270px' }}
              />
            ) : (
              <NameSnippetMobile
                name={normalisedName}
                network={chainId}
                canSend={selfAbilities.canSend}
              />
            )}
            <OwnerButtons>
              {data?.owner && (
                <OwnerButton
                  address={data.owner}
                  network={chainId}
                  label={t('name.owner', { ns: 'common' })}
                  type={breakpoints.lg ? 'dropdown' : 'dialog'}
                  description={t('details.descriptions.owner')}
                  canTransfer={selfAbilities.canSend}
                  raveName={data}
                />
              )}
            </OwnerButtons>
            {breakpoints.md && (
              <DetailSnippet canSend={selfAbilities.canSend} />
            )}
          </DetailsContainer>
        ),
        trailing: {
          records: (
            <RecordsTab
              network={chainId}
              name={normalisedName}
              addresses={(data.addresses as any) || []}
              canEdit={selfAbilities.canEdit}
            />
          ),
          subnames: <SubnamesTab name={normalisedName} network={chainId} />,
          more: <More />,
        }[tab],
        header: (
          <TabButtonContainer>
            <TabButton
              $selected={tab === 'records'}
              onClick={() => setTab('records')}
            >
              <Typography weight="bold">
                {t('details.tabs.records.label')}
              </Typography>
            </TabButton>
            <TabButton
              $selected={tab === 'more'}
              onClick={() => setTab('more')}
            >
              <Typography weight="bold">
                {t('details.tabs.more.label')}
              </Typography>
            </TabButton>
          </TabButtonContainer>
        ),
      }}
    </Content>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid>{page}</ContentGrid>
}
