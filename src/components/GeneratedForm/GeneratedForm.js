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
    this.onSubmit = this.onSubmit.bind( this );

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
    this.setState({
      ...this.state,
      data: {
        ...this.state.data,
        [ e.target.name ]: e.target.value
      }
    });
  }

  onChangeDate( e, value, name ) {
    if ( e && ! e.target.value ) {
      this.onChange( e );
    } else {

      this.setState({
        ...this.state,
        data: {
          ...this.state.data,
          [ name ]: value
        }
      });

    }
  }

  onSubmit( e ) {
    e.preventDefault();
    console.log( 'Submit' );
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
                        data={this.state.data}
                        errors={this.state.errors}
                        onChange={this.onChange}
                        onChangeDate={this.onChangeDate}
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
