// ゲームのメインコンポーネント
class Farm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            resouse: 0,
            timeLog: 0,
            opt: {
                // ここで生産量などを増加させる何かしらを追加していく
            }
        }
    }

    addResouse(gain){
        this.setState({resouse: this.state.resouse + gain});
    }

    getResouseData(){
        let data = {
            resouse: this.state.resouse
        }
        return data;
    }

    render(){

        return(
            <div id={"farm-container"}>
                <Info getResouseData={this.getResouseData} />
                <Objects addResouse={this.addResouse} />
            </div>
        );
    }
}