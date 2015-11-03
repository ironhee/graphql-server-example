import Relay from 'react-relay';

export default {
  draft: () => Relay.QL`query { drafts }`,
};
