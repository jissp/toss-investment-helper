# API

## 시장

### 주요 지수/지표 전체 조회

URL: https://wts-cert-api.tossinvest.com/api/v3/dashboard/wts/overview/indicator/mini-chart

#### 응답구조

```json
{
  "result": {
    "indexMap": {
      "주가지수": [
        {
          "code": "KGG01P",
          "name": "KGG01P",
          "displayName": "코스피",
          "logoImageUrl": "https://static.toss.im/icons/png/4x/icon-flag-kr.png",
          "nation": "kr",
          "price": {
            "code": "KGG01P",
            "name": "KGG01P",
            "displayName": "코스피",
            "changeType": "UP",
            "latestPrice": 5532.59,
            "basePrice": 5251.87
          },
          "miniChart": {
            "code": "KGG01P",
            "timezone": "Asia/Seoul",
            "tradingStart": "2026-03-10T00:00:00Z",
            "tradingEnd": "2026-03-10T06:30:00Z",
            "candles": [
              {
                "startDate": "2026-03-10T06:20:00Z",
                "endDate": "2026-03-10T06:30:00Z",
                "price": 5532.59
              }
            ]
          },
          "tradingTrend": {
            "code": "KGG01P",
            "baseDate": "2026-03-10",
            "institutionAmount": 1143268826174,
            "foreignerAmount": 1601292340110,
            "individualAmount": -2613379892918
          }
        }
      ],
      "환율": [
        {
          "code": "RGI..DXY",
          "name": "RGI..DXY",
          "displayName": "달러 인덱스",
          "logoImageUrl": "https://static.toss.im/icons/png/4x/icon-coin-dollar-green.png",
          "nation": "us",
          "price": {
            "code": "RGI..DXY",
            "name": "RGI..DXY",
            "displayName": "달러 인덱스",
            "changeType": "DOWN",
            "latestPrice": 98.6,
            "basePrice": 99.17
          },
          "miniChart": {
            "code": "RGI..DXY",
            "timezone": "America/New_York",
            "tradingStart": "2026-03-09T23:45:00Z",
            "tradingEnd": "2026-03-10T22:15:00Z",
            "candles": [
              {
                "startDate": "2026-03-10T07:30:00Z",
                "endDate": "2026-03-10T07:40:00Z",
                "price": 98.6
              }
            ]
          }
        },
        {
          "code": "EXCHANGE_RATE",
          "name": "EXCHANGE_RATE",
          "displayName": "달러 환율",
          "logoImageUrl": "https://static.toss.im/icons/png/4x/icon-coin-dollar-green.png",
          "nation": "us",
          "price": {
            "code": "EXCHANGE_RATE",
            "name": "EXCHANGE_RATE",
            "displayName": "달러 환율",
            "changeType": "DOWN",
            "latestPrice": 1466.55,
            "basePrice": 1493.1
          },
          "miniChart": {
            "code": "exchange_rate",
            "timezone": "Asia/Seoul",
            "tradingStart": "2026-03-09T23:20:00Z",
            "tradingEnd": "2026-03-10T11:00:00Z",
            "candles": [
              {
                "startDate": "2026-03-10T07:30:00Z",
                "endDate": "2026-03-10T07:40:00Z",
                "price": 1466.55
              }
            ]
          }
        }
      ],
      "산업": [
        {
          "code": "SOX.NAI",
          "name": "SOX.NAI",
          "displayName": "필라델피아 반도체",
          "logoImageUrl": "https://static.toss.im/icons/png/4x/icon-flag-us.png",
          "nation": "us",
          "price": {
            "code": "SOX.NAI",
            "name": "SOX.NAI",
            "displayName": "필라델피아 반도체",
            "changeType": "UP",
            "latestPrice": 7810.4,
            "basePrice": 7514.73
          },
          "miniChart": {
            "code": "SOX.NAI",
            "timezone": "America/New_York",
            "tradingStart": "2026-03-09T13:30:00Z",
            "tradingEnd": "2026-03-09T20:00:00Z",
            "candles": [
              {
                "startDate": "2026-03-09T19:50:00Z",
                "endDate": "2026-03-09T20:00:00Z",
                "price": 7810.4
              }
            ]
          }
        }
      ],
      "채권": [
        {
          "code": "KR1BENCH0002",
          "name": "KR1BENCH0002",
          "displayName": "한국 국채 2년",
          "logoImageUrl": "https://static.toss.im/icons/png/4x/icon-flag-kr.png",
          "nation": "kr",
          "price": {
            "code": "KR1BENCH0002",
            "name": "KR1BENCH0002",
            "displayName": "한국 국채 2년",
            "changeType": "UP",
            "latestPrice": 3.147,
            "basePrice": 2.992
          },
          "miniChart": {
            "code": "KR1BENCH0002",
            "timezone": "Asia/Seoul",
            "tradingStart": "2026-03-10T00:00:00Z",
            "tradingEnd": "2026-03-10T06:30:00Z",
            "candles": [
              {
                "startDate": "2026-03-10T06:20:00Z",
                "endDate": "2026-03-10T06:30:00Z",
                "price": 0.0
              }
            ]
          }
        }
      ],
      "원자재": [
        {
          "code": "RFU.GCv1",
          "name": "RFU.GCv1",
          "displayName": "금",
          "logoImageUrl": "https://static.toss.im/icons/png/4x/icon-goldbar.png",
          "nation": "us",
          "price": {
            "code": "RFU.GCv1",
            "name": "RFU.GCv1",
            "displayName": "금",
            "changeType": "UP",
            "latestPrice": 5178.4,
            "basePrice": 5103.7
          },
          "miniChart": {
            "code": "RFU.GCv1",
            "timezone": "America/New_York",
            "tradingStart": "2026-03-09T22:00:00Z",
            "tradingEnd": "2026-03-10T21:00:00Z",
            "candles": [
              {
                "startDate": "2026-03-10T07:30:00Z",
                "endDate": "2026-03-10T07:40:00Z",
                "price": 5178.4
              }
            ]
          }
        }
      ]
    }
  }
}
```

