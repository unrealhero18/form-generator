import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { InlineError } from './messages';
import './GeneratedField.css';

const GeneratedField = ({
  attr: {
    code,
    title,
    type = 'string'
  },
  data,
  error,
  onChange,
  onChangeDate,
  onChangeNumber
}) => (
  <Fragment>
    { type === 'date' && (
      <Form.Field className='generated-field _date'>
        <label>{title}</label>

        <DatePicker
          dateFormat="dd/MM/yyyy"
          locale='uk'
          name={code}
          onChange={value => onChangeDate( null, value, code )}
          onChangeRaw={e => onChangeDate( e )}
          placeholderText={title}
          selected={data ? data : null}
        />
      </Form.Field>
    )}

    { ( type === 'int' || type === 'float' ) && (
      <Form.Field className='generated-field _int'>
        <Form.Input
          error={!!error}
          label={title}
          name={code}
          onChange={e => onChangeNumber( e, type )}
          placeholder={title}
          value={data}
        />
      </Form.Field>
    )}

    { type === 'string' && (
      <Form.Field className='generated-field _string'>
        <Form.Input
          error={!!error}
          label={title}
          name={code}
          onChange={onChange}
          placeholder={title}
          value={data}
        />
      </Form.Field>
    )}

    { error && <InlineError text={error} /> }
  </Fragment>
);

GeneratedField.propTypes = {
  attr: PropTypes.shape({
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
  }),
  data: PropTypes.any.isRequired,
  error: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeDate: PropTypes.func.isRequired,
  onChangeNumber: PropTypes.func.isRequired
}

export default GeneratedField;
