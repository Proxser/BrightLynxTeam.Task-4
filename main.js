// Массив ячеек шахматной доски
const chessboard = document.querySelectorAll('.cell');

// Функция конвертации (преобразования) индекса вида "n" к виду "i, j"
function convertToXY(value) {
  return [parseInt(value / 8, 10), parseInt(value % 8, 10)];
}

// Функция конвертации (преобразования) индекса вида "i, j" к виду "n"
function convertXYToIndex(arr) {
  return parseInt((arr[0] * 8) + arr[1], 10);
}

// Функция сброса цветов ячеек шахматной доски до изначального
function resetChessboard() {
  // Проходим массив (по i, j), конвертируем i и j в целочисленный индекс
  // ячейчки в массиве "chessboard", создаём массив в котором будем хранить,
  // добавляемые к ячейке CSS-классы, если по строка нечётная, то цвета ячеек
  // начинают чередоваться с белого цвета, иначе с чёрного
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const x = convertXYToIndex([i, j]);
      const classes = ['cell'];
      const ifY = i % 2 !== 0;
      const ifX = j % 2 !== 0;

      chessboard[x].classList = '';

      if (ifY) {
        if (!ifX) {
          classes.push('black');
        } else {
          classes.push('white');
        }
      } else if (ifX) {
        classes.push('black');
      } else {
        classes.push('white');
      }

      chessboard[x].classList = classes.join(' ');
    }
  }
}

// Функция нахождения всех возможных ходов конём
function horseSteps(arr) {
  const x = arr[1];
  const y = arr[0];
  const result = [];

  const topLeft = (y - 2) >= 0 && (x - 1) >= 0;
  const topRight = (y - 2) >= 0 && (x + 1) <= 7;

  const leftTop = (x - 2) >= 0 && (y - 1) >= 0;
  const leftBottom = (x - 2) >= 0 && (y + 1) <= 7;

  const rightTop = (x + 2) <= 7 && (y - 1) >= 0;
  const rightBottom = (x + 2) <= 7 && (y + 1) <= 7;

  const bottomLeft = (y + 2) <= 7 && (x - 1) >= 0;
  const bottomRight = (y + 2) <= 7 && (x + 1) <= 7;

  if (topLeft) result.push(convertXYToIndex([y - 2, x - 1]));
  if (topRight) result.push(convertXYToIndex([y - 2, x + 1]));

  if (rightTop) result.push(convertXYToIndex([y - 1, x + 2]));
  if (rightBottom) result.push(convertXYToIndex([y + 1, x + 2]));

  if (bottomRight) result.push(convertXYToIndex([y + 2, x + 1]));
  if (bottomLeft) result.push(convertXYToIndex([y + 2, x - 1]));

  if (leftTop) result.push(convertXYToIndex([y - 1, x - 2]));
  if (leftBottom) result.push(convertXYToIndex([y + 1, x - 2]));

  return result;
}

// Добавления обработчика события на клик по ячейке шахматной доски
for (let i = 0; i < chessboard.length; i++) {
  chessboard[i].addEventListener('click', (event) => {
    // Очищаем поле, находим индекс кликнутого элемента в массиве ячеек доски,
    // чтобы успешно найти все возможные ходы коня из данной ячейки, окрашиваем
    // выбранную ячейку в синий, а возможные ходы в зелёный
    let index;
    resetChessboard();

    for (let j = 0; j < chessboard.length; j++) {
      if (chessboard[j] === event.target) {
        index = j;
        break;
      }
    }

    event.target.classList.add('blue');
    const horsesteps = horseSteps(convertToXY(index));

    for (let j = 0; j < horsesteps.length; j++) {
      chessboard[horsesteps[j]].classList.add('green');
    }
  });
}
