import React from 'react';
import jwtDecode from 'jwt-decode';
import Relay from 'react-relay';
import saveToken from '../lib/saveToken';
import clearToken from '../lib/clearToken';
import loadToken from '../lib/loadToken';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      userId: null,
    };
  }

  componentDidMount() {
    const token = loadToken();
    if (token) {
      this.setToken(token);
    }
  }

  onLogin() {
    const name = this.refs.name.value;
    const password = this.refs.password.value;
    fetch('/auth', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        password,
      }),
    })
    .then(resp => resp.json())
    .then(({ token }) => {
      saveToken(token);
      this.setToken(token);
    });
  }

  onLogout() {
    clearToken();
    this.unsetToken();
  }

  setToken(token) {
    Relay.injectNetworkLayer(
      new Relay.DefaultNetworkLayer('/graphql', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
    );

    const { userId } = jwtDecode(token);
    this.setState({
      token,
      userId,
    });
  }

  unsetToken() {
    Relay.injectNetworkLayer(
      new Relay.DefaultNetworkLayer('/graphql', {
        headers: {
          Authorization: null,
        },
      })
    );

    this.setState({
      token: null,
      userId: null,
    });
  }

  render() {
    return (
      <div>
        <div>
          <input
            type="text"
            ref="name"
            name="name"
            placeholder="Name"
          />
          <input
            type="text"
            ref="password"
            name="password"
            placeholder="Password"
          />
          <button
            onClick={ () => this.onLogin() }
          >
            CreateToken
          </button>
          <button
            onClick={ () => this.onLogout() }
          >
            RemoveToken
          </button>
          <span>token: { this.state.token ? this.state.token.slice(0, 10) : null }...</span>
        </div>
        <hr />
        { this.props.children }
      </div>
    );
  }
}

export default App;
