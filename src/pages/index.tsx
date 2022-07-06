import { HamburgerRoutes } from '@app/components/@molecules/HamburgerRoutes'
import { SearchInput } from '@app/components/@molecules/SearchInput/SearchInput'
import { LeadingHeading } from '@app/components/LeadingHeading'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { mq, Typography } from '@ensdomains/thorin'
import Head from 'next/head'
import { useRouter } from 'next/router'
import styled, { css } from 'styled-components'
import Typewriter from 'typewriter-effect'
import ENSWithGradient from '../assets/ENSWithGradient.svg'

const GradientTitle = styled.h1(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.headingTwo};
    text-align: center;
    font-weight: 800;
    background-image: ${theme.colors.accentGradient};
    background-repeat: no-repeat;
    background-size: 110%;
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin: 0;

    ${mq.sm.min(css`
      font-size: ${theme.fontSizes.headingOne};
    `)}
  `,
)

const SubtitleWrapper = styled.div(
  ({ theme }) => css`
    max-width: calc(${theme.space['72']} * 2 - ${theme.space['4']});
    line-height: 150%;
    text-align: center;
    margin-bottom: ${theme.space['3']};
  `,
)

const Container = styled.div(
  () => css`
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  `,
)

const Stack = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-gap: ${theme.space['3']};
    gap: ${theme.space['3']};
  `,
)

const Description = styled(Typography)(
  ({ theme }) => css`
    line-height: ${theme.lineHeights['1.5']};
    color: rgb(35, 97, 120);
  `,
)

const StyledENS = styled.div(
  ({ theme }) => css`
    height: ${theme.space['12']};
  `,
)

const LogoAndLanguage = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['4']};
    flex-gap: ${theme.space['4']};
  `,
)

const GradientBG = styled(Typography)(
  () => css`
    color: #caf0f8;
    background-image: linear-gradient(90deg, #03045e, #0096c7);
    padding: 0 4px;
    border-radius: 5px;
  `,
)

export default function Page() {
  const { isReady } = useRouter()
  const breakpoints = useBreakpoint()

  return (
    <>
      <Head>
        <title>Rave Names</title>
      </Head>
      {isReady && !breakpoints.md && (
        <LeadingHeading>
          <LogoAndLanguage>
            <StyledENS as={ENSWithGradient} />
          </LogoAndLanguage>
        </LeadingHeading>
      )}
      <Container>
        <Stack>
          <GradientTitle>
            {'Welcome to '}
            <GradientBG>
              <Typewriter
                onInit={(typewriter: any | null) => {
                  typewriter
                    .typeString(' the cheapest registration fees in crypto')
                    .pauseFor(2500)
                    .deleteChars(40)
                    .typeString('no renewal fees')
                    .pauseFor(2500)
                    .deleteChars(15)
                    .typeString('Rave Names')
                    .pauseFor(2500)
                    .start()
                }}
              />
            </GradientBG>
          </GradientTitle>
          <SubtitleWrapper>
            <Description variant="large" color="textSecondary">
              The first web3 username system on Fantom
            </Description>
          </SubtitleWrapper>
          <SearchInput />
        </Stack>
      </Container>
    </>
  )
}
