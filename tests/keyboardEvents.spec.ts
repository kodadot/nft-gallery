import { shouldIgnoreKeyDownEvent } from '@/utils/keyboardEvents'

describe('should ignore keyDown event TEST', (): void => {
  it('should ignore keyDown in input', () => {
    const target = document.createElement('input')
    const event = new KeyboardEvent('keydown', { key: 'g' })
    target.dispatchEvent(event)
    expect(shouldIgnoreKeyDownEvent(event)).toBe(true)
  })

  it('should ignore keyDown in textarea', () => {
    const target = document.createElement('textarea')
    const event = new KeyboardEvent('keydown', { key: 'g' })
    target.dispatchEvent(event)
    expect(shouldIgnoreKeyDownEvent(event)).toBe(true)
  })

  it('should not ignore keyDown', () => {
    const target = document.createElement('body')
    const event = new KeyboardEvent('keydown', { key: 'g' })
    target.dispatchEvent(event)
    expect(shouldIgnoreKeyDownEvent(event)).toBe(false)
  })
})
