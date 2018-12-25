import React, {Component} from "react";
import "./ToolBar.css"

class ToolBar extends Component{

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className={"toolBar"}>
                <div id="scalebox" className="zdeps-1 usel">
                    <div className="zoom_map zoom_in_map" type="in" data-spm-anchor-id=""></div>
                    <div className="zoom_map zoom_out_map" type="out" data-spm-anchor-id=""></div>
                </div>
            </div>
        );
    }
}

export default ToolBar;