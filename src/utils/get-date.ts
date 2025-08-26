export const getDate = (dateString: string) => {
  const date = new Date(dateString)

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: process.env.TZ || 'UTC',
  })
}
