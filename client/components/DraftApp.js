import React from 'react';
import Relay from 'react-relay';

class DraftApp extends React.Component {
  render() {
    return (
      <div>
        { this.props.children }
      </div>
    );
  }
}

export default Relay.createContainer(DraftApp, {
  fragments: {
    draft: () => Relay.QL`
      fragment on DraftConnection {
        edges {
          node {
            id,
          },
        },
      }
    `,
  },
});
