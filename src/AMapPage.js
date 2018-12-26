import React, {Component} from 'react';
import SearchPlate from "./MapPlate/SearchPlate";
import AMapData from "./AMapData";
import DropdownFun from "./ToolBox/DropdownFun";
import ToolBar from "./ToolZoom/ToolBar";



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
                <AMapData />
                <DropdownFun />
                <ToolBar/>
            </div>
        );
    }


}

export default AMapPage;