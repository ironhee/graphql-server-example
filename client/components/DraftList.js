import React from 'react';
import Relay from 'react-relay';
import _ from 'lodash';
import Draft from './Draft';

const PAGE_SIZE = 5;

class DraftList extends React.Component {
  constructor(props) {
    super(props);
  }

  queryNextPage(pageSize = PAGE_SIZE) {
    this.props.relay.setVariables({
      limit: this.props.relay.variables.limit + pageSize,
    });
  }

  renderDrafts() {
    return _.chain(this.props.pool.drafts.edges)
    .map(edge => edge.node)
    .map(node =>
      <Draft
        key={node.id}
        draft={node}
      />
    )
    .value();
  }

  render() {
    return (
      <div>
        { this.renderDrafts() }
        <button onClick={ () => this.queryNextPage() } >
          Fetch More
        </button>
      </div>
    );
  }
}

export default Relay.createContainer(DraftList, {
  initialVariables: {
    cursor: null,
    limit: PAGE_SIZE,
  },

  fragments: {
    pool: () => Relay.QL`
      fragment on Pool {
        drafts(after: $cursor, first: $limit) {
          edges {
            cursor
            node {
              id
              content
              createdAt
              ${Draft.getFragment('draft')}
            },
          },
        },
      }
    `,
  },
});
