import React, { Component } from 'react'
import { connect } from 'react-redux' 
import { bindActionCreators } from 'redux' 

import '../css/pure-min.css'
import '../css/Dashboard.css'


class Dashboard extends Component {

    tasks = this.props.accounts.SenderTaskList

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
      if (this.tasks.length === 2) {
      return (
          <div>
            <ul className="DashList">
              <li><h4 className="DashTitle">Your TaskList</h4></li>
              {this.tasks.map(row => { 
                return <li><span className={ this.setStatusClass(row[2]) }>{ (row[2] === false) ? "INCOMPLETE" : "COMPLETE" }</span>{row[0]}</li>
              })}
            </ul>
          </div>
        )
      }
      else {
        return (
          <ul className="DashList">
            <span className="status yellow">Stale Task</span>
            <li>Task 1</li>
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
  
