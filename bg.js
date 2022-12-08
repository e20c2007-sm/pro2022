$("#canvas").attr({"width": $(window).width(), "height": $(window).height()});

const def = {
    size: {w: $("#canvas").width(), h: $("#canvas").height()},
    nums: [1, -1]
};

let materials = [];

const canvas = $("#canvas")[0];
let ctx = canvas.getContext("2d");
let rect = canvas.getBoundingClientRect();

class Material{
    constructor(data){
        this.x = data.x;
        this.y = data.y;
        this.xWay = data.xWay;
        this.yWay = data.yWay;
        this.r = data.r;
        this.maxWidth = data.width;
        this.maxHeight = data.height;
        this.deg = 0;
    }
    update(){

        this.x += this.xWay;
        this.y += this.yWay;
        if(this.x + (this.r*this.xWay) >= this.maxWidth || this.x + (this.r*this.xWay) <= 0){
            this.xWay *= -1;
        }
        if(this.y + (this.r*this.yWay) >= this.maxHeight || this.y + (this.r*this.yWay) <= 0){
            this.yWay *= -1;
        }
    }
    draw(ctx){
        this.update();
        ctx.save();
        ctx.strokeStyle = "#f2e2ea";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.translate(this.x+this.r, this.y+this.r);
        this.deg += 0.5;
        ctx.rotate((this.deg*Math.PI) / 180);
        ctx.translate(-(this.x+this.r), -(this.y+this.r));
        ctx.rect(this.x, this.y, this.r*2, this.r*2);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
}

function randomNum(num){
    return Math.floor(Math.random() * num);
}

function anime(){
    if(materials.length > 0){
        ctx.clearRect(0, 0, rect.width, rect.height);
        materials.forEach(e => {
            e.draw(ctx);
        });
    }
    requestAnimationFrame(anime);
}

function createMaterial(){
    console.log("ok")
    materials.push(
        new Material({
            x: def.size.w/2,
            y: def.size.h/2,
            xWay: (Math.random(1)+1)*def.nums[randomNum(2)],
            yWay: (Math.random(1)+1)*def.nums[randomNum(2)],
            r: 10,
            width: def.size.w,
            height: def.size.h
        })
    );
}

anime();