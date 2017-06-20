import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import List from './components/List.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      emailToCheck: ''
    }
  }

  onEmailChange (e) {
    this.setState({
      email: e.target.value
    });
  }

  onUsernameChange (e) {
    this.setState({
      username: e.target.value
    });
  }

  onEmailToCheckChange (e) {
    this.setState({
      emailToCheck: e.target.value
    });
  }

  // componentDidMount() {
  //   $.ajax({
  //     url: '/items',
  //     success: (data) => {
  //       this.setState({
  //         items: data
  //       })
  //     },
  //     error: (err) => {
  //       console.log('err', err);
  //     }
  //   });
  // }

  addToDB(email, username) {
    if (email !== '' && username !== '') {
      console.log(`${email} & ${username} were added`);
      $.ajax({
        method: 'POST',
        url: '/add',
        data: { email: email, username: username }
      })
    }
  }

  sendTestEmail(email) {
    if (email !== '') {
      console.log('email was queued');
      $.ajax({
        method: 'POST',
        url: '/getlist',
        data: { email: email }
      })
    }
  }

  render () {
    return (<div>
      <h1>InstaDigest</h1>
      <p>Enter your email: <input value={this.state.email} onChange={this.onEmailChange.bind(this)}/></p>
      <p>Enter an Instagram username: <input value={this.state.username} onChange={this.onUsernameChange.bind(this)}/></p>
      <p> <button onClick={() => this.addToDB(this.state.email, this.state.username)}> Submit </button></p>
      <p>Enter your email to receive a list of usernames in your digest: <input value={this.state.emailToCheck} onChange={this.onEmailToCheckChange.bind(this)}/></p>
      <p> <button onClick={() => this.sendTestEmail(this.state.emailToCheck)}>Send me a list of usernames</button></p>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

//
// addMovieToDB () {
//    $.ajax({
//      url: '/movies/new',
//      type: 'POST',
//      data: { title: this.state.newMovie }
//    })
//  }
