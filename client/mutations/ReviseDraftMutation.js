import Relay from 'react-relay';

export default class ReviseDraftMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`
      mutation {
        reviseDraft
      }
    `;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on DraftRevisePayload {
        draft
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        draft: this.props.id,
      },
    }];
  }

  getVariables() {
    return {
      id: this.props.id,
      content: this.props.content,
    };
  }

  getOptimisticResponse() {
    return {
      draftEdge: {
        node: {
          content: this.props.content,
        },
      },
    };
  }
}
