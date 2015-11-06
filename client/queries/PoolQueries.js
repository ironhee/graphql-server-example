import Relay from 'react-relay';

export default {
  pool: () => Relay.QL`query {
    pool
  }`,
};
