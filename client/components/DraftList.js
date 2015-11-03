import React from 'react';
import Relay from 'react-relay';

class DraftList extends React.Component {
  render() {
    return (
      <div>
      </div>
    );
  }
}

export default Relay.createContainer(DraftList, {
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
