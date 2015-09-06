var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var canvas = document.getElementById("canvas-id");
canvas.width = innerWidth;
canvas.height = innerHeight;
var context = canvas.getContext("2d");

var particles = [];

var input = {
	size:1,
	number:500,
	stickiness:3000,
	speed:0.3,
	spawntime:0,
	alpha : 0.03
}

var hueshift = 360/input.number;
var spawn={x:3.1415,y:-1};
var h = 0;
var hold;
var mouse = {x:canvas.width/2,y:canvas.height/2}

canvas.addEventListener("mousedown",function(e){
if (spawn.x==3.1415){setTimeout(summon,5);}
spawn.x =e.layerX;
spawn.y = e.layerY;
hold = true;
})
canvas.addEventListener("mouseup",function(e){
hold = false;
})

function reset(){
context.clearRect(0,0,canvas.width,canvas.height);
particles=[];
spawn.x=3.1415;
}

function particle(){
	this.x = spawn.x;
	this.y = spawn.y;
	this.ax = 0;
	this.ay = 0;
	this.hue=Math.round(h);
	h+=360/input.number;
	//this.speed = (this.hue/300)*input.stickiness + input.speed;
	//this.speed = this.hue/input.stickiness + input.speed; <--working
}


function control(name,val){
switch(name){
	case "size" :
		input.size = val;
		break;
	case "number":
		input.number = val;
		break;
	case "stickiness":
		input.stickiness = val;
		break;
	case "speed":
		input.speed = val;
		break;
	case "spawntime":
		input.spawntime = val;
		break;
	case "alpha":
		input.alpha = val;
		break;

}

}

function summon(){
	if (particles.length>= input.number)return;
	var count;
	if (input.spawntime==0)
		count=input.number;
	else
		count = input.number/(input.spawntime*1000/5)
	//var count = (input.spawntime*5000)/input.number;
	//count = input.number;
	if (count==0){count=input.number;}
		for (var a=0;a<count;a++){
		particles.push(new particle());
		}
	setTimeout(summon, 5);
}

canvas.addEventListener("mousemove", function (args) {	
	mouse.x = args.layerX;
	mouse.y = args.layerY;
	if (hold){
	spawn.x = args.layerX;
	spawn.y = args.layerY;
	}

}, false);


function update() {
	for (var a=0;a<particles.length;a++){
		var angle = Math.atan2(particles[a].x-mouse.x,particles[a].y-mouse.y);
		speed = particles[a].hue/input.stickiness + input.speed;
		particles[a].ax+=-Math.sin(angle)*speed;
		particles[a].ay+=-Math.cos(angle)*speed;
		particles[a].x+=particles[a].ax;
		particles[a].y+=particles[a].ay;
	}
	setTimeout(update, 10);
}


function draw() {
	context.globalCompositeOperation = 'source-over';
	context.fillStyle="rgba(0,0,0,0.01)"
	context.fillRect(0,0,canvas.width,canvas.height);
	context.globalCompositeOperation = 'lighter';
	for (var a=0;a<particles.length;a++){
	
		context.fillStyle = "hsla("+particles[a].hue+",100%,50%,"+input.alpha+")";
		//context.beginPath();
		//context.arc(particles[a].x,particles[a].y,input.size,0,Math.PI*2);
		context.fillRect(particles[a].x,particles[a].y,input.size,input.size);
		//context.fill();
	}
    requestAnimationFrame(draw);
}
update();
draw();