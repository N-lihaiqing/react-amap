import React, {Component} from 'react';
import SearchPlate from "./MapPlate/SearchPlate";
import AMapData from "./AMapData";
import DropdownFun from "./ToolBox/DropdownFun";
import ToolBar from "./ToolZoom/ToolBar";
import GisMap from "./GisMap";
import {GisClick, getMarker, removeAggration, getAddress,addressCallback,getClickPoint} from "./GisUtils"
import Statement from "./Statement";


class SecondDimensional extends Component {

    constructor(props) {
        super(props);
        this.state={
            show:'block',
            open: false
        }
        this.index = 1;
        this.point = [];
    }

    componentDidMount() {
        let that = this;
        if(!window.map) return;

        // 点击事件
        window.map.on('click',function (e) {
            GisClick(e,that.addressData)
        });

    }

    addressData = (status,result) =>{
        let data = {
            address : result.regeocode.formattedAddress,
            point : getClickPoint()
        };

        alert(data.address);
    };

    showDimensional = (flag) =>{
        this.setState({
            show:flag
        })
    };

    openCount = () =>{


        /*let point = {
            id : this.index,
            img : require('./image/upline.png'),
            size : [20 , 27]
        };

        getMarker(point);
        this.index++;*/
        removeAggration();
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