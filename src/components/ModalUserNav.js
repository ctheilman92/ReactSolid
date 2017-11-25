import React, { Component } from 'react'
import * as accountActions from '../actions' // eslint-disable-line
import { connect } from 'react-redux'
import Modal from 'react-awesome-modal'

import '../css/styles.css'
import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/App.css'

const util = require('util')  // eslint-disable-line


const FormFrame = (props) => {
  if (!props.didRegister) {
    return (
      <form className="form-inline">
        <div className="flexContainer">
          <input className="form-control mr-sm-2" type="text" name="unpl" placeholder={props.unpl} onChange={(event) => {props.handleOnChangePL(event)}} value={props.unpl} />
        </div>
      </form>
    );
  }
  else {
    return (
      <div className="flexContainer">
        <h4>YOU'RE REGISTERED LETS GET STARTED</h4>
      </div>
    );
  }
}
  

class ModalUserNav extends Component {
  constructor(props) {
    super(props);

    //use local state for UI stuff ONLY
    this.state = {
      unpl: 'UserName',
      errorCode: 'ERROR: there was an issue with the input',
      errorVisible: false
    }
  }

  //#region events
  togglError = () => {
    this.setState(prevstate => ({
      errorVisible: !prevstate.errorVisible
    }));
  }

  handleOnChangePL = (e) => {
    this.setState({ [e.target.name]: e.target.value})
  }

  handleSubmit = () => {
    if (this.state.unpl !== "") {
      if (this.props.accounts.web3.isConnected()) {
        this.props.registerUser(this.state.unpl);
      }
    }
    else {
      //if the input is empty update the error code and show
      console.log('registration failed!')
      this.setState({
        errorCode: 'REGISTRATION ERR: empty handles are not allowed!',
        errorVisible: true
      })
    }
  }
  //#endregion

  render() {
    const {
      unpl,
      errorCode,
      errorVisible
    } = this.state;

    return (
      <section>
        <Modal aria={{labelledby: "heading", describedby: "full_description"}} visible={this.props.visible} effect="fadeInUp">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Register your account!</h5>
                  <a href="#" onClick={ () => { this.props.toggleModal() }}>&times;</a>
                </div>
                <div className="modal-body">
                  <FormFrame handleOnChangePL={this.handleOnChangePL} handleSubmit={this.handleSubmit}
                    unpl={unpl} didRegister={this.props.accounts.isRegisteredUser} />
                  <div style={{margin: '1em'}}>
                  {
                    this.state.errorVisible
                      ? <p style={{color: 'red'}}><b>{this.state.errorCode}</b></p>
                      : null
                  }
                  </div>
                </div>
                <div className="modal-footer">
                  { !this.props.accounts.isRegisteredUser
                    ? <button type="button" className="btn btn-primary" onClick={ () => { this.handleSubmit() }}>Register</button> 
                    : null
                  }
                  <button type="button" className="btn btn-secondary" onClick={ () => { this.props.toggleModal() }}>Close</button>
                </div>
              </div>

        </Modal>
      </section>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return { 
    accounts: state.accounts
  }
}

//needs more work done.
function mapDispatchToProps(dispatch) {
  return {
    registerUser: handle => { dispatch(accountActions.registerNewUser(handle)); }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalUserNav)