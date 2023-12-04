export const useShopVoucherIcon = () => {
  const { isDarkMode } = useTheme()

  const voucherIcon = computed(() =>
    isDarkMode.value ? '/signup-voucher-dark.svg' : '/signup-voucher.svg',
  )

  return { voucherIcon }
}
