function Cell(r,c,img){
	this.r=r;
	this.c=c;
	this.img=img;
}

function Shape(orgi){
	this.orgi=orgi;
	this.statei=0;
}
Shape.prototype={
	IMGS:{
		O:"img/O.png",
		I:"img/I.png",
		J:"img/J.png",
		L:"img/L.png",
		S:"img/S.png",
		Z:"img/Z.png",
		T:"img/T.png",
	},
	moveDown:function(){
		for(var i=0;i<this.cells.length;i++){
			this.cells[i].r++;
		}	
	},
	moveLeft:function(){
		for(var i=0;i<this.cells.length;i++){
			this.cells[i].c--;
		}	
	},
	moveRight:function(){
		for(var i=0;i<this.cells.length;i++){
			this.cells[i].c++;
		}	
	},
	rotateR:function(){
		this.statei++;
		this.statei==this.states.length&&(this.statei=0);
		this.rotate();
	},
	rotateL:function(){
		this.statei--;
		this.statei==-1&&(this.statei=this.states.length-1);
		this.rotate();
	},
	rotate:function(){
		var state=this.states[this.statei];
		var r=this.cells[this.orgi].r;
		var c=this.cells[this.orgi].c;
		for(var i=0;i<this.cells.length;i++){
			this.cells[i].r=r+state[i].r;
			this.cells[i].c=c+state[i].c;
		}
	},
}
function O(){
	Shape.call(this,0);
	this.cells=[
		new Cell(0,4,this.IMGS.O),new Cell(0,5,this.IMGS.O),
		new Cell(1,4,this.IMGS.O),new Cell(1,5,this.IMGS.O)
	];
	this.states=[
		State(0,0,0,+1,+1,0,+1,+1)	
	];
}

O.prototype.__proto__=Shape.prototype;
function T(){
	Shape.call(this,1);
	this.cells=[
		new Cell(0,3,this.IMGS.T),new Cell(0,4,this.IMGS.T),new Cell(0,5,this.IMGS.T),
		new Cell(1,4,this.IMGS.T)
	];
	this.states=[
		State(0,-1,0,0,0,+1,+1,0),	
		State(-1,0,0,0,+1,0,0,-1),	
		State(0,+1,0,0,0,-1,-1,0),	
		State(+1,0,0,0,-1,0,0,+1)
	];
}

T.prototype.__proto__=Shape.prototype;
function I(){
	Shape.call(this,1);
	this.cells=[
		new Cell(0,3,this.IMGS.I),new Cell(0,4,this.IMGS.I),new Cell(0,5,this.IMGS.I),
		new Cell(0,6,this.IMGS.I)
	];
	this.states=[
		State(0,-1,0,0,0,+1,0,+2),	
		State(-1,0,0,0,+1,0,+2,0)
	];
}

I.prototype.__proto__=Shape.prototype;
function State(r0,c0,r1,c1,r2,c2,r3,c3){//一个图形的不同状态
	return [
		{r:r0,c:c0},
		{r:r1,c:c1},
		{r:r2,c:c2},
		{r:r3,c:c3}
	];
}