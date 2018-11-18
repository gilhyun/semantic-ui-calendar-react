import React from 'react';
import keyboardKey from 'keyboard-key';
import _ from 'lodash';

class BasePicker extends React.Component {

  componentDidMount() {
    this.setState({
      hoveredCellPosition: (this.getActiveCellPosition
        && this.getActiveCellPosition())
        || this.getInitialDatePosition()
    });
    document.addEventListener('keydown', this.handleArrowKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleArrowKeyPress);
  }

  onHoveredCellPositionChange = (e, { itemPosition }) => {
    this.setState({
      hoveredCellPosition: itemPosition,
    });
  }

  isPickerInFocus = () => {
    return this.calendarNode === document.activeElement
      || (this.calendarNode && this.calendarNode.contains(document.activeElement));
  }

  handleArrowKeyPress = (event) => {
    if (!this.isPickerInFocus()) {
      return;
    }
    event.preventDefault();
    const key = keyboardKey.getKey(event);
    const selectableCells = this.getSelectableCellPositions();
    switch(key) {
    case 'ArrowLeft':
      if (_.includes(selectableCells, this.state.hoveredCellPosition - 1)) {
        this.onHoveredCellPositionChange(null, { itemPosition: this.state.hoveredCellPosition - 1 });
      } else {
        this.isPrevPageAvailable() && this.switchToPrevPage(null, null, () => {
          const selectableCells = this.getSelectableCellPositions();
          this.onHoveredCellPositionChange(null, { itemPosition: selectableCells[selectableCells.length - 1] });
        });
      }
      break;
    case 'ArrowRight':
      if (_.includes(selectableCells, this.state.hoveredCellPosition + 1)) {
        this.onHoveredCellPositionChange(null, { itemPosition: this.state.hoveredCellPosition + 1 });
      } else {
        this.isNextPageAvailable() && this.switchToNextPage(null, null, () => {
          const selectableCells = this.getSelectableCellPositions();
          this.onHoveredCellPositionChange(null, { itemPosition: selectableCells[0] });
        });
      }
      break;
    case 'ArrowUp':
      if (_.includes(selectableCells, this.state.hoveredCellPosition - this.PAGE_WIDTH)) {
        this.onHoveredCellPositionChange(null, { itemPosition: this.state.hoveredCellPosition - this.PAGE_WIDTH });
      }
      break;
    case 'ArrowDown':
      if (_.includes(selectableCells, this.state.hoveredCellPosition + this.PAGE_WIDTH)) {
        this.onHoveredCellPositionChange(null, { itemPosition: this.state.hoveredCellPosition + this.PAGE_WIDTH });
      }
      break;
    default:
      break;
    }
  }
}

export default BasePicker;
