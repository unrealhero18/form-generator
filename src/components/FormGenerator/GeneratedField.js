import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import DatePicker, { registerLocale } from "react-datepicker";
import uk from 'date-fns/locale/uk';

import { InlineError } from './messages';
import './GeneratedField.css';

registerLocale( 'uk', uk );

const GeneratedField = ({
  attr: {
    code,
    title,
    type = 'string'
  },
  data,
  errors,
  onChange,
  onChangeDate
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
          selected={data[ code ] ? data[ code ] : null}
        />
      </Form.Field>
    )}

    { type === 'string' && (
      <Form.Field className='generated-field _string'>
        <Form.Input
          error={!!errors[ code ]}
          label={title}
          name={code}
          onChange={onChange}
          placeholder={title}
          value={data[ code ]}
        />
      </Form.Field>
    )}

    { errors[ code ] && <InlineError text={errors[ code ]} /> }
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
  data: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  onChangeDate: PropTypes.func
}

export default GeneratedField;
