import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Icon } from 'semantic-ui-react';
import { GeneratedField } from '.';
import './MultipleGeneratedFields.css';

class MultipleGeneratedFields extends PureComponent {
  constructor( props ) {
    super( props );

    this.decrementFields = this.decrementFields.bind( this );
    this.incrementFields = this.incrementFields.bind( this );
    this.updateState = this.updateState.bind( this );

    this.state = {
      multipleFields: [ 0 ]
    }
  }


  /**
   * decrementFields - Remove the multiple field
   *
   * @param  {number} field The field's index
   * @return {null}
   */
  decrementFields( field ) {
    // copy data from state
    let newMultipleFields = this.state.multipleFields.concat();

    // find the the multiple field
    const fieldIndex = newMultipleFields.indexOf( field );

    // remove the multiple field
    newMultipleFields.splice( fieldIndex, 1 );

    // reindex all multiple fields
    newMultipleFields = newMultipleFields.map( ( field, index ) => index );

    // inform the parent component that multople field was removed
    this.props.updateMultipleFields( 'remove', this.props.attr.code, fieldIndex );

    // send action to actualizate React state
    this.updateState( newMultipleFields );
  }


  /**
   * incrementFields - Add the multiple field
   *
   * @return {null}
   */
  incrementFields() {
    const { multipleFields } = this.state;

    // add the multiple field
    const newMultipleFields = multipleFields.concat( multipleFields.length );

    // inform the parent component that multople field was add
    this.props.updateMultipleFields( 'add', this.props.attr.code );

    // send action to actualizate React state
    this.updateState( newMultipleFields );
  }


  /**
   * updateState - Set updated multiple field's index to React state
   *
   * @param  {array} newMultipleFields The array of indexes
   * @return {null}
   */
  updateState( newMultipleFields ) {
    this.setState( () => {
      return {
        multipleFields: newMultipleFields
      }
    });
  }

  render() {
    const {
      allData,
      attr,
      enumTypes,
      errors,
      events
    } = this.props;

    const { code } = attr;
    const { multipleFields } = this.state;

    return (
      <Fragment>
        { multipleFields.map( fieldIndex => {
          const isLastItem = multipleFields.length === fieldIndex + 1;
          const codeAsArray = `${code}[${fieldIndex}]`;

          return (
            <Grid.Column
              key={fieldIndex}
            >
              <GeneratedField
                attr={{ ...attr, code: codeAsArray }}
                enumTypes={enumTypes}
                data={allData[ code ][ fieldIndex ]}
                error={errors[ code ][ fieldIndex ]}
                events={events}
              />

              { isLastItem ? (
                <Button
                  className='multiple-button'
                  color='blue'
                  icon
                  onClick={this.incrementFields}
                  type='button'
                >
                  <Icon
                    className='multiple-button__icon'
                    name='plus circle'
                  />
                </Button>
              ) : (
                <Button
                  className='multiple-button'
                  color='red'
                  icon
                  onClick={() => this.decrementFields( fieldIndex )}
                  type='button'
                >
                  <Icon
                    className='multiple-button__icon'
                    name='minus circle'
                  />
                </Button>
              )}
            </Grid.Column>
          )
        })}
      </Fragment>
    )
  }

  static propTypes = {
    allData: PropTypes.object.isRequired,
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
    }).isRequired,
    errors: PropTypes.object.isRequired,
    events: PropTypes.shape({
      onChange: PropTypes.func.isRequired,
      onChangeDate: PropTypes.func.isRequired,
      onChangeNumber: PropTypes.func.isRequired,
      onCheck: PropTypes.func.isRequired,
      onSelect: PropTypes.func.isRequired
    }).isRequired,
    enumTypes: PropTypes.object,
    updateMultipleFields: PropTypes.func.isRequired
  }
}

export default MultipleGeneratedFields
