class Objects extends React.Component{
  constructor(props){
    super(props);
  }

  // Farmの関数getResrcData()を実行
  getResrcData = ()=>{
    return this.props.getResrcData();
  }

  addResrc = (gain)=>{
    this.props.addResrc(gain);
  }

  render(){
    return(
        <div id={"obj-container"}>
            <div type="button" id="add-btn" onClick={()=> {this.props.createMaterial({color: "#f2e2ea", limit: 3});}}></div>
            <div id="add-btn-click">PUSH</div>
        </div>
    );
  }
}
