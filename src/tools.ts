export function arrayToHex(array: number[]) {
    // Преобразование массива в строку из 0 и 1
    const binaryString = array.join('');
  
    // Преобразование бинарной строки в шестнадцатеричное представление
    const hexString = parseInt(binaryString, 2).toString(16);
  
    // Сохраняем длину исходного бинарного массива для восстановления ведущих нулей
    return hexString + ',' + array.length;
  }
  
  export function hexToArray(hexString: string) {
    // Разделяем шестнадцатеричную строку и длину исходного массива
    const [hex, length] = hexString.split(',');
  
    // Преобразование шестнадцатеричной строки в бинарную
    let binaryString = parseInt(hex, 16).toString(2);
  
    // Добавляем ведущие нули, если длина бинарной строки меньше исходной длины массива
    while (binaryString.length < Number(length)) {
      binaryString = '0' + binaryString;
    }
  
    // Преобразование бинарной строки обратно в массив из 0 и 1
    return binaryString.split('').map(bit => parseInt(bit, 10));
  }