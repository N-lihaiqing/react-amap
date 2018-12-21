import React, {Component} from 'react';
import SearchPlate from "./MapPlate/SearchPlate";
import AMapData from "./AMapData";
import DropdownFun from "./ToolBox/DropdownFun";
import {Button} from "antd";



class AMapPage extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount(){

    }

    handle = (callback) => {
        this.aMapDataRef.location((result) => {
            callback(result);
        });

    };

    cityAddress = (callback) => {
        this.aMapDataRef.location((result) => {
            callback(result);
        });
    };


    render() {
        return (
            <div>
                <SearchPlate handle={this.handle}/>
                <AMapData ref={(r) =>this.aMapDataRef = r}/>
                <DropdownFun ref={"dropdownFun"} city = {this.cityAddress}/>
            </div>
        );
    }


}

export default AMapPage;