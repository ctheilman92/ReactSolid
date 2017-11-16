import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ModalUserNav from './ModalUserNav'
import Dashboard from './Dashboard'
import { Nav, Navbar, NavItem } from 'react-bootstrap'
import * as accountActions from '../actions' // eslint-disable-line

import '../css/styles.css'
import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/bootstrap.min.css'

const util = require('util')  // eslint-disable-line


class App extends Component {
    constructor() {
      super()

      this.state = {
        modalOpen: false,
      };
    }

  componentDidMount() {
  }


  toggleModal = () => {
    this.setState(prevState => ({
      modalOpen: !prevState.modalOpen
    }));
  }
  //#endregion

  render() {
    if (this.props.accounts.isFetching) {
      return (
        <div>
            <h1 className="flexContainer">fetching data please wait</h1>
            <h2 className="flexContainer fa fa-spinner fa-spin fa-3x" aria-hidden="true"></h2>
        </div>
      )
    }
    else {
      return (
        <div>

          <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <a className="navbar-brand" href="#">PayBlocks! </a>
        
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ml-auto">
              {
                !this.props.accounts.isRegisteredUser
                  ? <li className="nav-item my-2 my-lg-0">
                      <a onClick={ () => { this.toggleModal() }} className="nav-link" href="#">Register</a>
                    </li>
                  : null
              }
            </ul>
          </div>
        </nav>

        <ModalUserNav visible={this.state.modalOpen} toggleModal={this.toggleModal} /> 

        <div className="container">
          <div>
            <div>
              {
                this.props.accounts.isRegisteredUser
                ? <h2>Welcome {this.props.accounts.SenderHandle}!</h2>
                : <h3>Wanna start getting shit done? Lets go!</h3>
              }

              <Dashboard />

            </div>
          </div>
        </div>
        
        <footer>
          Created by Cameron Heilman - Adrian Rodriguez
          <br/>
          <a href="https://github.com/ctheilman92/ReactSolid/">React Solid Repo</a>
        </footer>
      </div>
    )
  }
  }
}


const mapStateToProps = (state, ownProps) => {
  return { 
    accounts: state.accounts
  }
}

export default connect(mapStateToProps)(App)

