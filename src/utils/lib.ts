
const ALLOWED_DIRECTIONS = ['asc', 'desc'];

export function parsePrismaOrderBy(sortInput: string) {
  if (!sortInput) return [];
  const rawPairs = typeof sortInput === 'string' 
    ? sortInput.split(',') 
    : sortInput;

  const orderByArray = [];

  for (const pair of rawPairs) {
    const [field, direction] = pair.split(':');
    
    if (ALLOWED_DIRECTIONS.includes(direction)) {
      orderByArray.push({ [field]: direction });
    }
  }

  return orderByArray;
}