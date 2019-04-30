## Загальні відомості:

* Технологія [ReactJS](https://reactjs.org/)
* Додаток на основі [Create React App](https://github.com/facebook/create-react-app)
* UI бібліотека [semantic-ui-react](https://react.semantic-ui.com/)
* Плагін календаря [react-datepicker](https://reactdatepicker.com/)
* [Бриф](https://github.com/unrealhero18/form-generator/blob/master/BRIEF.md)

## Початок роботи

* `cd ./project-folder` - перехід в папку з проектом
* `npm install` - встановлення залежностей
* `npm start` - запус в dev режимі
* `npm run build` - збірка в production режимі

## Структура

* `src/components/GeneratedForm` - неймспейс компонента генерації форми
  * `/GeneratedForm.js` - компонент форми
  * `/fields/GeneratedField.js` - компонент поля
  * `/fields/EnumField.js` - компонент поля типу (`enum`)
  * `/fields/MultipleGeneratedFields.js` - компонент поєднуючий (`multiple`) поля
  * `/messages/InlineError.js` - компонент для сповіщення помилок валідації
* `src/lib/Validation.js` - бібліотека валідації
* `src/utils/fixtures.js` - початкові дані
* `src/utils/generateHierarchicOptionsList.js` - функція для побудови ієрархічного списку

## Для того щоб додати новий вид валідації:

Використати метод `Validator.prototype.addValidator( name, callback, message )`:
* `name` - ім'я для валідатора
* `callback` - функція яка виконує валідацію поля. Отримує 3 параметра:
  * `value` - значення поля
  * `option` - параметр валідації
  * `type` - тип атрибуту (`int, string, date...`)
* `message` - повідомлення при помилці ( при використанні конструкції `$$validatorName$$`, цей вираз буде підмінено параметром `option` )

```js
constructor( props ) {
  super( props );

  this.validation = new Validation();
  this.validator.addValidator( 'step', function( value, option, type ) {
    if ( ! value ) {
      return true;
    } else if ( type !== 'int' ) {
      return true;
    } else {
      return value % option === 0;
    }
  }, 'Допустимий крок для значень $$step$$' );
}
```
Або додати валідатор в тілі приватного методу `_initValidators` в бібліотеці `Validation.js`:
```js
_initValidators() {
  this._addValidator( 'required', function( value, enable ) {
    if ( ! enable ) {
      return true;
    } else {
      return !!value;
    }
  });
}
```
_Примітка: при конфігурації min/max для типу date очікується Date об'єкт_

## Для того щоб додати новий тип атрибута:

Необхідно розширити логіку в компоненті `GeneratedField.js`.
Опис атрибутів:
* `error` _(boolean)(required)_ - повідомлення про помилку валідації
* `name` _(string)(required)_ - ім'я для поля
* `title` _(string)(optional)_ - текст для <label>
* `placeholder` _(string)(optional)_ - текст для placeholder
* `value` _(any)(required)_ - значення для поля ( контролюється за допомогою React state )
* `onChange` _(function)(equired)_ - обробник взаємодії з полем
  * `onChange` - для звичайних текстових полів
  * `onChangeDate` - для datapicker
  * `onChangeNumber` - для числових полів ( int|float )
  * `onCheck`- для checkboxes
  * `onSelect` - для selects

```js
<Fragment>
    {/* START:Custom attributes types */}

    { type === 'textarea' && (
      <Form.Field
        className='generated-field _textarea'
        control='textarea'
        error={!!error}
        label={title}
        name={code}
        onChange={onChange}
        rows='3'
        placeholder={title}
        value={data}
      />
    )}

    {/* END:Custom attributes types */}
</Fragment>
```
_Інші доступні елементи [Form](https://react.semantic-ui.com/collections/form/)_
