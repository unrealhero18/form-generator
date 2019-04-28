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

  // private methods
  _attrValidate( attr, value ) {
    const { code, multiple, type, validation } = attr;
    let result = null;

    // clean up prev messages
    this._errors[ code ] = multiple
      ? new Array( value.length ).fill( '' )
      : '';

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

  _addValidator( name, f ) {
    this._validators[ name ] = f;
  }

  /* eslint-disable no-loop-func */
  _evalVariables( text, rule, option ) {
    const regexp = /\$\$[^$]*\$\$/g;
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

    return text
  }
  /* eslint-enable no-loop-func */

  _humanizeDate( date ) {
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();

    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    return `${day}/${month}/${year}`;
  }

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

  _isObject( object ) {
    return object === Object( object );
  }

  _test( rule, param, value, type ) {
    const validator = this._validators[ rule ];

    if ( typeof validator === 'function' ) {
      return validator( value, param, type );
    }
  }

  _setError( code, rule, option, index ) {
    const { _errors: errors } = this;

    const message = this._evalVariables( this._messages[ rule ], rule, option );

    if ( index !== undefined ) {
      if ( errors[ code ] ) {
        errors[ code ][ index ] = message;
      }
    } else {
      errors[ code ] = message;
    }

    // validation fail
    this._errors.isValid = false;
  }

  // public methods
  addValidator( name, validator, message ) {
    this._messages[ name ] = message;
    this._addValidator( name, validator );
  }

  validate( form, state ) {
    if ( ! this._isObject( form ) && ! this._isObject( state ) ) return;

    if ( 'attributes' in form ) {
      const { attributes } = form;

      this._errors = {
        isValid: true
      };

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
