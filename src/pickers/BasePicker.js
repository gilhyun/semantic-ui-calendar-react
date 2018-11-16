import React from 'react';

class BasePicker extends React.Component {

  componentDidMount() {
    this.setState({
      hoveredSellPosition: this.getActiveCellPosition() || this.getInitialDatePosition()
    });
  }

  onHoveredCellPositionChange = (e, { itemPosition }) => {
    this.setState({
      hoveredSellPosition: itemPosition,
    });
  }
}

export default BasePicker;
