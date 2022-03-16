/**
 * @jest-environment jsdom
 */

import { getHighestPriceFromEvent } from '@/utils/math'
import { buyEvents } from '../sample4'

describe('UTILS MATH TEST', (): void => {
  it('TEST getHighestPriceFromEvent', () => {
    expect(getHighestPriceFromEvent(buyEvents)).toBe(49980000000000)
    expect(
      getHighestPriceFromEvent([
        ...buyEvents,
        {
          meta: '10980000000000',
          interaction: 'BUY',
          blockNumber: '10200330',
          timestamp: '2021-11-22T04:20:30.031Z',
          caller: 'FP7Tvuid4tf1aeX9oGLedshiHSaFEQtEMSEDAcDExG8H3GA',
          id: '10194628-800f8a914281765a7d-KITTY-KITTY_PARADISE_189-0000000000000189-BUYvHw1gKZcKq80szXLrsUp2',
        },
      ])
    ).toBe(49980000000000)

    expect(
      getHighestPriceFromEvent([
        ...buyEvents,
        {
          meta: '59980000000000',
          interaction: 'BUY',
          blockNumber: '10200330',
          timestamp: '2021-11-22T04:20:30.031Z',
          caller: 'FP7Tvuid4tf1aeX9oGLedshiHSaFEQtEMSEDAcDExG8H3GA',
          id: '10194628-800f8a914281765a7d-KITTY-KITTY_PARADISE_189-0000000000000189-BUYvHw1gKZcKq80szXLrsUp2',
        },
      ])
    ).toBe(59980000000000)
  })
})
