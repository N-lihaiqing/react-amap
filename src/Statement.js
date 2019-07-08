import React, {Component} from 'react';
import MapTypeWrapper from "./MapTypeWrapper/MapTypeWrapper";
import SecondDimensional from "./SecondDimensional";
import {Table,message} from 'antd';

class Statement extends Component {

    constructor(props) {
        super(props);
        this.state={
            dataSource:[]
        }
    }


    componentDidMount(){
        const result = [

            {
                filed : '桥梁',
                number : 8
            },
            {
                filed : '隧道',
                number : 8
            },
            {
                filed: '路面',
                children: [
                    {
                        filed : '辅道',
                        number : 8
                    },
                    {
                        filed : '主道',
                        number : 12
                    },
                    {
                        filed : '匝道',
                        number : 6
                    },
                ]
            },
            {
                filed : '附属设施',
                children : [
                    {
                        filed : '标线',
                        number : 8
                    },
                    {
                        filed : '护栏',
                        number : 8
                    }
                ]
            },

        ];

        let source = [];
        let key=0;
        result.map(item =>{

            if(item.children && item.children.length>0){

                let start = key;
                let end = key+item.children.length;
                item.children.map(index=>{
                    let obj={};
                    obj.key = key;
                    obj.start = start;
                    obj.end = end;
                    obj.filed = item.filed;
                    obj.sort = index.filed;
                    obj.number = index.number;
                    obj.childLength = item.children.length;
                    key++;
                    source.push(obj);
                })

            }else {
                item.key=key;
                key++;
                source.push(item);
            }

        });
        if(source && source.length>0){
            this.setState({
                dataSource:source
            })
        }

    }

    render() {

        const {dataSource} = this.state;

        const columns =[
            {
                title: '构件类型',
                colSpan: 2,
                width : 109,
                align : 'center',
                dataIndex: 'filed',
                render: (value, row, index) => {
                    debugger
                    let temp;
                    const obj = {
                        children: value,
                        props: {},
                    };

                    if(row.childLength){
                        obj.props.rowSpan = row.childLength;

                    }

                    if(index>row.start && index < row.end){
                        obj.props.rowSpan = 0;
                    }
                    if(!row.childLength){
                        obj.props.colSpan = 2;
                    }
                    return obj;
                },
            },{

                title: 'Phone',
                colSpan: 0,
                align:'center',
                width : 131,
                dataIndex: 'sort',
                render: (value, row,) => {
                    const obj = {
                        children: value,
                        props: {},
                    };
                    if(!row.childLength){
                        obj.props.colSpan = 0;
                    }
                    return obj;
                },

            },{
                title: '构件数量',
                align:'center',
                width : 138,
                dataIndex: 'number'
            }
        ];



        return (
            <div style={{width : '394px'}}>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    bordered={true}
                    scroll={{y:300}}
                />
            </div>

        );
    }


}

export default Statement;