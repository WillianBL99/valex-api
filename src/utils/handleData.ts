export function getCurrentData() {
  const currentMonth = new Date().getMonth();
  const currentFullYear = new Date().getFullYear();
  const currentYear = currentFullYear % 100;

  return { currentMonth, currentYear, currentFullYear };
}

export function parseDataToInt( month: string, year: string ) {
  return { month: parseInt(month), year: parseInt(year) };
}