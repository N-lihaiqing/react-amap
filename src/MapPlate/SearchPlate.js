import React from 'react';
import {Tabs,message} from 'antd';
import 'antd/dist/antd.css';
import './map.css';
import $ from 'jquery';
import {startNavigate,location} from '../component';


/**
 * 高德地图导航模块
 */
class SearchPlate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchFrame: 'block',
            navigate: 'none',
            routeClearEnd:'none'
        };

    }

    changeTabs = (key) => {

        window.navigateWay = key;

        if(window.endLocation){
            startNavigate(window.navigateWay,window.startLocation,window.endLocation);
        }
    };

    componentWillMount(){

        window.navigateWay = 'Driving'; //    导航方式
        window.driving='';              //    导航路径
        window.endLocation={};          //    终点坐标

    }


    /*打开导航*/
    openNavigate = () => {

        this.setState({
            searchFrame: 'none',
            navigate: 'block'
        });

        location();
    };

    /**
     * 根据道路名称搜索
     */
    routeSearch =() =>{

        let map = window.map;
        map.plugin('AMap.Autocomplete', function () {
            // 实例化Autocomplete
            let autoOptions = {
                // input 为绑定输入提示功能的input的DOM ID
                input: 'search-input-way'
            };
            let autoComplete = new window.AMap.Autocomplete(autoOptions);

            window.AMap.event.addListener(autoComplete, 'select', onComplete);

            function onComplete(data) {

                console.log('data',data);

                let roadInfo = new window.AMap.RoadInfoSearch({
                    city:data.poi.district.slice(3,6)
                });

                roadInfo.roadInfoSearchByRoadName(data.poi.name,function roadComplete(status,result) {

                    if(status==='complete'){

                        map.clearMap();
                        let roadResult = result.roadInfo.filter((item)=>{return item.name===data.poi.name})[0];


                        roadResult.path.map((item)=>{
                            //path.push(new window.AMap.LngLat(item[0].lng,item[0].lat));
                            let path = [];
                            item.map((index)=>{
                                path.push(new window.AMap.LngLat(index.lng,index.lat));
                            });

                            let polyline = new window.AMap.Polyline({
                                path: path,
                                borderWeight: 2, // 线条宽度，默认为 1
                                strokeColor: 'red', // 线条颜色
                                lineJoin: 'round' // 折线拐点连接处样式
                            });

                            map.add(polyline);

                        });


                        let viewCenter = roadResult.center.split(',');
                        map.setZoomAndCenter(15, viewCenter);

                    }else{
                        message.error('当前数据无查询结果')
                    }




                })
            }
        });
    };

    /* 起始点坐标的POI搜索 */
    startOPI = () =>{

        let map = window.map;
        map.plugin('AMap.Autocomplete', function () {
            // 实例化Autocomplete
            let autoOptions = {
                // input 为绑定输入提示功能的input的DOM ID
                input: 'routeWay-start'
            };
            let autoComplete = new window.AMap.Autocomplete(autoOptions);

            window.AMap.event.addListener(autoComplete, 'select', onComplete);

            function onComplete(data) {
                window.startLocation.keyword = data.poi.name;
                window.startLocation.city = data.poi.district.substring(3,6);

                if(Object.keys(window.endLocation).length>0){
                    startNavigate(window.navigateWay,window.startLocation,window.endLocation);
                }
            }
        });

    };

    /* 终点POI搜索 */
    onLoadPOI = () => {

        let map = window.map;
        let that = this;
        map.plugin('AMap.Autocomplete', function () {
            // 实例化Autocomplete
            let autoOptions = {
                // input 为绑定输入提示功能的input的DOM ID
                input: 'routeWay-end'
            };
            let autoComplete = new window.AMap.Autocomplete(autoOptions);


            window.AMap.event.addListener(autoComplete, 'select', onComplete);

            function onComplete(data) {

                window.endLocation.keyword = data.poi.name;
                window.endLocation.city = data.poi.district.substring(3,6);
                that.setState({
                    routeClearEnd:'block'
                });

                startNavigate(window.navigateWay,window.startLocation,window.endLocation);

            }
        });

    };

    //  关闭路线导航
    closeNavigate = () => {

        if(window.driving){
            window.driving.clear();
        }

        this.setState({
            searchFrame: 'block',
            navigate: 'none',
            routeClearEnd:'none'
        });

        window.startLocation = {};
        window.endLocation = {}

        $('#routeWay-start').val('');
        $('#routeWay-end').val('');
        $('#routeWay-end').attr('placeholder','请输入终点位置');
        $('#routeWay-start').attr('placeholder','我的位置');
    };

    //  清除所选的终点位置
    clearEndLocation=()=>{

        if(window.driving){
            window.driving.clear();
        }
        window.endLocation=[];
        $('#routeWay-end').val('');
    };

    //  更换查询路线
    changeRoute =()=>{

        let start = $('#routeWay-start');
        let end = $('#routeWay-end');
        let flag = true;
        if(start.val()==='' && end.val()!==''){
            start.val(end.val());
            end.val('');
            end.attr('placeholder',start.attr('placeholder'));
            flag = false;
        }

        if(end.val()==='' && start.val()===''){
            let endPlaceholder = end.attr('placeholder');
            end.attr('placeholder',start.attr('placeholder'));
            start.attr('placeholder',endPlaceholder);
        }

        if(start.val()!=='' && end.val()==='' && flag){
            end.val(start.val());
            start.val('');
            start.attr('placeholder',end.attr('placeholder'));
        }

        if(start.val()!=='' && end.val()!==''){
            let value = start.val();
            start.val(end.val());
            end.val(value);
        }

        let location = window.endLocation;
        window.endLocation = window.startLocation;
        window.startLocation = location;

        startNavigate(window.navigateWay,window.startLocation,window.endLocation);
    };

    render() {
        const {searchFrame, navigate,routeClearEnd} = this.state;
        return (


            <div className="search-parent">
                <div style={{display: searchFrame}}>
                    <input id="search-input-way" className="search-input-way" onClick={this.routeSearch} placeholder="请输入设施和道路名称"/>
                    <div title="路线" onClick={this.openNavigate} className="search-route"/>
                </div>
                <div onClick={this.search} className="search-button"/>
                <div className="search-circle"/>
                <div className="search-navigate" style={{display: navigate}}>
                    <div className="searchbox-content-common ">
                        <Tabs defaultActiveKey="Driving" onChange={this.changeTabs}>
                            <Tabs.TabPane tab={<span className="bus-tab"><i/>公交</span>} key="Transfer"/>
                            <Tabs.TabPane tab={<span className="car-tab"><i/>驾车</span>} key="Driving"/>
                            <Tabs.TabPane tab={<span className="walk-tab"><i/>步行</span>} key="Walking"/>
                            <Tabs.TabPane tab={<span className="bike-tab"><i/>骑行</span>} key="Riding"/>
                        </Tabs>
                    </div>
                    <div className="search-route-start">
                        <div className="route-input-icon"/>
                        <input id="routeWay-start" className="route-input" onClick={this.startOPI} placeholder="我的位置"/>
                        <div className="route-clear"/>
                    </div>
                    <div className="search-route-end">
                        <div className="route-input-icon"/>
                        <input id="routeWay-end" onMouseOver={this.onLoadPOI} className="route-input"
                               placeholder="请输入终点位置"/>
                        <div onClick={this.clearEndLocation} style={{display:routeClearEnd}} className="route-clear-end"/>
                    </div>
                    <div onClick={this.changeRoute} className="search-change">
                        <div className="change-start-end"/>
                    </div>
                    <div className="search-add-white"/>
                    <div className="search-closeNavigate" onClick={this.closeNavigate}/>
                </div>
            </div>

        )
    }
}

export default SearchPlate;