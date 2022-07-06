import { mq } from '@ensdomains/thorin'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import SocialDiscord from '../assets/social/SocialDiscord.svg'
import SocialDiscourse from '../assets/social/SocialDiscourse.svg'
import SocialDiscourseColour from '../assets/social/SocialDiscourseColour.svg'
import SocialGithub from '../assets/social/SocialGithub.svg'
import SocialMedium from '../assets/social/SocialMedium.svg'
import SocialTwitter from '../assets/social/SocialTwitter.svg'
import SocialYoutube from '../assets/social/SocialYoutube.svg'
import { StyledNavLink } from './@atoms/StyledNavLink'
import { LanugageDropdown } from './LanguageDropdown'
import { SocialIcon } from './SocialIcon'

const Container = styled.footer(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin-top: ${theme.space['2.5']};
    ${mq.md.min(css`
      flex-direction: row;
    `)}
  `,
)

const TrailingStack = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
  `,
)

const LinkContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    direction: row;
    align-items: center;
    flex-gap: ${theme.space['4']};
    gap: ${theme.space['4']};
  `,
)

const SocialIconContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    flex-gap: ${theme.space['2']};
    gap: ${theme.space['2']};
  `,
)

export const Footer = () => {
  const { t } = useTranslation('common')

  return (
    <Container>
      <TrailingStack>
        <LinkContainer>
          <StyledNavLink href="https://docs.rave.domains">
            {'Documentation'}
          </StyledNavLink>
          <StyledNavLink href="https://github.com/rave-names/ravejs">
            {'Rave.JS'}
          </StyledNavLink>
        </LinkContainer>
        <SocialIconContainer>
          <SocialIcon
            Icon={SocialTwitter}
            color="#5298FF"
            href="https://twitter.com/rave_names"
          />
          <SocialIcon
            Icon={SocialGithub}
            color="#0F0F0F"
            href="https://github.com/rave-names"
          />
          <SocialIcon
            Icon={SocialDiscord}
            color="#7F83FF"
            href="https://chats.fantoms.art"
          />
        </SocialIconContainer>
      </TrailingStack>
    </Container>
  )
}
