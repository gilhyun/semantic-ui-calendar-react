import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

function Calendar(props) {
  const {
    children,
    ...rest
  } = props;
  return (
    <Table
      unstackable
      celled
      {...rest}
      textAlign="center">
      { children }
    </Table>
  );
}

Calendar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Calendar;
