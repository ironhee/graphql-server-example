import React from 'react';
import Relay from 'react-relay';

class Draft extends React.Component {
  render() {
    return (
      <div>{ this.props.draft.content }</div>
    );
  }
}

export default Relay.createContainer(Draft, {
  fragments: {
    draft: () => Relay.QL`
      fragment on Draft {
        id,
        content,
      }
    `,
  },
});
