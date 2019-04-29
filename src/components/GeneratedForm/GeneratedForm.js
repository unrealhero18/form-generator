import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Container, Divider, Form, Grid } from 'semantic-ui-react';
import { GeneratedField, MultipleGeneratedFields } from './fields';
import Validation from '../../lib/Validation';
import { registerLocale } from 'react-datepicker';
import uk from 'date-fns/locale/uk';
import './GeneratedForm.css';

// register ukrainian locale for `react-datepicker`
registerLocale( 'uk', uk );

class GeneratedForm extends PureComponent {
  constructor( props ) {
    super( props );

    this.events.onChange = this.events.onChange.bind( this );
    this.events.onChangeDate = this.events.onChangeDate.bind( this );
    this.events.onChangeNumber = this.events.onChangeNumber.bind( this );
    this.events.onCheck = this.events.onCheck.bind( this );
    this.events.onSelect = this.events.onSelect.bind( this );
    this.events.onSubmit = this.events.onSubmit.bind( this );
    this.updateData = this.updateData.bind( this );
    this.updateMultipleData = this.updateMultipleData.bind( this );
    this.updateMultipleFields = this.updateMultipleFields.bind( this );

    // initialization the form fields for React state
    const { formData } = props;
    let formCollection = {};

    if ( 'attributes' in formData ) {
      const { attributes } = formData;

      attributes instanceof Array && attributes.forEach( attr => {
        if ( attr.multiple ) {
          formCollection[ attr.code ] = [''];
        } else {
          formCollection[ attr.code ] = '';
        }
      });
    }

    this.state = {
      data: {
        ...formCollection
      },
      errors: {
        ...formCollection
      }
    }

    // initialization form validation
    this.validation = new Validation();
  }

  // there are object that contain all event handlers
  events = {
    /**
     * onChange - provide controlled string inputs
     *
     * @param  {object} e React SyntheticEvent
     * @param  {string} e.target.name Field name
     * @param  {string} e.target.value Field value
     * @return {null}
     */
    onChange( e ) {
      const { name, value } = e.target;
      const arrayIndex = this.getArrayIndex( name );

      if ( arrayIndex ) {
        this.updateMultipleData( arrayIndex, value );
      } else {
        this.updateData( name, value );
      }
    },

    /**
     * onChangeDate - provide controlled date inputs
     *
     * @param  {?date} value typed or selected from datepicker date
     * @param  {string} name  field name
     * @return {null}
     */
    onChangeDate( value, name ) {
      if ( ! value || ! value instanceof Date ) {
        value = '';
      }

      const arrayIndex = this.getArrayIndex( name );

      if ( arrayIndex ) {
        this.updateMultipleData( arrayIndex, value );
      } else {
        this.updateData( name, value );
      }
    },

    /**
     * onChangeNumber - provide controlled int||float inputs
     *
     * @param  {object} e React SyntheticEvent
     * @param  {string} e.target.name Field name
     * @param  {string} e.target.value Field value ( used type="text" )
     * @param  {string} type Type of data ( int || float )
     * @return {null}
     */
    onChangeNumber( e, type ) {
      let { name, value } = e.target;

      // allow typing only numbers ( int || float )
      if ( value ) {
        let regexp = null;

        if ( type === 'float' ) {
          regexp = /^-?\d*?\.?\d*$/;
        } else if ( type === 'int' ) {
          regexp = /^-?\d*$/;
        }

        if ( regexp ) {
          const matchedValue = value.match( regexp );
          value = matchedValue ? matchedValue[ 0 ] : this.state.data[ name ];
        }
      }

      const arrayIndex = this.getArrayIndex( name );

      if ( arrayIndex ) {
        this.updateMultipleData( arrayIndex, value );
      } else {
        this.updateData( name, value );
      }
    },


    /**
     * onCheck - provide controlled boolean inputs
     *
     * @param  {object} [e] React SyntheticEvent
     * @param  {object} data The state of checkbox field
     * @param  {string} data.name The name of checkbox field
     * @param  {boolean} data.checked The checked state of checkbox field
     * @return {null}
     */
    onCheck( e, data ) {
      this.updateData( data.name, data.checked );
    },


    /**
     * onSelect - provide controlled enum inputs
     *
     * @param  {object} [e] React SyntheticEvent
     * @param  {object} selectOptions The state of selected option
     * @param  {string} selectOptions.name The name of select field
     * @param  {(string|number)} selectOptions.value The selected option value
     * @return {null}
     */
    onSelect( e, selectOptions ) {
      const { name, value } = selectOptions;
      const arrayIndex = this.getArrayIndex( name );

      if ( arrayIndex ) {
        this.updateMultipleData( arrayIndex, value );
      } else {
        this.updateData( name, value );
      }
    },

    /**
     * onSubmit - handle form submit
     *
     * @param  {object} e React SyntheticEvent
     * @return {null}
     */
    onSubmit( e ) {
      e.preventDefault();

      const { formData: form } = this.props;
      const { errors: stateErrors, data: stateData } = this.state;

      // validate form
      const errors = this.validation.validate( form, stateData );

      // update errors state
      this.setState( () => {
        return {
          errors: {
            ...stateErrors,
            ...errors
          }
        }
      });

      if ( errors.isValid ) {
        // prepare data to print
        let printData = Object.assign( {}, stateData );

        form.attributes instanceof Array && form.attributes.forEach( attr => {
          const { code, type } = attr;
          const field = printData[ code ];

          if ( type === 'date' ) {

            // convert value to ISO-8601 format if `date` is valid
            if ( field && field instanceof Date ) {
              field.setHours( '12' );
              printData[ code ] = field.toISOString();
            }

          } else if ( type === 'int' || type === 'float' ) {

            // convert value to `number` format if it's valid
            if ( field !== '' ) {

              if ( isNaN( Number( field ) ) ) {
                printData[ code ] = '';
              } else {
                printData[ code ] = Number( field );
              }

            }

          }
        });

        // print form to console
        console.log( printData );
      }
    }
  }


