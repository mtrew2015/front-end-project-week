import React from 'react';
import './App.scss';
import MainSection from './components/MainSection';
import axios from 'axios'
import CreateNote from './components/CreateNote'
import UpdateNote from './components/UpdateNote'
import { Route } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import ViewNote from './components/viewNote';
import LoginView from './components/loginView';
import Sidebar from './components/sidebar';



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      isLoggedIn: false,
      username: ''
    }
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
  }
  componentDidMount() {
    axios
      .get('https://fe-notes.herokuapp.com/note/get/all')
      .then(response => this.setState({ notes: response.data }))
      .catch(err => console.log(err));
    this.isLoggedIn();
  }

  isLoggedIn() {
    if (localStorage.getItem('token')) {
      this.setState({
        isLoggedIn: true,
        username: localStorage.getItem('username')
      })
    } else {
      this.setState({
        isLoggedIn: false,
        username: ''
      })
    }
  }

  logout() {
    this.setState({ isLoggedIn: false, username: '' })
  }

  login() {
    this.setState({ isLoggedIn: true, username: localStorage.getItem('username') })
  }

  getNotes = () => {
    axios
      .get('https://fe-notes.herokuapp.com/note/get/all')
      .then(response => this.setState({ notes: response.data }))
      .catch(err => console.log(err))

  }

  updateNote = (id, note) => {
    axios
      .put(`https://fe-notes.herokuapp.com/note/edit/${id}`, note)
      .then(() => this.getNotes())
      .then(() => this.props.history.push('/'))
      .catch(err => console.log(err))
  }

  createNote = (note) => {
    axios
      .post("https://fe-notes.herokuapp.com/note/create", note)
      .then(() => (this.getNotes()))
      .then(() => this.props.history.push('/'))
      .catch(err => console.log(err))
  }

  deleteNote = (id) => {
    axios
      .delete(`https://fe-notes.herokuapp.com/note/delete/${id}`)
      .then(() => (this.getNotes()))
      .then(() => this.props.history.push('/'))
      .catch(err => console.log(err))

  }
  render() {
    return (
      <div className="appContainer">
        <div className="sideBarClass">
          <h1>Lambda <br></br>Notes</h1>
          <Route path="/" render={(props) => <Sidebar state={this.state} logout={this.logout} />} />
        </div>
        <Route path="/create" render={(props) => <CreateNote createNote={this.createNote} />} />
        <Route exact path="/" render={(props) => (<MainSection notes={this.state.notes} />)} />
        <Route path="/update/:id" render={(props) => (<UpdateNote {...props} deleteNote={this.deleteNote} updateNote={this.updateNote} notes={this.state.notes} />)} />
        <Route path="/view/:id" render={(props) => (<ViewNote {...props} deleteNote={this.deleteNote} updateNote={this.updateNote} notes={this.state.notes} loggedIn={this.state.isLoggedIn} />)} />
        <Route exact path="/login" render={(props) => (<LoginView {...props} login={this.login} />)} />
      </div>
    );
  }
}

export default withRouter(App);
