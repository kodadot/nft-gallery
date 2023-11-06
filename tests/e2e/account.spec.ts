import { expect, test } from './fixtures'

test('Verify if the right account is loaded', async ({ page, Commands }) => {
  await Commands.e2elogin()
  const accVerification = await page
    .getByTestId('avatar-identity-icon')
    .getAttribute('data-key')
  await expect(accVerification).toBe(
    'CmWHiv7h4m9tEzKD94DH4mqwGTvsdYQe2nouWPF7ipmHpqA',
  )
})
