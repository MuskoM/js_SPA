import React from "react";

class Popup extends React.Component {
  render() {
    return (
      <div className="popup">
        <div className="popup_inner">
          <h1>{this.props.text}</h1>
          <button class="btn btn-primary" onClick={this.props.closePopup}>Zatwierdź</button>
        </div>
      </div>
    );
  }
}
export default Popup;
