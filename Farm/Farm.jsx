// ゲームのメインコンポーネント
class Farm extends React.Component{
    constructor(props){
        super(props);

        // State
        this.info = {
            resource: 0, //資源量（変動値）
            timeLog: 0, //プレイ時間（総計）
            gain: 1,
            opt: {
                // ここで生産量などを増加させる何かしらを追加していく
            }
        }
    }

    //資源を生産する際の処理
    changeResrc(gain){
        /*
            gain...増加値
        */
        this.info.resource += gain;
    }

    // Farmコンポーネントで扱っているデータを、
    // 子コンポーネントで取得するための関数
    sendResrcData(){
        let data = {
            resource: this.info.resource
        }
        return data;
    }

    render(){
        return(
            <div id={"farm-container"}>
                <Info
                    getResrcData={()=> {return this.sendResrcData()}}
                />
                <Objects
                    getResrcData={()=> {return this.sendResrcData()}}
                    addResrc={(gain)=> this.changeResrc(gain)}
                />
            </div>
        );
    }
}
