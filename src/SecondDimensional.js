import React, {Component} from 'react';
import SearchPlate from "./MapPlate/SearchPlate";
import AMapData from "./AMapData";
import DropdownFun from "./ToolBox/DropdownFun";
import ToolBar from "./ToolZoom/ToolBar";
import GisMap from "./GisMap";
import {GisClick} from "./GisUtils"
import Statement from "./Statement";


class SecondDimensional extends Component {

    constructor(props) {
        super(props);
        this.state={
            show:'block',
            open: false
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

    openCount = () =>{
        let markers = window.map.getAllOverlays();
        let marker = markers.find(o => o.getExtData().id === 1);
        marker.setIcon(new window.AMap.Icon({
            image: require('./image/upline.png'),
            size: [ 20,  27],
            imageSize: [ 20, 27]
        }))
    };

    render() {
        const {show,open} = this.state;
        return (
            <div style={{display:show}}>
                <button onClick={this.openCount}>统计信息</button>
                <GisMap/>

            </div>
        );
    }


}

export default SecondDimensional;