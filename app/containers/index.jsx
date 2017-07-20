import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as userinfoActions from '../actions/userinfo';

import A from '../components/redux/A';
import B from '../components/redux/B';
import C from '../components/redux/C';

import Header from '../components/Header';
import Home from './Home';
import TodoList from './Todo';

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            now: Date.now()
        }
    }
    render() {
        const arr = ['a','b','c'];
        //react里面编写模板使用jsx语法，*注：jsx中不能一次性返回零散的多个节点，如果有个请包涵在一个节点中
        return (
            <div>
                <Header title="Header"/>
                <br/>

                <p style={{display: 'block', fontSize: '30px'}}>React MPA Demo</p>
                <p className="test">className</p>
                <br/>

                {
                    /* jsx 里面的注释 */
                    true ? <p>true</p> : <div><p>false</p></div>
                }
                <br/>

                <div>
                    {
                        arr.map((item, index) => {
                            return <p key={index}>this is {item}</p>
                        })
                    }
                </div>
                <br/>

                <button onClick={this.chlickHandler.bind(this)}>event {this.state.now}</button>
                <br/>

                <p>Date: {this.state.now}</p>
                <br/>

                <a href="todolist.html">Link</a>
                <hr/>

                <A userinfo={this.props.userinfo}/>
                <hr/>
                <B userinfo={this.props.userinfo}/>
                <hr/>
                <C actions={this.props.userinfoActions}/>

                <Home />
            </div>
        );
    }

    componentDidMount(){
        //ajax
        // 模拟登陆
        this.props.userinfoActions.login({
            userid: 'abc',
            city: 'beijing'
        })
    }

    componentDidUpdate(prevProps, prevState){
        //update
    }

    shouldComponentUpdate(nextProps, nextState){
        //none
    }

    chlickHandler(e){
        e.preventDefault();
        console.log(Date.now());
        this.setState({
            now: Date.now()
        })
    }
}

function mapStateToProps(state) {
    return {
        userinfo: state.userinfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userinfoActions: bindActionCreators(userinfoActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
