import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Container, Divider, Form, Grid } from 'semantic-ui-react';
import { registerLocale } from 'react-datepicker';
import uk from 'date-fns/locale/uk';
import GeneratedField from './GeneratedField';
import './GeneratedForm.css';

registerLocale( 'uk', uk );

class GeneratedForm extends PureComponent {
  constructor( props ) {
    super( props );

    this.onChange = this.onChange.bind( this );
    this.onChangeDate = this.onChangeDate.bind( this );
    this.onChangeNumber = this.onChangeNumber.bind( this );
    this.onSelect = this.onSelect.bind( this );
    this.onSubmit = this.onSubmit.bind( this );
    this.updateData = this.updateData.bind( this );

    // initialization the form fields in React state
    const { formData } = props;
    const formCollection = {};

    if ( 'attributes' in formData ) {
      const { attributes } = formData;

      attributes instanceof Array && attributes.forEach( attr => {
        formCollection[ attr.code ] = '';
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
  }

  onChange( e ) {
    this.updateData( e.target.name, e.target.value );
  }

  onChangeDate( e, value, name ) {
    if ( e && ! e.target.value ) {
      this.updateData( e.target.name, e.target.value );
    } else {
      this.updateData( name, value );
    }
  }

  onChangeNumber( e, type ) {
    let { name, value } = e.target;

    // allow only numbers ( int || float )
    if ( value ) {
      let regex = null;

      if ( type === 'float' ) {
        regex = /^-?\d*?\.?\d*$/;
      } else if ( type === 'int' ) {
        regex = /^-?\d*$/;
      }

      if ( regex ) {
        const matchedValue = value.match( regex );
        value = matchedValue ? matchedValue[ 0 ] : this.state.data[ name ];
      }
    }

    this.updateData( name, value );
  }

  onSelect( e, selectOptions ) {
    this.updateData( selectOptions.name, selectOptions.value )
  }

  onSubmit( e ) {
    e.preventDefault();
    console.log( 'Submit' );
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

  render() {
    const { attributes, code } = this.props.formData;

    return (
      <div className='form-generator-wrap'>
        { !!code && (
          <Form
            className='form-generator'
            name={code}
            onSubmit={this.onSubmit}
          >
            { !!( attributes && attributes.length ) && (
              <Grid stackable columns={2}>
                { attributes.map( attr => {
                  return (
                    <Grid.Column key={attr.code}>
                      <GeneratedField
                        attr={attr}
                        enumTypes={this.props.enumTypes}
                        data={this.state.data[ attr.code ]}
                        error={this.state.errors[ attr.code ]}
                        onChange={this.onChange}
                        onChangeDate={this.onChangeDate}
                        onChangeNumber={this.onChangeNumber}
                        onKeyDown={this.onKeyDown}
                        onSelect={this.onSelect}
                      />
                    </Grid.Column>
                  )
                })}
              </Grid>
            )}

            <Divider hidden section />

            <Container textAlign='right'>
              <Form.Button primary>
                Зберегти
              </Form.Button>
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
