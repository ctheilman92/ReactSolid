import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'


class ButtonSave extends Component {
  handleClick = () => {
    this.props.saveStringRef(this.props.pl)
  }

  render() {
    return (
      <button onClick={this.handleClick}>Save</button>
    )
  }
}


class AccountsList extends Component {
  //THIS DOESN'T WORK
  // accList = this.props.accounts.map((item, i) => {
  //   return <li key={i}>{item}</li>
  // });

  //BUT THIS WORKS --- WHY DOH
  // accList = ['0x235168235012310xdcavxdga', '0x23dAasdf923bdsfhkaj'].map((item, i) => {
  //   return <li key={i}>{item}</li>
  // })
  

  render() {
    return (
      <div>
        <h3>List of Accounts: </h3>
        <ul>
          {/* {this.accList} */}
          {this.props.accounts.map((item, i) => {
            return <li key={i}>{item}</li>
          })}
           {/* <li>{this.accList}</li>  */}
        </ul>
      </div>
    )
  }
}

class TableTop extends Component {
  render() {
    return (
      <div>

      </div>
    )
  }
}


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      accountsList: [],
      placeholder: 'SaveString',
      storageString: 'null',
      storageValue: 0,
      web3: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })

  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.setState({accountsList: accounts})
      simpleStorage.deployed().then((instance) => {
        simpleStorageInstance = instance


        return simpleStorageInstance.getString.call(accounts[0])
      }).then((result) => {
        return this.setState({ storageString: result })
      })
    })
  }

  saveString = (ss) => {
    getWeb3.then(results => {
      var SSInstance

      const contract = require('truffle-contract')
      const simpleStorage = contract(SimpleStorageContract)
      simpleStorage.setProvider(this.state.web3.currentProvider)

      this.state.web3.eth.getAccounts((error, accounts) => {
        simpleStorage.deployed().then((inst) => {
          SSInstance = inst

          return SSInstance.setString(ss, {from: accounts[0]})
        }).then((res) => {
          return SSInstance.getString.call(accounts[0])
        }).then((res) => {
          return this.setState({storageString: res})
        })
      })
    })
  }


  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
               <h2>Smart Contract Example</h2>
               <AccountsList accounts={this.state.accountsList}/>  
            </div>
          </div>
          <div>
            <h3>lets try saving string inputs</h3>
            <div>
            <input type="text"
              placeholder={this.state.placeholder}
              value={this.state.placeholder}
              onChange={(event) => this.setState({ placeholder: event.target.value })} />
                      
            <ButtonSave pl={this.state.placeholder} saveStringRef={this.saveString} />
            <h4>Storage String is: {this.state.storageString}</h4>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
