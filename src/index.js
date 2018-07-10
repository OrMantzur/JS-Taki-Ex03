import React from 'react';
import ReactDOM from 'react-dom';
import "./style.css";


/* Directly adding react element */
ReactDOM.render(
    React.createElement('div',null, 'hello world'), 
    document.getElementById("root")
);
