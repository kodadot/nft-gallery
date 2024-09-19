import { getBioWithLinks, createLink, LINKABLE_BLOCKS } from '@/components/profile/utils'

describe('FARCASTER PROFILE TEST <> getBioWithLinks', (): void => {
  const tChannel = LINKABLE_BLOCKS.find(block => block.id === 'channel').template as (match: string) => string
  const tUser = LINKABLE_BLOCKS.find(block => block.id === 'user').template as (match: string) => string

  it('can correctly format bio links', () => {
    const text = '/koda @user domain.com linktr.ee/koda'
    const expected = `${createLink('/koda', tChannel?.('/koda'))} ${createLink('@user', tUser?.('@user'))} domain.com linktr.ee/koda`
    const result = getBioWithLinks(text)
    expect(result).toEqual(expected)
  })

  it('does not match if matches are inside a link', () => {
    const initial = `${createLink('/koda', tChannel?.('/koda'))} ${createLink('@user', tUser?.('@user'))} domain.com linktr.ee/koda`
    const result = getBioWithLinks(initial)
    expect(result).toEqual(initial)
  })

  it('handles text with multiple spaces correctly', () => {
    const text = '/koda   @user   domain.com   linktr.ee/koda'
    const expected = `${createLink('/koda', tChannel?.('/koda'))}   ${createLink('@user', tUser?.('@user'))}   domain.com   linktr.ee/koda`
    const result = getBioWithLinks(text)
    expect(result).toEqual(expected)
  })

  it('handles text with mixed content', () => {
    const text = 'Welcome /koda! Check out @user and visit linktr.ee/koda for more info.'
    const expected = `Welcome ${createLink('/koda', tChannel?.('/koda'))}! Check out ${createLink('@user', tUser?.('@user'))} and visit linktr.ee/koda for more info.`
    const result = getBioWithLinks(text)
    expect(result).toEqual(expected)
  })

  it('handles edge cases with short and long usernames', () => {
    const shortUser = '@a'
    const longUser = '@thisisareallylongusername'
    const text = `${shortUser} ${longUser}`
    const expected = `${createLink(shortUser, tUser?.(shortUser))} ${longUser}`
    const result = getBioWithLinks(text)
    expect(result).toEqual(expected)
  })

  it('does not modify text inside existing markdown links', () => {
    const text = 'Check out [my channel](social.com/koda) and [my profile](https://warpcast.com/@user).'
    const result = getBioWithLinks(text)
    expect(result).toEqual(text)
  })

  it('returns input text unchanged if no patterns match', () => {
    const text = 'This is a normal text without any special patterns.'
    const expected = text
    const result = getBioWithLinks(text)
    expect(result).toEqual(expected)
  })

  it('handles trailing special characters correctly', () => {
    const text = '/koda! @user? domain.com! linktr.ee/koda$'
    const expected = `${createLink('/koda', tChannel?.('/koda'))}! ${createLink('@user', tUser?.('@user'))}? domain.com! linktr.ee/koda$`
    const result = getBioWithLinks(text)
    expect(result).toEqual(expected)
  })

  it('handles text with markdown syntax mixed with patterns', () => {
    const text = 'Check out /koda and ![image](http://example.com) @user'
    const expected = `Check out ${createLink('/koda', tChannel?.('/koda'))} and ![image](http://example.com) ${createLink('@user', tUser?.('@user'))}`
    const result = getBioWithLinks(text)
    expect(result).toEqual(expected)
  })

  it('handles input with mixed spacing and special characters correctly', () => {
    const text = '/koda   @user!!    domain.com?   linktr.ee/koda'
    const expected = `${createLink('/koda', tChannel?.('/koda'))}   ${createLink('@user', tUser?.('@user'))}!!    domain.com?   linktr.ee/koda`
    const result = getBioWithLinks(text)
    expect(result).toEqual(expected)
  })

  it('handles text with new lines correctly', () => {
    const text = `/koda\n@user\nlinktr.ee/koda`
    const expected = `${createLink('/koda', tChannel?.('/koda'))}\n${createLink('@user', tUser?.('@user'))}\nlinktr.ee/koda`
    const result = getBioWithLinks(text)
    expect(result).toEqual(expected)
  })

  it('handles text with different types of new lines and mixed content', () => {
    const text = '/koda\r\n@user\r\nlinktr.ee/koda\nNew line'
    const expected = `${createLink('/koda', tChannel?.('/koda'))}\r\n${createLink('@user', tUser?.('@user'))}\r\nlinktr.ee/koda\nNew line`
    const result = getBioWithLinks(text)
    expect(result).toEqual(expected)
  })

  it('handles the first match of linkable block', () => {
    const text = '/koda@koda @koda/koda'
    const expected = `${createLink('/koda', tChannel?.('/koda'))}@koda ${createLink('@koda', tUser?.('@koda'))}/koda`
    const result = getBioWithLinks(text)
    expect(result).toEqual(expected)
  })
})