### 지수 일별 조회

URL: https://wts-info-api.tossinvest.com/api/v1/c-chart/kr-s/KGG01P/day:1?count=290&useAdjustedRate=true

#### 응답구조

```json
{
  "result": {
    "code": "KGG01P",
    "nextDateTime": "2024-12-23T00:00:00+09:00",
    "exchangeRate": 1,
    "exchange": "krx",
    "candles": [
      {
        "dt": "2026-03-10T00:00:00+09:00",
        "base": 5251.87,
        "open": 5523.21,
        "high": 5595.88,
        "low": 5427.88,
        "close": 5532.59,
        "volume": 913019000,
        "amount": 28402340000000
      }
    ]
  }
}
```

## 종목

### 종목 정보

URL: https://wts-info-api.tossinvest.com/api/v2/stock-infos/A003530

#### 응답구조

```json
{
  "result": {
    "code": "A003530",
    "guid": "KR7003530003",
    "symbol": "003530",
    "isinCode": "KR7003530003",
    "status": "N",
    "name": "한화투자증권",
    "englishName": "H.I.S.C",
    "detailName": "한화투자증권",
    "market": {
      "code": "KSP",
      "displayName": "코스피"
    },
    "group": {
      "code": "ST",
      "displayName": "주권"
    },
    "companyCode": "003530",
    "companyName": "한화투자증권",
    "logoImageUrl": "https://static.toss.im/png-icons/securities/icn-sec-fill-003530.png",
    "currency": "KRW",
    "tradingSuspended": false,
    "krxTradingSuspended": false,
    "nxtTradingSuspended": false,
    "commonShare": true,
    "spac": false,
    "spacMergerDate": null,
    "leverageFactor": 0.0,
    "clearance": false,
    "riskLevel": "1",
    "purchasePrerequisite": "0",
    "sharesOutstanding": 214547775,
    "prevListDate": null,
    "listDate": "1986-11-25",
    "delistDate": null,
    "offeringPrice": null,
    "warrantsCode": null,
    "warrantsGroupCode": null,
    "etfTaxCode": null,
    "daytimePriceSupported": false,
    "optionSupported": false,
    "optionPennyPilotPriceSupported": false,
    "optionOvertimeSupported": false,
    "optionInstrument": null,
    "derivativeEtp": false,
    "poolingStock": false,
    "nxtSupported": false,
    "userTradingSuspended": false,
    "limitOnCompetitiveTradingVolume": false,
    "nxtOpenDate": "2025-03-31",
    "nxtOpenDateRecent": "2025-03-31",
    "derivativeEtf": false
  }
}
```

### 관심 종목 리스트

URL: https://wts-cert-api.tossinvest.com/api/v1/new-watchlists?includePrice=true&lazyLoad=false

#### 응답구조

