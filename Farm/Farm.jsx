// ゲームのメインコンポーネント
class Farm extends React.Component{
    constructor(props){
        super(props);

        // State
        this.state = {
            resouse: 0, //資源量（変動値）
            timeLog: 0, //プレイ時間（総計）
            opt: {
                // ここで生産量などを増加させる何かしらを追加していく
            }
        }
    }

    //資源を生産する際の処理
    addResouce(gain){
        /*
            gain...増加値
        */
        this.setState({resouse: this.state.resouse + gain});
    }

    // Farmコンポーネントで扱っているデータを、
    // 子コンポーネントで取得するための関数
    getResouceData(){
        let data = {
            resouse: this.state.resouse
        }
        return data;
    }

    render(){

        return(
            <div id={"farm-container"}>
                <Info
                    getResouseData={this.getResouceData}
                />
                <Objects
                    getResouseData={this.getResouceData}
                    addResouse={this.addResouce}
                />
            </div>
        );
    }
}