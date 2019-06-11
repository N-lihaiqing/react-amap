import {Checkbox, Row, Col} from 'antd';
import React, {Component} from "react";
import 'antd/dist/antd.css'
import {location, drawBounds, rulerOffOrOn, setZoom, addMarkSign} from "../component";

require("./DropdownFun.css");


class DropdownFun extends Component{

    constructor(props) {
        super(props);
        this.state = {
            mapPopup: 'none',
            businessPopup: 'none',
            hover: false,
            city: '',
            layerBox: 'none',
        }
    }


    render() {

        let mapPopup = {
            width: '281px',
            display: this.state.mapPopup,
            height: '190px',
            right: '39px',
            top: '57px',
            position: 'absolute',
            background: '#FFF',
        };
        let businessPopup = {
            width: '281px',
            display: this.state.businessPopup,
            height: '190px',
            right: '39px',
            top: '57px',
            position: 'absolute',
            background: '#FFF',
        };

        let citySpan = {
            marginRight: '10px',
        };

        let layerBoxStyle = {
            display: this.state.layerBox,
        };


        return (
            <div className={"right-container"}>
                <div className="layer-box" onClick={this.ClickLayerBox}>
                    <span id="util_control" className="layerutils boxicon"></span>
                    <i className="layertext">图层</i><em id={"layeroptem"}></em></div>
                <div className="layer-detail-box" style={layerBoxStyle}>
                    <Checkbox.Group style={{width: '100%'}} onChange={this.onChange}>
                        <Row>
                            <Col span={25}><Checkbox value="SZYX">影像图</Checkbox></Col>
                            <Col span={25}><Checkbox value="XZQH">行政区划</Checkbox></Col>
                            <Col span={25}><Checkbox value="midLine">中线</Checkbox></Col>
                            <Col span={25}><Checkbox value="sideLint">边线</Checkbox></Col>
                            <Col span={25}><Checkbox value="roadFace">面</Checkbox></Col>
                        </Row>
                    </Checkbox.Group>
                </div>
            </div>

    )}

    }

    export default DropdownFun;