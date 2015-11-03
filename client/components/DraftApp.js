import React from 'react';

class DraftApp extends React.Component {
  render() {
    return (
      <div>
        { this.props.children }
      </div>
    );
  }
}

export default DraftApp;
