class Objects extends React.Component{
  constructor(props){
    super(props);
  }

  // Farmの関数getResourceData()を実行
  getResrcData = ()=>{
    return this.props.getResourceData();
  }

  addResource = (gain)=>{
    this.props.addResource(gain);
  }

  render(){
    return(
        <div id={"obj-container"}>
            <div id="add-btn" onClick={()=> this.addResource(1)}>
              click
            </div>
        </div>
    );
  }
}
