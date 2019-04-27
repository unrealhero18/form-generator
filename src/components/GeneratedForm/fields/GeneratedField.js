import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Form } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { InlineError } from '../messages';
import { EnumField } from '.';
import './GeneratedField.css';

const GeneratedField = ({
  attr: {
    code,
    title,
    type = 'string'
  },
  attr,
  data,
  enumTypes,
  error,
  events: {
    onChange,
    onChangeDate,
    onChangeNumber,
    onCheck,
    onSelect
  }
}) => (
  <Fragment>
    { type === 'boolean' && (
      <Form.Field className='generated-field _boolean' error={!!error}>
        <Checkbox
          checked={!!data}
          label={title}
          name={code}
          onChange={onCheck}
          type='checkbox'
        />
      </Form.Field>
    )}

    { type === 'date' && (
      <Form.Field className='generated-field _date' error={!!error}>
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

    { type === 'enum' && (
      <EnumField
        attr={attr}
        error={error}
        data={data}
        enumTypes={enumTypes}
        onSelect={onSelect}
      />
    )}

    { ( type === 'int' || type === 'float' ) && (
      <Form.Field className='generated-field _int' error={!!error}>
        <Form.Input
          inputMode='numeric'
          label={title}
          name={code}
          onChange={e => onChangeNumber( e, type )}
          placeholder={title}
          value={data}
        />
      </Form.Field>
    )}

    { type === 'string' && (
      <Form.Field className='generated-field _string' error={!!error}>
        <Form.Input
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
  events: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    onChangeDate: PropTypes.func.isRequired,
    onChangeNumber: PropTypes.func.isRequired,
    onCheck: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired
  }).isRequired
}

export default GeneratedField;
