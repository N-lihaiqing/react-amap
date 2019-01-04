import React, {Component} from 'react';
import SearchPlate from "./MapPlate/SearchPlate";
import AMapData from "./AMapData";
import DropdownFun from "./ToolBox/DropdownFun";
import ToolBar from "./ToolZoom/ToolBar";


class SecondDimensional extends Component {

    constructor(props) {
        super(props);
        this.state={
            show:'block'
        }
    }

    componentWillMount() {

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
                <SearchPlate/>
                <AMapData/>
                <ToolBar/>
                <DropdownFun/>
            </div>
        );
    }


}

export default SecondDimensional;