import React from 'react';

class BaseInput extends React.Component {
  closePopup = () => {
    this.setState({ popupIsClosed: true }, this.onPopupClose);
  }

  onPopupClose = () => {
    // When `closable` prop is true on *Input element
    // `this.closePopup` is invoked after selection complete.
    // To allow popup to be opened again we need to set
    // `popupIsClosed` to false
    // Also `this.closePopup` is used when we force popup to close on blur
    // when using Tab navigation
    this.setState({
      popupIsClosed: false,
    });
  }
}

export default BaseInput;
