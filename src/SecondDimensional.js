import React, {Component} from 'react';
import SearchPlate from "./MapPlate/SearchPlate";
import AMapData from "./AMapData";
import DropdownFun from "./ToolBox/DropdownFun";
import ToolBar from "./ToolZoom/ToolBar";
import GisMap from "./GisMap";
import {GisClick} from "./GisUtils"


class SecondDimensional extends Component {

    constructor(props) {
        super(props);
        this.state={
            show:'block'
        }
    }

    componentDidMount() {
        if(!window.map) return;

        // 点击事件
        window.map.on('click',GisClick)
    }

    showDimensional = (flag) =>{
        this.setState({
            show:flag
        })
    };

    render() {
        const {show} = this.state;
        return (
            <div style={{display:show}}>
                <GisMap/>
            </div>
        );
    }


}

export default SecondDimensional;