import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'semantic-ui-react';
import './FormGenerator.css'

class FormGenerator extends PureComponent {
  constructor() {
    super()

    this.onSubmit = this.onSubmit.bind( this );
  }

  onSubmit( e ) {
    e.preventDefault();
    console.log( 'Submit' );
  }

  render() {
    console.log( this.props.settings );

    return (
      <div className='form-generator-wrap'>
        <Form
          className='form-generator'
          onSubmit={this.onSubmit}
        >
          <div>
            Form content
          </div>

          <Button type='submit' primary>Зберегти</Button>
        </Form>
      </div>
    )
  }

  static propTypes = {
    settings: PropTypes.shape({
      enumTypes: PropTypes.object,
      formConfig: PropTypes.shape({
        attributes: PropTypes.arrayOf( PropTypes.shape({
          code: PropTypes.string.isRequired,
          enumType: PropTypes.string,
          multiple: PropTypes.bool,
          title: PropTypes.string.isRequired,
          type: PropTypes.oneOf([
            'int',
            'float',
            'string',
            'date',
            'boolean',
            'enum'
          ]),
          validation: PropTypes.object
        })).isRequired,
        code: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }
}

export default FormGenerator;