```json
{
  "result": {
    "watchlists": [
      {
        "id": 81837062,
        "name": "최근 본",
        "ordering": -20400,
        "type": "RECENT_WATCH",
        "itemCount": 30,
        "createdAt": "2026-02-03T08:36:36+09:00",
        "updatedAt": "2026-02-03T08:36:36+09:00",
        "items": [
          {
            "id": 0,
            "parentListId": 81837062,
            "code": "A003530",
            "itemType": "STOCK",
            "ordering": 0,
            "createdAt": "2026-03-10T16:37:16.569612476+09:00",
            "updatedAt": "2026-03-10T16:37:16.569612712+09:00",
            "name": "한화투자증권",
            "symbol": "003530",
            "hasMemo": false,
            "prices": {
              "code": "A003530",
              "base": 6950,
              "baseKrw": null,
              "close": 7230,
              "closeKrw": null,
              "overtimeMarketBase": 7230,
              "overtimeMarketClose": 7260,
              "estimatedPrice": 7230,
              "estimatedVolume": 37282,
              "currency": "KRW"
            },
            "logoImageUrl": "https://static.toss.im/png-icons/securities/icn-sec-fill-003530.png",
            "productStatus": "N"
          }
        ]
      },
      {
        "id": 81774942,
        "name": "동향",
        "ordering": -20399,
        "type": "USER_MADE",
        "itemCount": 6,
        "createdAt": "2026-02-02T13:42:44+09:00",
        "updatedAt": "2026-03-06T08:50:54+09:00",
        "items": [
          {
            "id": 738010214,
            "parentListId": 81774942,
            "code": "A069500",
            "itemType": "STOCK",
            "ordering": -3,
            "createdAt": "2026-02-02T13:44:46+09:00",
            "updatedAt": "2026-02-02T13:44:46+09:00",
            "name": "KODEX 200",
            "symbol": "069500",
            "hasMemo": false,
            "prices": {
              "code": "A069500",
              "base": 78230,
              "baseKrw": null,
              "close": 82900,
              "closeKrw": null,
              "overtimeMarketBase": 82900,
              "overtimeMarketClose": 82825,
              "estimatedPrice": 82900,
              "estimatedVolume": 72468,
              "currency": "KRW"
            },
            "logoImageUrl": "https://static.toss.im/png-icons/securities/icn-sec-fill-069500.png?20250207",
            "productStatus": "N"
          }
        ]
      }
    ],
    "maxWatchlistCount": 50
  }
}

```

### 종목 투자자 동향

URL: https://wts-info-api.tossinvest.com/api/v1/stock-infos/trade/trend/trading-trend?productCode=A003530&size=60

#### 응답구조

```json
{
  "result": {
    "pagingParam": {
      "number": 2,
      "size": 60,
      "key": "2025-12-07"
    },
    "body": [
      {
        "baseDate": "2026-03-10",
        "individualsBuyVolume": 1952525,
        "individualsSellVolume": 2157228,
        "netIndividualsBuyVolume": -204703,
        "foreignerBuyVolume": 1265299,
        "foreignerSellVolume": 1088772,
        "netForeignerBuyVolume": 176527,
        "institutionBuyVolume": 187356,
        "institutionSellVolume": 179433,
        "netInstitutionBuyVolume": 7923,
        "insuranceOtherBuyVolume": 0,
        "netInsuranceOtherBuyVolume": 0,
        "insuranceBuyVolume": 17536,
        "netInsuranceBuyVolume": 14386,
        "otherFinancialInstitutionsBuyVolume": 0,
        "netOtherFinancialInstitutionsBuyVolume": 0,
        "financialInvestmentBuyVolume": 114376,
        "netFinancialInvestmentBuyVolume": 72606,
        "bankBuyVolume": 0,
        "netBankBuyVolume": -33527,
        "trustAndPrivateEquityFundBuyVolume": 0,
        "netTrustAndPrivateEquityFundBuyVolume": 0,
        "trustBuyVolume": 37546,
        "netTrustBuyVolume": 13175,
        "privateEquityFundBuyVolume": 1255,
        "netPrivateEquityFundBuyVolume": 1203,
        "pensionFundBuyVolume": 16643,
        "netPensionFundBuyVolume": -59920,
        "otherCorporationBuyVolume": 18173,
        "netOtherCorporationBuyVolume": 16775,
        "foreignerHoldingVolume": 15566357,
        "foreignerLimitVolume": 214547775,
        "foreignerRatio": 7.26,
        "base": 6950,
        "close": 7230,
        "inMarketTime": false,
        "hasIndividual": true,
        "hasInstitution": true,
        "hasForeigner": true,
        "buyBalanceQuantity": null,
        "buyBalanceRate": null,
        "sellBalanceQuantity": null,
        "sellBalanceRate": null,
        "updatedAt": "2026-03-10T15:35:59.000+09:00"
      }
    ],
    "lastPage": false
  }
}

```

