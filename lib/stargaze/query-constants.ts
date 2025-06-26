// GraphQL query constants for Stargaze API

export const MARKETPLACE_COLLECTIONS_QUERY = `
  query MarketplaceCollections($offset: Int, $limit: Int, $sortBy: CollectionSort, $searchQuery: String, $filterByCategories: [String!], $minMaxFilters: CollectionMinMaxFilters, $filterByDenoms: [String!], $filterByVerified: Boolean = false) {
    collections(
      offset: $offset
      limit: $limit
      sortBy: $sortBy
      searchQuery: $searchQuery
      filterByCategories: $filterByCategories
      minMaxFilters: $minMaxFilters
      filterByDenoms: $filterByDenoms
      filterByVerified: $filterByVerified
    ) {
      __typename
      collections {
        __typename
        contractAddress
        contractUri
        name
        description
        isExplicit
        categories {
          public
          __typename
        }
        tradingAsset {
          denom
          symbol
          price
          exponent
          __typename
        }
        floor {
          amount
          amountUsd
          denom
          symbol
          exponent
          __typename
        }
        highestOffer {
          offerPrice {
            amount
            amountUsd
            denom
            symbol
            exponent
            __typename
          }
          __typename
        }
        tokenCounts {
          listed
          active
          __typename
        }
        categories {
          public
          __typename
        }
        stats {
          collectionAddr
          change6HourPercent
          change24HourPercent
          change7DayPercent
          change30dayPercent
          volume6Hour
          volume24Hour
          volume7Day
          volume30Day
          changeUsd6hourPercent
          changeUsd24hourPercent
          changeUsd7dayPercent
          changeUsd30dayPercent
          volumeUsd6hour
          volumeUsd24hour
          volumeUsd7day
          volumeUsd30day
          bestOffer
          bestOfferUsd
          numOwners
          uniqueOwnerPercent
          salesCountTotal
          __typename
        }
        media {
          ...MediaFields
          __typename
        }
      }
      pageInfo {
        __typename
        total
        offset
        limit
      }
    }
  }

  fragment MediaFields on Media {
    type
    url
    originalUrl
    height
    width
    visualAssets {
      xs {
        type
        url
        height
        width
        staticUrl
        __typename
      }
      sm {
        type
        url
        height
        width
        staticUrl
        __typename
      }
      md {
        type
        url
        height
        width
        staticUrl
        __typename
      }
      lg {
        type
        url
        height
        width
        staticUrl
        __typename
      }
      xl {
        type
        url
        height
        width
        staticUrl
        __typename
      }
      __typename
    }
    __typename
  }
`;

export const LAUNCHPAD_QUERY = `
  query MinterV2($address: String!, $walletAddress: String) {
    collection(address: $address) {
      __typename
      contractAddress
      contractUri
      name
      description
      website
      isExplicit
      minterAddress
      featured
      floor {
        amount
        amountUsd
        denom
        symbol
        __typename
      }
      creator {
        address
        name {
          name
          records {
            name
            value
            verified
            __typename
          }
          __typename
        }
        __typename
      }
      royaltyInfo {
        sharePercent
        __typename
      }
      minterV2(walletAddress: $walletAddress) {
        ...MinterV2Fields
        __typename
      }
      startTradingTime
      media {
        ...MediaFields
        __typename
      }
    }
  }

  fragment MinterV2Fields on MinterV2 {
    minterType
    minterAddress
    mintableTokens
    mintedTokens
    airdroppedTokens
    numTokens
    currentStage {
      id
      name
      type
      presaleType
      status
      startTime
      endTime
      salePrice {
        denom
        symbol
        amount
        amountUsd
        __typename
      }
      discountPrice {
        denom
        symbol
        amount
        amountUsd
        __typename
      }
      burnConditions {
        collectionAddress
        amountToBurn
        __typename
      }
      addressTokenCounts {
        limit
        mintable
        minted
        __typename
      }
      stageCounts {
        limit
        mintable
        minted
        __typename
      }
      numMembers
      isMember
      proofs
      __typename
    }
    mintStages {
      discountPrice {
        amount
        amountUsd
        denom
        symbol
        __typename
      }
      salePrice {
        amount
        amountUsd
        denom
        symbol
        __typename
      }
      burnConditions {
        collectionAddress
        amountToBurn
        __typename
      }
      status
      type
      id
      presaleType
      startTime
      endTime
      name
      isMember
      numMembers
      proofs
      addressTokenCounts {
        limit
        mintable
        minted
        __typename
      }
      stageCounts {
        limit
        mintable
        minted
        __typename
      }
      __typename
    }
    __typename
  }

  fragment MediaFields on Media {
    type
    url
    height
    width
    visualAssets {
      xs {
        type
        url
        height
        width
        staticUrl
        __typename
      }
      sm {
        type
        url
        height
        width
        staticUrl
        __typename
      }
      md {
        type
        url
        height
        width
        staticUrl
        __typename
      }
      lg {
        type
        url
        height
        width
        staticUrl
        __typename
      }
      xl {
        type
        url
        height
        width
        staticUrl
        __typename
      }
      __typename
    }
    __typename
  }
`;
