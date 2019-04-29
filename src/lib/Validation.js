const EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class Validation {
  constructor() {
    this._errors = {};
    this._validators = {};

    this._initValidators();

    this._messages = {
      required: 'Обов\'язкове поле',
      pattern: 'Некоректний формат',
      email: 'Некоректний формат email адреси',
      min: 'Мінімальне можливе значення: $$min$$',
      max: 'Максимальне можливе значення: $$max$$',
      minlength: 'Мінімальна кількість символів: $$minlength$$',
      maxlength: 'Максимальна кількість символів: $$maxlength$$',
    }
  }

  //** PRIVATE METHODS **/


  /**
   * _attrValidate - Validate the single attribute or multiple attribute.
   *
   * @param  {object} attr The form attribute
   * @param  {string} attr.code The attribute name
   * @param  {boolean} attr.multiple Does attribute can have the few fields
   * @param  {string?} attr.type The type of data. Availabe: int, float, string( default ), date, boolean, enum
   * @param  {object?} attr.validation The validation rules
   * @param  {boolean} attr.validation.required Makes the element required
   * @param  {regexp} attr.validation.pattern Makes the element require a valid pattern
   * @param  {string} attr.validation.email Makes the element require a valid email
   * @param  {number} attr.validation.min Makes the element require a given minimum
   * @param  {number} attr.validation.max Makes the element require a given maximum.
   * @param  {number} attr.validation.minlength Makes the element require a given minimum length
   * @param  {number} attr.validation.maxlength Makes the element require a given maximum length
   * @param  {*} value The value of related field|fields
   * @return {null}
   */
  _attrValidate( attr, value ) {
    const { code, multiple, type, validation } = attr;
    let result = null;

    // clean up prev messages
    this._errors[ code ] = multiple
      ? new Array( value.length ).fill( '' )
      : '';

    // loop through validation rules
    Object.keys( validation ).forEach( rule => {
      const ruleParam = validation[ rule ];

      if ( multiple ) {

        value instanceof Array && value.forEach( ( value, index ) => {
          result = this._test( rule, ruleParam, value, type );

          if ( ! result ) {
            this._setError( code, rule, ruleParam, index );
          }
        });

      } else {

        result = this._test( rule, ruleParam, value, type );

        if ( ! result ) {
          this._setError( code, rule, ruleParam );
        }

      }
    });
  }


  /**
   * _addValidator - This method adding validators
   *
   * @param  {string} name The validator name
   * @param  {function} f    The validator function
   * @return {null}
   */
  _addValidator( name, f ) {
    this._validators[ name ] = f;
  }

  /**
   * _evalVariables - This method allow generate the dynamic error messages. $$validatorName$$ replacing by validator option
   *
   * @param  {string} text The raw message
   * @param  {*} option The value that will used to replacement
   * @return {string} - Returning the compiled text or the same text if variables not presented
   */
  _evalVariables( text, option ) {
    /* eslint-disable no-loop-func */
    const regexp = /\${2}[^$]*\${2}/;
    let matched;

    // date to human format
    if ( option instanceof Date ) {
      option = this._humanizeDate( option );
    }

    while ( ( matched = regexp.exec( text ) ) !== null ) {
      if ( matched.index === regexp.lastIndex ) {
        regexp.lastIndex++;
      }

      matched.forEach( match => {
        text = text.replace( match, option );
      })
    }

    return text;
    /* eslint-enable no-loop-func */
  }


  /**
   * _humanizeDate - Tranfrom js Date to convenient format
   *
   * @param  {date} date
   * @return {string} - Example ( 01/01/2018 )
   */
  _humanizeDate( date ) {
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();

    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    return `${day}/${month}/${year}`;
  }


  /**
   * _initValidators - Initializing the default validators
   *
   * @return {null}
   */
  _initValidators() {
    this._addValidator( 'required', function( value, enable ) {
      if ( ! enable ) {
        return true;
      } else {
        return !!value;
      }
    });

    this._addValidator( 'pattern', function( value, pattern ) {
      if ( ! value ) {
        return true;
      } else {
        const regexp = new RegExp( pattern );
        return regexp.test( value );
      }
    });

    this._addValidator( 'email', function( email, enable ) {
      if ( ! enable ) {
        return true;
      } else if ( ! email ) {
        return true;
      } else {
        return EMAIL_REGEXP.test( String( email ).toLowerCase() );
      }
    });

    this._addValidator( 'min', function( value, minValue, type = 'string' ) {
      if ( type !== 'int' && type !== 'float' && type !== 'date' ) {
        return true;
      } else if ( ! value ) {
        return true;
      } else {
        if ( type === 'date' ) {
          return value.getTime() >= minValue.getTime();
        } else {
          return value >= minValue;
        }
      }
    });

    this._addValidator( 'max', function( value, maxValue, type = 'string' ) {
      if ( type !== 'int' && type !== 'float' && type !== 'date' ) {
        return true;
      } else if ( ! value ) {
        return true;
      } else {
        if ( type === 'date' ) {
          return value.getTime() <= maxValue.getTime();
        } else {
          return value <= maxValue;
        }
      }
    });

    this._addValidator( 'minlength', function( value, length, type = 'string' ) {
      if ( type !== 'string' ) {
        return true;
      } else if ( ! value ) {
        return true;
      } else {
        return value.length >= length;
      }
    });

    this._addValidator( 'maxlength', function( value, length, type = 'string' ) {
      if ( type !== 'string' ) {
        return true;
      } else if ( ! value ) {
        return true;
      } else {
        return value.length <= length;
      }
    })
  }


  /**
   * _isObject - Check if argument is object
   *
   * @param  {object} object The object to check
   * @return {boolean} - Result of checking
   */
  _isObject( object ) {
    return object === Object( object );
  }


  /**
   * _test - Test the value via validator
   *
   * @param  {string} rule  The validator name
   * @param  {*} param The validator option
   * @param  {*} value Field's value for test
   * @param  {string?} type The type of value. Availabe: int, float, string( default ), date, boolean, enum
   * @return {boolean} - The test result
   */
  _test( rule, param, value, type ) {
    const validator = this._validators[ rule ];

    if ( typeof validator === 'function' ) {
      return validator( value, param, type );
    }
  }


  /**
   * _setError - Commit the error message with related field.
   *
   * @param  {string} code The attribute name
   * @param  {string} rule The validator name
   * @param  {*} option The validator option
   * @param  {number?} index The array element of multiple field
   * @return {null}
   */
  _setError( code, rule, option, index ) {
    const { _errors: errors } = this;

    const message = this._evalVariables( this._messages[ rule ], option );

    if ( index !== undefined ) {
      if ( errors[ code ] ) {
        errors[ code ][ index ] = message;
      }
    } else {
      errors[ code ] = message;
    }

    // set validation status as `fail`
    this._errors.isValid = false;
  }

  //** PUBLIC METHODS **/

  /**
   * addValidator - Allow to extend default validators
   *
   * @param  {string} name Custom validator name
   * @param  {function} validator Custom validator callback
   * @param  {string} message Custom validator fail message
   * @return {null}
   */
  addValidator( name, validator, message ) {
    this._messages[ name ] = message;
    this._addValidator( name, validator );
  }


  /**
   * validate - Validate form data
   *
   * @param  {object} form Contains the form fields config ( field name, data type, validation rules )
   * @param  {object} state Filled form data from React state
   * @return {object} Return the object with fields names as keys and error messages as values
   */
  validate( form, state ) {
    if ( ! this._isObject( form ) && ! this._isObject( state ) ) return;

    if ( 'attributes' in form ) {
      const { attributes } = form;

      // This field is valid until the first error
      this._errors = {
        isValid: true
      };

      // Loop through attributes
      attributes.forEach( attr => {
        const { code, validation } = attr;

        if ( validation ) {
          const value = state[ code ];
          this._attrValidate( attr, value );
        }
      });
    }

    return this._errors;
  }
};

export default Validation;
