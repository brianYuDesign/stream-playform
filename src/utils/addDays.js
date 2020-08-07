export default (date, days) => {
  const result = new Date(date)
  return result.setDate(result.getDate() + days)
}
