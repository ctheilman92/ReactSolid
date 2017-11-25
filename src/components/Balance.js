import React, { Component } from 'react'
import * as accountActions from '../actions' // eslint-disable-line
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux' 

import '../css/styles.css'
import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/App.css'

const util = require('util')  // eslint-disable-line


class Balance extends Component {
    render() {
        return (
            <div>currentbalance</div>
        )
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