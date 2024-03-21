export function flatToNested(array: number[], size: number) {
  return array.reduce(
    (acc, _current, index, array) => {
      if (index % size === 0) {
        // Для каждого элемента с четным индексом (нумерация с 0)
        acc.push(array.slice(index, index + size)) // Добавляем пару в аккумулятор
      }
      return acc
    },
    [] as Array<number[]>,
  )
}
