import React, { Component } from 'react'
import { connect } from 'react-redux' 
import { bindActionCreators } from 'redux' 
import getEtherValue from '../utils/unitConverter';

import '../css/pure-min.css'
import '../css/Dashboard.css'

const util = require('util');


class Dashboard extends Component {

    payments = this.props.accounts.SenderPayments;
    eval = getEtherValue(this.payments[0][1]);

    setStatusClass = (status) => {
      switch (status) {
        case true:
          return "status green"
        case false:
          return "status red"
        default:
          return "status yellow"
      }
    }

    render() {
      if (this.payments.length === 2) {
      return (
          <div>
            <ul className="DashList">
              <li><h4 className="DashTitle">Your TaskList</h4></li>
              {this.payments.map(row => { 
                return <li><span className={ this.setStatusClass(row[2]) }>{ (row[2] === false) ? "INCOMPLETE" : "COMPLETE" }</span>{row[0]}</li>
              })}
            </ul>
          </div>
        )
      }
      else {
        console.log(this.payments[0])
        console.log(this.eval)
        return (
          <ul className="DashList">
            <span className="status yellow">Stale Task</span>
            <li>{this.eval}</li>
            <span className="status green">Completed</span>
            <li>Task 2</li>
            <span className="status red">Incomplete</span>
            <li>Task 3</li>
          </ul>
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
  