  /**
   * getArrayIndex - Check if field's name contains Array literal `[]`.
   *
   * @param  {string} name The field's name which will check
   * @return {(object|null)} - with success return: `code` as input name; `index` as literal entry, in other words array element;
   */
  getArrayIndex( name = '' ) {
    const matched = name.match( /\[.d?\]/g );

    if ( matched ) {
      const arrayLiteral = matched[ 0 ];

      return {
        code: name.slice( 0, name.indexOf( arrayLiteral ) ),
        index: arrayLiteral.slice( 1, -1 ) * 1
      }
    }

    return null;
  }


  /**
   * updateData - update single field data in React state
   *
   * @param  {string} name The field's name
   * @param  {*} value The field's value
   * @return {null}
   */
  updateData( name, value ) {
    if ( ! name ) return;

    this.setState( () => {
      return {
        data: {
          ...this.state.data,
          [ name ]: value
        }
      }
    });
  }


  /**
   * updateMultipleData - update one of multiple fields data in React state
   *
   * @param  {object} arrayIndex The object that may to recognize necessary field
   * @param  {string} code The field's name
   * @param  {number} index The index of array element
   * @param  {*} value The field's value
   * @return {null}
   */
  updateMultipleData( arrayIndex, value ) {
    const { code, index } = arrayIndex;
    const { data } = this.state;

    const currentData = data[ code ].concat();
    currentData[ index ] = value;
    this.updateData( code, currentData );
  }


  /**
   * updateMultipleFields - This method reduce or increase the count of multiple fields in React state
   *
   * @param  {string} action The type of action that should to do ( remove || add )
   * @param  {string} name The field's name
   * @param  {?number} index The field's index
   * @return {null}
   */
  updateMultipleFields( action, name, index ) {
    const { data, errors } = this.state;
    let currentData = data[ name ].concat()
    let currentErrors = errors[ name ].concat();

    if ( action === 'remove' ) {
      currentData.splice( index, 1 );
      currentErrors.splice( index, 1 );
    }

    if ( action === 'add' ) {
      currentData.push( '' );
      currentErrors.push( '' );
    }

    this.setState({
      data: {
        ...data,
        [ name ]: currentData
      },
      errors: {
        ...errors,
        [ name ]: currentErrors
      }
    });
  }

  render() {
    const { data, errors } = this.state;
    const {
      enumTypes,
      formData: {
        attributes, code
      }
    } = this.props;

    return (
      <div className='form-generator-wrap'>
        { !!code && (
          <Form
            className='form-generator'
            name={code}
            onSubmit={this.events.onSubmit}
          >
            { !!( attributes && attributes.length ) && (
              <Grid stackable columns={2}>
                { attributes.map( attr => {
                  if ( attr.multiple && attr.type !== 'boolean' ) {
                    return (
                      <MultipleGeneratedFields
                        allData={data}
                        attr={attr}
                        errors={errors}
                        events={this.events}
                        enumTypes={enumTypes}
                        key={attr.code}
                        updateMultipleFields={this.updateMultipleFields}
                      />
                    )
                  }

                  return (
                    <Grid.Column key={attr.code}>
                      <GeneratedField
                        attr={attr}
                        enumTypes={enumTypes}
                        data={data[ attr.code ]}
                        error={errors[ attr.code ]}
                        events={this.events}
                      />
                    </Grid.Column>
                  )
                })}
              </Grid>
            )}

            <Divider hidden section />

            <Container textAlign='right'>
              <Form.Button primary>Зберегти</Form.Button>
            </Container>
          </Form>
        )}
      </div>
    )
  }

  static propTypes = {
    enumTypes: PropTypes.object,
    formData: PropTypes.shape({
      attributes: PropTypes.arrayOf( PropTypes.object ).isRequired,
      code: PropTypes.string.isRequired
    }).isRequired
  }
}

export default GeneratedForm;
