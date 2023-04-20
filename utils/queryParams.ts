export function getCollectionIds(): string[] {
  const route = useRoute()
  return (route.query.collections as string)?.split(',') || []
}
