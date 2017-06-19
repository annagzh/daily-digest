import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import List from './components/List.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: ''
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
    console.log(`${email} & ${username} were added`);
    $.ajax({
      method: 'POST',
      url: '/add',
      data: { email: email, username: username }
    })
  }


  render () {
    return (<div>
      <h1>Daily Digest</h1>
        <p>Enter your email: <input value={this.state.email} onChange={this.onEmailChange.bind(this)}/></p>
        <p>Enter an Instagram username: <input value={this.state.username} onChange={this.onUsernameChange.bind(this)}/></p>
        <p> <button onClick={() => this.addToDB(this.state.email, this.state.username)}> Submit </button> </p>
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
