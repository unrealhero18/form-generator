import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Container, Divider, Form, Grid } from 'semantic-ui-react';
import { registerLocale } from 'react-datepicker';
import uk from 'date-fns/locale/uk';
import { GeneratedField, MultipleGeneratedFields } from './fields'
import Validation from '../../lib/Validation';
import './GeneratedForm.css';

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

    // initialization the form fields in React state
    const { formData } = props;
    const formCollection = {};

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
    this.validator = new Validation();
  }

  events = {
    onChange( e ) {
      const { name, value } = e.target;
      const multiplePath = this.getMultiplePath( name );

      if ( multiplePath ) {
        this.updateMultipleData( multiplePath, value );
      } else {
        this.updateData( name, value );
      }
    },

    onChangeDate( e, value, name ) {
      if ( e && ! e.target.value ) {
        // onChangeRaw
        const eventName = e.target.name;
        const eventValue = e.target.value;
        const multiplePath = this.getMultiplePath( eventName );

        if ( multiplePath ) {
          this.updateMultipleData( multiplePath, eventValue );
        } else {
          this.updateData( eventName, eventValue );
        }

      } else {
        // onChange
        const multiplePath = this.getMultiplePath( name );

        if ( multiplePath ) {
          this.updateMultipleData( multiplePath, value );
        } else {
          this.updateData( name, value );
        }
      }
    },

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
          value = Number( value );
        }
      }

      const multiplePath = this.getMultiplePath( name );

      if ( multiplePath ) {
        this.updateMultipleData( multiplePath, value );
      } else {
        this.updateData( name, value );
      }
    },

    onCheck( e, data ) {
      this.updateData( data.name, data.checked );
    },

    onSelect( e, selectOptions ) {
      const { name, value } = selectOptions;
      const multiplePath = this.getMultiplePath( name );

      if ( multiplePath ) {
        this.updateMultipleData( multiplePath, value );
      } else {
        this.updateData( name, value );
      }
    },

    onSubmit( e ) {
      e.preventDefault();

      const { formData: form } = this.props;
      const { errors: stateErrors, data: stateData } = this.state;
      const errors = this.validator.validate( form, stateData );

      if ( errors.isValid ) {
        console.log( stateData );
      } else {
        this.setState( () => {
          return {
            errors: {
              ...stateErrors,
              ...errors
            }
          }
        });
      }
    }
  }

  getMultiplePath( name = '' ) {
    const matched = name.match( /\[.d?\]/g );

    if ( matched ) {
      const arrayLiteral = matched[ 0 ];

      return {
        code: name.slice( 0, name.indexOf( arrayLiteral ) ),
        arrayLiteral
      }
    }

    return null;
  }

  updateData( name, value ) {
    if ( ! name ) return;

    this.setState({
      ...this.state,
      data: {
        ...this.state.data,
        [ name ]: value
      }
    });
  }

  updateMultipleData( multiplePath, value ) {
    const { code, arrayLiteral } = multiplePath;
    const { data } = this.state;

    // get item index of the multiple fields array
    const index = arrayLiteral.slice( 1, -1 ) * 1;

    // copy current state of multiple field
    const currentData = data[ code ].concat();

    // update single record
    currentData[ index ] = value;

    // send to update state
    this.updateData( code, currentData );
  }

  updateMultipleFields( action, code, index ) {
    const { data, errors } = this.state;
    let currentData = data[ code ].concat()
    let currentErrors = errors[ code ].concat();

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
        [ code ]: currentData
      },
      errors: {
        ...errors,
        [ code ]: currentErrors
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
