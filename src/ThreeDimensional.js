import React, {Component} from 'react';
import DropdownFun from "./ToolBox/DropdownFun";


class ThreeDimensional extends Component {

    constructor(props) {
        super(props);
        this.state={
            show:'none'
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
                三维模型
            </div>
        );
    }


}

export default ThreeDimensional;