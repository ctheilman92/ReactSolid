import React, { Component } from 'react'
import AccountsContract from '../build/contracts/Accounts.json'
import getWeb3 from './utils/getWeb3'
import Modal from 'react-awesome-modal';

import './css/styles.css'
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

const contract = require('truffle-contract');


//#region inline styles
const btnStyle = {
  margin: '7px',
  borderRadius: '5px',
  height: '2.6em',
  width: '9em',
}

const navLink = {
  fontSize: '16px',
  float: 'right',
  width: '50px'
}

const modalFormView = {
  marginLeft: '1em',
  marginRight: '1em',
  marginBottom: '1em'
}
//#endregion


class TodoList extends Component {
  render() {
    return (
      <table className="pure-table pure-table-horizontal">
        <thead>
          <tr>
            <th>#</th>
            <th>Account</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>{this.props.accounts}</td>
            {/* {this.props.accounts.map((item, i) => {
              return <td key={i}>{item}</td>
            })} */}
          </tr>
        </tbody>
      </table>
    )
  }
}


class ModalUserNav extends Component {
  state = {
    unpl: "UserName",
    pwpl: "Password",
    errorCode: 'Registration Failed',
    errorVisible: false
  }

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
      this.props.registerUser(this.state.unpl)
      this.setState({ errorVisible: false })
      this.props.toggleModal();
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

  render() {
    return (
      <section>
          <Modal visible={this.props.visible} effect="fadeInUp">
            <div className="pure-form">
              <fieldset style={modalFormView}>
                <legend style={{fontSize: "18px"}}><b>Register now. All you need is a handle!</b></legend>
                <div className="flexContainer">
                  <input style={{marginTop: "7px", height: "2.6em", marginLeft: "5px", marginRight: "5px"}} type="text" name="unpl" placeholder={this.state.unpl} onChange={(event) => {this.handleOnChangePL(event)}} value={this.state.unpl} />
                  <button style={btnStyle} type="submit" className="pure-button pure-button-primary" onClick={() => {this.handleSubmit()}}><b>Register</b></button>
                </div>
              </fieldset>
            </div>
              
            <div className="flexContainer">
              { this.state.errorVisible ? <p style={{fontSize: "10px", color: "red"}}>{this.state.errorCode}</p> : null }
            </div>
            <div className="flexContainer">
              <a href="" onClick={() => this.props.toggleModal()}>Close</a>
            </div>
          </Modal>
      </section>
    )
  }
}


class App extends Component {
  state = {
      modalOpen: false,
      SenderAddress: null,
      RegisteredAccounts: [],
      isRegisteredUser: false,
      SenderTaskList: [],             //not set
      AccountsCtrct: null,
      web3: null
  }
  //#region APP METHODS
  componentWillMount() {
    // Get network provider and web3 instance. -- See utils/getWeb3 for more info.
    getWeb3.then(results => {
      this.setState({ web3: results.web3 })
      this.instantiateContracts()  //instantiate contract
    }).catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContracts() {
    this.setState({ AccountsCtrct: contract(AccountsContract) })
    this.state.AccountsCtrct.setProvider(this.state.web3.currentProvider)

    //Get block chain addresses --- only returns the current address selected in metamask (web3 current addr)
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.setState({ SenderAddress: accounts[0] })

      //INIT ACCOUNTS CONTRACT
      var acctDeployed = this.state.AccountsCtrct.deployed()
      acctDeployed.then((instance) => {
        return instance.getUsers(); }).then((res) => {
          this.setState({ RegisteredAccounts: res })
          
          if (this.state.RegisteredAccounts.includes(this.state.SenderAddress)) { 
            this.setState({ isRegisteredUser: true }) 
          }
        })
    })
  }

  registerUser = (handle) => {
    var acctInstance
    this.state.AccountsCtrct.deployed().then((inst) => {

      //add current user to this account
      acctInstance = inst
      return acctInstance.addNewUser(handle, {from: this.state.SenderAddress}); }).then(() => { 
        
        //now we added our user -- update registeredAccounts setState
        //pass response users array to promise
        return acctInstance.getUsers() }).then(res => { 

          this.setState({ RegisteredAccounts: res })
          if (res.includes(this.state.SenderAddress)) { 
            this.setState({ isRegisteredUser: true }) 
          }
       })
  }

  toggleModal = () => {
    this.setState(prevState => ({
      modalOpen: !prevState.modalOpen
    }));
  }
  //#endregion

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
            {
              !this.state.isRegisteredUser
              ? <a style={navLink} onClick={ this.toggleModal } href="#" className="pure-menu-heading pure-menu-link">Register</a>
              : null
            }
        </nav>

        <ModalUserNav visible={this.state.modalOpen}
              toggleModal={this.toggleModal}
              isRegistered={this.state.isRegisteredUser}
              registerUser={this.registerUser} />

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
               <h2>Smart Contract Example</h2>
               <TodoList accounts={this.state.SenderAddress} />
            </div>
          </div>
        </main>

        <footer>
          Created by Cameron Heilman - Adrian Rodriguez
          <br/>
          <a href="https://github.com/ctheilman92/ReactSolid/">React Solid Repo</a>
        </footer>
      </div>
    );
  }
}
export default App
