class Containers extends React.Component{
    render(){
        return(
            <div id="site-wrapper">
                <div id="game-container">
                    <Farm />
                </div>
            </div>
        );
    }
}

// 描画
ReactDOM.render(
    <Containers/>,
    $("#containers")[0]
);