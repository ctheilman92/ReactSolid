import React, { Component } from 'react'
import AccountsContract from '../../../build/contracts/Accounts.json'
import getWeb3 from '../../utils/getWeb3'
import Modal from 'react-awesome-modal';

import '../../css/styles.css'
import '../../css/oswald.css'
import '../../css/open-sans.css'
import '../../css/pure-min.css'
import '../../css/App.css'

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
            <th>Tasks</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>womp womp</td>
            <td>Done</td>
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

  componentWillMount() {
    this.setState({
      errorCode: '',
      errorVisible: false
    })
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
      this.props.toggleModal();
      this.props.registerUser(this.state.unpl)
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
  constructor(props) {
    super(props);
    this.store = this.props.store;
    this.state = {
      modalOpen: false,
      SenderAddress: null,
      SenderHandle: null,
      RegisteredAccounts: [],
      isRegisteredUser: false,
      SenderTaskList: [],             //not set
      AccountsCtrct: null,
      web3: null
    }
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
            this.getUserDetails().then(detes => {
              var detesHandle = detes[0]
              this.setState({ 
                SenderHandle: detesHandle,
                isRegisteredUser: true 
              })
            })
          }
        })
    })
  }

  registerUser = (handle) => {
    var sharedInstance 
    return this.state.AccountsCtrct.deployed().then((instance) => {
      sharedInstance = instance
      return sharedInstance.addNewUser(handle, {from: this.state.SenderAddress}); }).then(res => {
        console.log('add new user result: ' + res)
        var tmpAccounts = this.state.RegisteredAccounts.slice()
        tmpAccounts.concat(this.state.SenderAddress)
        console.log('DID CONCAT WORK!? FIND OUT!' + tmpAccounts)
        this.setState({
          RegisteredAccounts: tmpAccounts,
          isRegisteredUser: true
        })
        return sharedInstance.getUsers()
      })
  }

  updateRegisteredUsers = () => {
    console.log('getting registered users')
    this.state.AccountsCtrct.deployed().then((instance) => {
      return instance.getUsers().then((res) => {
        this.setState({ RegisteredAccounts: res }, () => {
          console.log(res)
          if (res.includes(this.state.SenderAddress)) {
            this.getUserDetails();
            this.setState({ isRegistered: true })
          }
        })
      })
    })
    this.forceUpdate();
  }

  getUserDetails = () => {
    return this.state.AccountsCtrct.deployed().then((instance) => {
      return instance.getUser(this.state.SenderAddress); 
    })
  }

  addNewTask = () => {
    //tasks are incomplete by default
    this.state.AccountsCtrct.deployed().then((instance) => {
      return instance.getUser
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
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Tasks</a>
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
              {
                this.state.isRegisteredUser
                ? <h2>Welcome {this.state.SenderHandle}!</h2>
                : <h3>Wanna start getting shit done? Lets go!</h3>
              }
               <TodoList />
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
