import React, { Component } from 'react'
import * as accountActions from '../../actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ModalUserNav from '../ModalUserNav/ModalUserNav'


import '../../css/styles.css'
import '../../css/oswald.css'
import '../../css/open-sans.css'
import '../../css/pure-min.css'
import '../../css/App.css'

const util = require('util')

const navLink = {
  fontSize: '16px',
  float: 'right',
  width: '50px'
}



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
        <div>fetching data please wait</div>
      )
    }
    else {
      return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Tasks</a>
            {
              this.props.accounts.isRegisteredUser
                ? null 
                : <a style={navLink} onClick={ () => { this.toggleModal() }} href="#" className="pure-menu-heading pure-menu-link">Register</a>
            }
        </nav>
        <ModalUserNav visible={this.state.modalOpen}
              toggleModal={this.toggleModal} /> 
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              {
                this.props.accounts.isRegisteredUser
                ? <h2>Welcome {this.props.accounts.SenderHandle}!</h2>
                : <h3>Wanna start getting shit done? Lets go! -- your current address is: {this.props.accounts.SenderAddress}</h3>
              }
            </div>
          </div>
        </main>
        <footer>
          <div>
            <div>Your address: {this.props.accounts.SenderAddress}</div>
            <div>Your Handle: {this.props.accounts.SenderHandle}</div>
          </div>
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

//needs more work done.
const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({
      
    });
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

