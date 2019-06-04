(() => {
  const Timer = {

    // Функция создания объекта "Таймер""
    create(el) {
      this.$el = document.querySelector(el);
      this.mins = 0;
      this.secs = 0;
      this.msecs = 0;
      this.intervalMsecs = null;
      this.intervalMins = null;
      this.intervalSecs = null;
      this.isRun = false;
    },

    // Функция добавления нулей заполнителей перед цифрами
    addZeros(num, numDigit) {
      const nLength = numDigit || 2;
      let n = String(num);
      while (n.length < nLength) {
        n = `0${n}`;
      }
      return n;
    },

    // Функция возвращающая текущее значение таймера
    currentValue() {
      return `${Timer.addZeros(Timer.mins)}:${Timer.addZeros(Timer.secs)}.${Timer.addZeros(Timer.msecs, 3)}`;
    },

    // Функция отображения изменения значения таймера
    displayChange() {
      Timer.$el.innerHTML = `<b>${Timer.currentValue()}</b>`;
    },

    // Функция изменения значения таймера
    change() {
      if (Timer.msecs < 1000) {
        Timer.msecs += 1;
      } else {
        Timer.msecs = (Timer.msecs % 1000) + 1;
        if (Timer.secs < 60) {
          Timer.secs += 1;
        } else {
          Timer.secs = (Timer.secs % 60) + 1;
          Timer.mins += 1;
        }
      }
      Timer.displayChange();
    },

    // Функция сброса значения таймера
    reset() {
      Timer.msecs = 0;
      Timer.secs = 0;
      Timer.mins = 0;
      Timer.displayChange();
    },

    // Функция зайпуска таймера
    start() {
      console.log('Timer.start');
      clearInterval(Timer.interval);
      Timer.interval = setInterval(Timer.change, 1);
      Timer.isRun = !Timer.isRun;
    },

    // Функция остановки таймера
    stop() {
      console.log('Timer.stop');
      clearInterval(Timer.interval);
      Timer.isRun = !Timer.isRun;
      Timer.displayChange();
    },

  }; // Timer End

  const Field = {

    // Функция создания элемента массива элементов (ячеек) игрового поля
    createElement(color) {
      const $el = document.createElement('div');
      $el.classList.add('cell', 'hidden');
      const obj = {
        el: $el,
        color,
      };
      return obj;
    },

    // Функция генерации массива элементов игрового поля
    generate(colors) {
      const result = [];
      for (let i = 0; i < colors.length; i++) {
        const color = colors[i];
        result.push(this.createElement(color));
      }
      return result;
    },

    // Функция генерации случайного целого числа
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },

    // Функция перемешивания элементов массива
    mix(inputArray) {
      const resultArray = inputArray;
      let j;
      let temp;
      for (let i = 0; i < resultArray.length; i++) {
        j = this.getRandomInt(0, 16);
        temp = resultArray[i];
        resultArray[i] = resultArray[j];
        resultArray[j] = temp;
      }
      return resultArray;
    },

    // Функция перемешивания массива элементов (ячеек) игрового поля
    shuffle(inputArray) {
      this.colors = this.mix(inputArray);
    },

    // Функция отображения игрового поля
    display() {
      for (let i = 0; i < this.cells.length; i++) {
        this.$el.append(this.cells[i].el);
      }
    },

    // Функция создания объекта игрового поля
    create(el) {
      this.$el = document.querySelector(el);
      this.colors = ['gray', 'black', 'red', 'orange', 'yellow', 'green', 'blue', 'purple'];
      this.shuffle(this.colors.concat(this.colors));
      this.cells = this.generate(this.colors);
      this.countPairsFound = 0;
      this.isSecondClick = false;
      this.prevSelectElement = null;
      this.selectElement = null;
      this.selectColor = null;
      this.index = null;
      this.moves = 0;
      this.display();
    },

    // Функция добавления обработчика события клика по ячейке
    binding(handleClick) {
      for (let i = 0; i < this.cells.length; i++) {
        this.cells[i].el.addEventListener('click', handleClick);
      }
    },

    // Функция удаления обработчика события клика по ячейке
    unbinding(handleClick) {
      for (let i = 0; i < this.cells.length; i++) {
        this.cells[i].el.removeEventListener('click', handleClick);
      }
    },

    // Функция сброса фона у всех ячеек игрового поля
    bgResetAll() {
      for (let i = 0; i < this.cells.length; i++) {
        this.cells[i].el.classList = '';
        this.cells[i].el.classList.add('cell', 'hidden');
      }
    },

    // Функция сброса параметров игры до изначальных (до нажатия на кнопку "Старт")
    reset() {
      this.countPairsFound = 0;
      this.isSecondClick = false;
      this.prevSelectElement = null;
      this.selectElement = null;
      this.selectColor = null;
      this.index = null;
      this.moves = 0;
      this.bgResetAll();
      this.unbinding(this.handleClick);
      this.display();
    },

    // Функция запуска игры
    start() {
      this.reset();
      this.binding(this.handleClick);
      this.display();
    },

    // Функция поиска индекса выбранного (кликнутого) элемента (ячейки) в массиве
    // элементов игрового поля
    findInCells() {
      let result;
      for (let i = 0; i < this.cells.length; i++) {
        if (this.cells[i].el === this.selectElement) {
          result = i;
          break;
        }
      }
      return result;
    },

    // Функция, содержащая логику для обработки второго клика
    ifSecondClick() {
      // Если это клик по другой ячейке (2-й клик) и если их цвета совпадают, то
      // увеличиваем кол-во найденных пар на единицу, если кол-во найденных пар
      // равно восьми, то игра окончена на экран выводится результат и поздравление.
      // Если цвета различаются, то обе ячейки скрываются.
      // Если это первый клик, то запоминаем выбранный элемент, его цвет и ставим
      // флаг "true" в "isSecondClick", чтобы при 2-ом клике, начать сравнивать
      // ячейки игрового поля на цвета.
      if (Field.isSecondClick) {
        Field.isSecondClick = false;
        if (Field.cells[Field.index].color === Field.selectColor) {
          Field.countPairsFound += 1;
          if (Field.countPairsFound === 8) {
            Timer.stop();
            const record = Timer.currentValue();
            const winText = `Вы выйграли! Кол-во ходов: ${Field.moves}\nВаше время: ${record}`;
            Timer.displayChange();
            alert(winText);
            Field.reset();
            Timer.reset();
            Button.$el.innerText = 'Старт';
          }
        } else {
          Field.prevSelectElement.classList.add('hidden');
          Field.selectElement.classList.add('hidden');
        }
      } else {
        Field.selectColor = Field.cells[Field.index].color;
        Field.prevSelectElement = Field.selectElement;
        Field.isSecondClick = true;
      }
    },

    // Функция-обработчик события клика по ячейке
    handleClick(event) {
      // Запоминаем выбранный элемент и находим его индекс в массиве элементов
      // игрового поля, чтобы узнать и присвоить соответствующий цвет
      Field.selectElement = event.target;
      Field.index = Field.findInCells();

      // Если элемент скрыт, то открываем его (присваиваем фону выбранного эл-та
      // соответствующий цвет), запоминаем ход, ждём следующего клика, если цвета
      // не равны, то через 250 мс скрываем оба элемента
      if (Field.selectElement.classList.contains('hidden')) {
        Field.moves += 1;
        Field.selectElement.classList.remove('hidden');
        Field.selectElement.classList.add(Field.cells[Field.index].color);
        setTimeout(Field.ifSecondClick, 250);
      }
    },

  }; // Field End

  let Button = {

    // Функция создания объекта кнопки
    create(el) {
      this.$el = document.querySelector(el);
      this.setup();
    },

    // Функция установки функции-обработчика на событие клика по кнопке "Старт"
    setup() {
      this.$el.addEventListener('click', () => {
        console.log('Button.click');
        Field.start();
        if (!Timer.isRun) {
          Timer.start();
          Button.$el.innerText = 'Стоп';
        } else {
          Field.reset();
          Timer.stop();
          Timer.reset();
          Button.$el.innerText = 'Старт';
        }
      });
    },

  }; // Button End

  Field.create('.field');
  Timer.create('.timer');
  Button.create('.start');
})();
