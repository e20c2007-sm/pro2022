$("#canvas").attr({"width": $(window).width(), "height": $(window).height()});

const def = {
    size: {w: $("#canvas").width(), h: $("#canvas").height()},
    nums: [1, -1]
};

const canvas = $("#canvas")[0];
let ctx = canvas.getContext("2d");
let rect = canvas.getBoundingClientRect();

class Material{
    constructor(data){
        this.x = data.x;
        this.y = data.y;
        this.xWay = data.xWay * 10;
        this.yWay = data.yWay * 10;
        this.r = data.r;
        this.maxWidth = data.width;
        this.maxHeight = data.height;
        this.color = data.color;
        this.limit = data.limit;
        this.deg = 0;
        this.count = 0;
        setTimeout(()=>{
            this.xWay /= 10;
            this.yWay /= 10;
        }, 100);
    }

    popUpAdd(list){
        let elem = $("<div></div>");
        elem.addClass("pop-up-add");
        elem.text(`+${list.num}`).css({"position": "absolute", "top": `${list.y}px`, "left": `${list.x}px`, "transform": "translate(-50%, -50%)"});
        let target = elem.appendTo("#containers");
        setTimeout(()=>{
            target.fadeOut(1000, function(){
                target.remove();
            });
        }, 2000);
    }

    update(){
        let flag = false;
        this.x += this.xWay;
        this.y += this.yWay;
        if(this.x + (this.r*this.xWay) >= this.maxWidth || this.x + (this.r*this.xWay) <= 0){
            this.xWay *= -1;
            flag = true;
        }
        if(this.y + (this.r*this.yWay) >= this.maxHeight || this.y + (this.r*this.yWay) <= 0){
            this.yWay *= -1;
            flag = true;
        }

        if(flag){
            this.popUpAdd({
                "num": 1,
                "x": this.x,
                "y": this.y
            });
            return flag;
        }
    }
    draw(ctx){
        if(this.limit && this.limit <= this.count){
            return "delete";
        }

        let flag = this.update();
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.translate(this.x+this.r, this.y+this.r);
        this.deg += 0.5;
        ctx.rotate((this.deg*Math.PI) / 180);
        ctx.translate(-(this.x+this.r), -(this.y+this.r));
        ctx.rect(this.x, this.y, this.r*2, this.r*2);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
        if(flag){
            this.count++;
            return flag;
        }
    }
}

function randomNum(num){
    return Math.floor(Math.random() * num);
}