### 종목 뉴스 조회

URL: https://wts-info-api.tossinvest.com/api/v2/news/companies/316140?size=20&orderBy=latest

#### 응답구조

```json
{
  "result": {
    "pagingParam": {
      "number": 2,
      "size": 20,
      "key": null
    },
    "body": [
      {
        "id": "yna_AKR20260310152900008",
        "title": "[표] 거래소 외국인 순매수도 상위종목(10일)",
        "summary": "[표] 거래소 외국인 순매수도 상위종목(10일)\n\n(단위:억원, 만주)\n\n┌─────────────────┬─────────────────┐\n\n│              순매수  ...",
        "contentText": "[표] 거래소 외국인 순매수도 상위종목(10일)\n\n(단위:억원, 만주)\n\n┌─────────────────┬─────────────────┐\n\n│              순매수  ...",
        "imageUrls": [
          "https://static.tossinvest.com/assets/image/detail-news-default/image11.png"
        ],
        "source": {
          "code": "yna",
          "name": "연합뉴스",
          "faviconUrl": "https://static.toss.im/png-icons/timeline/vna-fill.png",
          "logoImageUrl": "https://static.toss.im/png-icons/timeline/vna-light.png",
          "logoImageUrlDark": "https://static.toss.im/png-icons/timeline/vna-dark.png"
        },
        "relatedNews": [],
        "stockCodes": null,
        "stockInfo": null,
        "createdAt": "2026-03-10T15:50:25",
        "updatedAt": "2026-03-10T15:50:25"
      }
    ],
    "lastPage": false
  }
}
```

### 종목 커뮤니티 글 조회

URL: https://wts-cert-api.tossinvest.com/api/v4/comments?subjectType=STOCK&subjectId=KR7015760002&commentSortType=RECENT&lastCommentId=206682660

#### 응답구조

```json
{
  "result": {
    "results": [
      {
        "type": "USER_COMMENT",
        "commentId": 206680768,
        "author": {
          "userProfileId": 7576152,
          "nickname": "정직한라마131",
          "profilePictureUrl": "https://static.toss.im/illusts/img-profile-emoji-16.png",
          "type": "USER",
          "badge": null,
          "shortDescription": "",
          "description": ""
        },
        "parentId": null,
        "message": {
          "title": "",
          "message": "내일 네마녀의날이라 현금좀 확보할게여",
          "representEmoji": ""
        },
        "board": {
          "topic": "한국전력",
          "subjectId": "KR7015760002",
          "subjectType": "STOCK",
          "stockCode": "A015760",
          "logoImageUrl": "https://static.toss.im/png-icons/securities/icn-sec-fill-015760.png"
        },
        "image": null,
        "media": null,
        "statistic": {
          "likeCount": 0,
          "replyCount": 2,
          "repostCount": 0,
          "readCount": 74,
          "followerCount": 1,
          "isLike": false,
          "isBookmarked": false,
          "isFollowing": false,
          "isMyProfile": false
        },
        "vote": null,
        "execution": {
          "stockCode": "A015760",
          "stockName": "한국전력",
          "orderSide": "SELL",
          "quantity": 70.0,
          "amountKrw": 3325000.0,
          "amountUsd": null,
          "averageExecutionPriceKrw": 47500.0,
          "averageExecutionPriceUsd": null,
          "executedAt": "2026-03-10T16:35:24",
          "profitAmountKrw": -7999,
          "profitAmountUsd": null,
          "profitRateKrw": -0.0024,
          "profitRateUsd": null,
          "productType": "KR_STOCK",
          "isSavings": false,
          "isAbnormal": false
        },
        "disclosure": null,
        "holding": {
          "shareHoldingStatus": null
        },
        "edited": false,
        "createdAt": "2026-03-10T16:36:13.19781052+09:00",
        "updatedAt": "2026-03-10T16:36:13.19781052+09:00",
        "isRepost": false,
        "repostComment": null,
        "bestReplyComment": null,
        "accessLevel": "EXTERNAL_PUBLIC",
        "authorUserProfileId": 7576152
      }
    ],
    "key": 206661630,
    "totalCount": 29915,
    "hasNext": true
  }
}
```