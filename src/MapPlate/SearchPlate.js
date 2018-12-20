import React, {Component} from 'react';
import {Input, Icon,Tabs} from 'antd';
import 'antd/dist/antd.css';
import './map.css';


class SearchPlate extends Component {

    constructor(props) {
        super(props);
        this.state={
            searchFrame:'block',
            navigate:'none'

        }
    }

    callback = (key) =>{

    };


    /*打开导航*/
    openNavigate = () =>{

        this.setState({
            searchFrame:'none',
            navigate:'block'
        })
    };

    closeNavigate = () =>{
        this.setState({
            searchFrame:'block',
            navigate:'none'
        })
    };

    render() {

        const { searchFrame,navigate } = this.state;

        return (


            <div className="search-parent" >
                <div style={{display:searchFrame}}>
                    <input className="search-input-way" placeholder="Basic usage" />
                    <div onClick={this.openNavigate} className="search-route"/>
                </div>
                <div className="search-button"/>
                <div className="search-circle"/>
                <div className="search-navigate" style={{display:navigate}}>
                    <div className="searchbox-content-common ">
                        <Tabs defaultActiveKey="1" onChange={this.callback}>
                            <Tabs.TabPane tab={<span><i/>公交</span>} key="1"/>
                            <Tabs.TabPane tab={<span><i/>驾车</span>} key="2"/>
                            <Tabs.TabPane tab={<span><i/>步行</span>} key="3"/>
                            <Tabs.TabPane tab={<span><i/>骑行</span>} key="4"/>
                        </Tabs>
                    </div>
                    <div className="search-route-start">
                        <div className="route-input-icon"/>
                        <input className="route-input" placeholder="我的位置" />
                        <div className="route-clear" />
                        <div className="route-add"/>
                    </div>
                    <div className="search-route-end">
                        <div className="route-input-icon"/>
                        <input className="route-input" placeholder="输入终点或在图区上选点" />
                    </div>
                    <div className="search-change">
                        <div className="change-start-end"/>
                    </div>
                    <div className="search-add-white"/>
                    <div className="search-closeNavigate" onClick={this.closeNavigate} />
                </div>
            </div>

        )
    }
}

export default SearchPlate;