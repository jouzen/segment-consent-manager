import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import ConsentManagerBuilder from '../consent-manager-builder'
import Container from './container'
import {ADVERTISING_CATEGORIES, FUNCTIONAL_CATEGORIES} from './categories'

const initialPreferences = {
  marketingAndAnalytics: true,
  advertising: true,
  functional: true
}

export default class ConsentManager extends PureComponent {
  static displayName = 'ConsentManager'

  static propTypes = {
    writeKey: PropTypes.string.isRequired,
    otherWriteKeys: PropTypes.arrayOf(PropTypes.string),
    shouldRequireConsent: PropTypes.func,
    implyConsentOnInteraction: PropTypes.bool,
    cookieDomain: PropTypes.string,
    bannerContent: PropTypes.node.isRequired,
    bannerTextColor: PropTypes.string,
    bannerBackgroundColor: PropTypes.string,
    dialogTitle: PropTypes.node.isRequired,
    dialogContent: PropTypes.node.isRequired
  }

  static defaultProps = {
    otherWriteKeys: [],
    shouldRequireConsent: () => true,
    implyConsentOnInteraction: true,
    cookieDomain: undefined,
    bannerTextColor: '#fff',
    bannerBackgroundColor: '#1f4160'
  }

  render() {
    const {
      writeKey,
      otherWriteKeys,
      shouldRequireConsent,
      implyConsentOnInteraction,
      cookieDomain,
      bannerContent,
      bannerTextColor,
      bannerBackgroundColor,
      dialogTitle,
      dialogContent
    } = this.props

    return (
      <ConsentManagerBuilder
        writeKey={writeKey}
        otherWriteKeys={otherWriteKeys}
        shouldRequireConsent={shouldRequireConsent}
        cookieDomain={cookieDomain}
        initialPreferences={initialPreferences}
        mapCustomPreferences={this.handleMapCustomPreferences}
      >
        {({
          destinations,
          newDestinations,
          preferences,
          isConsentRequired,
          setPreferences,
          resetPreferences,
          saveConsent
        }) => (
          <Container
            destinations={destinations}
            newDestinations={newDestinations}
            preferences={preferences}
            isConsentRequired={isConsentRequired}
            setPreferences={setPreferences}
            resetPreferences={resetPreferences}
            saveConsent={saveConsent}
            implyConsentOnInteraction={implyConsentOnInteraction}
            bannerContent={bannerContent}
            bannerTextColor={bannerTextColor}
            bannerBackgroundColor={bannerBackgroundColor}
            dialogTitle={dialogTitle}
            dialogContent={dialogContent}
          />
        )}
      </ConsentManagerBuilder>
    )
  }

  handleMapCustomPreferences = ({destinations, preferences}) => {
    const destinationPreferences = {}

    for (const destination of destinations) {
      if (ADVERTISING_CATEGORIES.find(c => c === destination.category)) {
        destinationPreferences[destination.id] = preferences.advertising
      } else if (FUNCTIONAL_CATEGORIES.find(c => c === destination.category)) {
        destinationPreferences[destination.id] = preferences.functional
      } else {
        // Fallback to marketing
        destinationPreferences[destination.id] =
          preferences.marketingAndAnalytics
      }
    }

    return {destinationPreferences, customPreferences: preferences}
  }
}