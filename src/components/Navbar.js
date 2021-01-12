import React,{Component} from 'react';
import {NavLink} from "react-router-dom"

export default class NavBar extends Component{
  render(){
    return (
      <div>
        <nav class="navbar navbar-expand-sm navbar-light bg-light">
          <ul class="navbar-nav" >
            <li class="nav-item nav-link ">
              <NavLink exact to="/">
                DRILLING
              </NavLink>
            </li>
            <li class="nav-item nav-link">
              <NavLink exact to="/completion">
                COMPLETION
              </NavLink>
            </li>
            <li class="nav-item nav-link">
              <NavLink exact to="/redbox">
                REDBOX
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}