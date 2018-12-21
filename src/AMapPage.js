import React, {Component} from 'react';
import SearchPlate from "./MapPlate/SearchPlate";
import AMapData from "./AMapData";
import DropdownFun from "./ToolBox/DropdownFun";



class AMapPage extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount(){

    }

    render() {
        return (
            <div>
                <SearchPlate />
                <AMapData ref={"aMapDataRef"}/>
                <DropdownFun ref={"dropdownFun"}/>
            </div>
        );
    }


}

export default AMapPage;