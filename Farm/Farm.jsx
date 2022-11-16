// ゲームのメインコンポーネント
class Farm extends React.Component{
    constructor(props){
        super(props);

        // State
        this.state = {
            resource: 0, //資源量（変動値）
            timeLog: 0, //プレイ時間（総計）
            gain: 1,
            opt: {
                // ここで生産量などを増加させる何かしらを追加していく
            }
        }
    }

    //資源を生産する際の処理
    changeResource(gain){
        /*
            gain...増加値
        */

        this.setState({resource: this.state.resource + gain});
        setTimeout(()=>{
            console.log(this.sendResourceData());
        }, 1000)
    }

    // Farmコンポーネントで扱っているデータを、
    // 子コンポーネントで取得するための関数
    sendResourceData(){
        let data = {
            resource: this.state.resource
        }
        return data;
    }

    render(){
        return(
            <div id={"farm-container"}>
                <Info
                    getresourceData={this.sendResourceData}
                />
                <Objects
                    getResourseData={this.sendResourceData}
                    addResource={this.changeResource}
                />
            </div>
        );
    }
}
