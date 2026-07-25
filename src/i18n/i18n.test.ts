import i18n from './config'

describe('i18n', () => {
  it('resolves english translation keys', () => {
    expect(i18n.t('app.name')).toBe('Flying Fridge')
    expect(i18n.t('skip.toContent')).toBe('Skip to main content')
  })

  it('falls back to the key when it is missing', () => {
    expect(i18n.t('does.not.exist')).toBe('does.not.exist')
  })
})
