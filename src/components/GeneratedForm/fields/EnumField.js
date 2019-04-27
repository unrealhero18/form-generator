import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select } from 'semantic-ui-react';
import generateHierarchicOptionsList from '../../../utils/generateHierarchicOptionsList';

const EnumField = ({
  attr: {
    code,
    data,
    enumType,
    title
  },
  enumTypes = {},
  error,
  onSelect
}) => {
  let options = [];

  const enumData = enumTypes[ enumType ];
  if ( ! enumData && ! ( enumData instanceof Array ) ) return null;

  const isHierarchic = enumData.some( item =>
    ! isNaN( parseInt( item.parentId, 10 ) )
  );

  if ( isHierarchic ) {
    options = generateHierarchicOptionsList( enumData );
  } else {
    options = enumData.map( item => {
      return {
        key: item.id,
        text: item.title,
        value: item.id
      }
    });
  }

  return (
    <Form.Field className='generated-field _enum' error={!!error}>
      <label>{title}</label>

      <Select
        name={code}
        options={options}
        placeholder={title}
        onChange={onSelect}
        value={data}
      />
    </Form.Field>
  )
}

EnumField.propTypes = {
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
  enumTypes: PropTypes.object.isRequired,
  error: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

export default EnumField
