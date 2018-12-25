import React, {Component} from "react";
import "./ToolBar.css"
import {setZoom} from "../component"

class ToolBar extends Component{

    constructor(props) {
        super(props);
    }

    toolBarClick = (e) => {
        let $ = require("jquery");
        let type = $(e.target).prop("className").split(" ")[2];
        setZoom(type);
    };

    render() {
        return(
            <div className={"toolBar"}>
                <div id="scalebox" className="zdeps-1 usel">
                    <div className="zoom_map zoom_in_map in" onClick={this.toolBarClick}></div>
                    <div className="zoom_map zoom_out_map out" onClick={this.toolBarClick}></div>
                </div>
            </div>
        );
    }
}

export default ToolBar;