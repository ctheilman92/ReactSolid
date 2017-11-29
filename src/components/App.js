import Dashboard from './Dashboard'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import ModalUserNav from './ModalUserNav'
import * as accountActions from '../actions' // eslint-disable-line
import getEtherValue from '../utils/unitConverter';

import '../css/App.css'
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
                  : <li className="nav-item my-2 my-lg-0">
                      <a className="nav-link" href="#">Wallet Funds: {getEtherValue(this.props.accounts.SenderBalance)} ETH</a>
                    </li>
              }
            </ul>
          </div>
        </nav>

        <ModalUserNav visible={this.state.modalOpen} toggleModal={this.toggleModal} /> 

        <div className="container">
          <div>
            <Dashboard />
          </div>
        </div>
        
        <footer>
          <hr />
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

