var tetris={
	CELL_SIZE:26,
	RN:20,
	CN:10,
	OFFSET:15,
	pg:null,
	shape:null,
	nextShape:null,
	interval:200,
	timer:null,
	wall:null,
	score:0,
	lines:0,
	level:1,//游戏等级
	SCORES:[0,10,50,80,200],
	state:1,
	GAMEOVER:0,
	RUNNING:1,
	PAUSE:2,
	IMG_OVER:"img/game-over.png",
	IMG_PAUSE:"img/pause.png",
	paintState:function(){
		var img=new Image();
		switch(this.state){
			case this.GAMEOVER:
				img.src=this.IMG_OVER;break;
			case this.PAUSE:
				img.src=this.IMG_PAUSE;break;
		}
		this.pg.appendChild(img);
	},
	isGameOver:function(){
		for(var i=0;i<this.nextShape.cells.length;i++){
			var cell=this.nextShape.cells[i];
			if(this.wall[cell.r][cell.c]!=null){
			return true;//写反
			}
		}
		return false;
	},
	
	randomShape:function(){
		switch(Math.floor(Math.random()*3)){
			case 0:
				return new O();
			case 1:
				return new I();
			case 2:
				return new T();
		}
	},
	start:function(){
		var self=this;
		self.state=self.RUNNING;
		self.score=0;
		self.lines=0;
		self.level=1;
		self.pg=document.querySelector(".playground");
		self.shape=self.randomShape();
		self.nextShape=self.randomShape();//缺漏
		self.wall=[];
		for(var r=0;r<self.RN;r++){
			self.wall.push(new Array(self.CN));
		}

		self.timer=setInterval(function(){
			self.moveDown();
		},self.interval);
		document.onkeydown=function(){
			var e=window.event||arguments[0];
			switch(e.keyCode){
				case 37:
					self.state==self.RUNNING&&
						self.moveLeft();
				break;
				case 39:
					self.state==self.RUNNING&&//缺漏
					self.moveRight();
				break;
				case 40:
					self.state==self.RUNNING&&//缺漏
					self.moveDown();
				break;
				case 38:
					self.state==self.RUNNING&&//缺漏
					self.rotateR();
				break;
				case 90:
					self.state==self.RUNNING&&//缺漏
					self.rotateL();
				break;
				case 83:
					if(self.state==self.GAMEOVER){
					self.start();
				}
				break;
				case 80:
					if(self.state==self.RUNNING){
					self.state=self.PAUSE;
					clearInterval(self.timer);
					self.timer=null;
					self.paint();
				}
				break;
				case 67:
					if(self.state==self.PAUSE){
					self.state=self.RUNNING;
					self.timer=setInterval(function(){
						self.moveDown();
					},self.interval);
				}break;
				case 81:
					if(self.state!=self.GAMEOVER){
					self.state=self.GAMEOVER;
					if(self.timer!=null){
							clearInterval(self.timer);
							self.timer=null;
						}
						self.paint();
				}
			}
		}
		self.paint();
	},
	paintNextShape:function(){
		var frag=document.createDocumentFragment();
		for(var i=0;i<this.nextShape.cells.length;i++){
			var img=new Image();
			img.src=this.nextShape.cells[i].img;
			img.style.top=(this.nextShape.cells[i].r+1)*this.CELL_SIZE+this.OFFSET+"px";
			img.style.left=(this.nextShape.cells[i].c+11)*this.CELL_SIZE+this.OFFSET+"px";
			frag.appendChild(img);
		}
		this.pg.appendChild(frag);
	},
	rotateR:function(){
		this.shape.rotateR();
		if(!this.canRotate()){
			this.shape.rotateL();
		}
	},
	canRotate:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.c<0||cell.c>this.CN
				||cell.r<0||cell.r>=this.RN
				||this.wall[cell.r][cell.c]!=null){
				return false;
			}
		}
		return true;
	},
	rotateL:function(){
		this.shape.rotateL();
		if(!this.canRotate()){
			this.shape.rotateR();
		}
	},
	moveLeft:function(){
		if(this.canLeft()){
			this.shape.moveLeft();
		}
	},
	canLeft:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.c==0
				||this.wall[cell.r][cell.c-1]!=null){
				return false;//返回false
			}
		}
		return true;
	},
	moveRight:function(){
		if(this.canRight()){
			this.shape.moveRight();
		}
	},
	canRight:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.c==this.CN-1
				||this.wall[cell.r][cell.c+1]!=null){
				return false;//返回false
			}
		}
		return true;
	},
	canDown:function(){
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.r==this.RN-1
				||this.wall[cell.r+1][cell.c]){
				return false;//返回false
			}
		}
		return true;
	},
	paint:function(){
		this.pg.innerHTML=this.pg.innerHTML.replace(/<img(.*?)>/g,"");
		this.paintShape();
		this.paintNextShape();
		this.paintWall();
		this.paintScore();
		this.paintState();
	},
	moveDown:function(){
		if(this.canDown()){
			this.shape.moveDown();
		}else{
			for(var i=0;i<this.shape.cells.length;i++){
				var cell=this.shape.cells[i];
				this.wall[cell.r][cell.c]=cell;
			}
			var lines=this.deletRows();
			this.score+=this.SCORES[lines];
			this.lines+=lines;
			
			if(!this.isGameOver()){	
				this.shape=this.nextShape;
				this.nextShape=this.randomShape();
			}else{
				clearInterval(this.timer);
				this.timer=null;
				this.state=this.GAMEOVER;
			}
		}
		this.paint();
	},
	paintScore:function(){
		var spans=document.querySelectorAll(".playground>p>span");
		spans[0].innerHTML=this.score;
		spans[1].innerHTML=this.lines;
		spans[2].innerHTML=this.level;
	},
	deletRows:function(){
		for(var r=this.RN-1,lines=0;0<=r;r--){
			if(this.isFullRow(r)){
				this.deletRow(r);
				r++;
				lines++;
				if(lines==4){break;}
			}
		}
		return lines;
	},
	deletRow:function(row){
		for(var r=row;0<=r;r--){
			this.wall[r]=this.wall[r-1];
			this.wall[r-1]=[];
			for(var i=0;i<this.CN;i++){
				if(this.wall[r][i]!=null){
					this.wall[r][i].r++;
				}
			}
			if(this.wall[r-2].join("")==""){
				break;
			}
		}
	},
	isFullRow:function(row){
		for(var i=0;i<this.CN;i++){
			if(this.wall[row][i]==null){
				return false;
			}
		}
		return true;
	},
	paintWall:function(){
		var frag=document.createDocumentFragment();
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				var cell=this.wall[r][c];
				if(cell){
					var img=new Image();
					img.src=cell.img;
					img.style.top=cell.r*this.CELL_SIZE+this.OFFSET+"px";
					img.style.left=cell.c*this.CELL_SIZE+this.OFFSET+"px";
					frag.appendChild(img);
				}
			}
		}
		this.pg.appendChild(frag);
	},
	paintShape:function(){
		var frag=document.createDocumentFragment();
		for(var i=0;i<this.shape.cells.length;i++){
			var img=new Image();
			img.src=this.shape.cells[i].img;
			img.style.top=this.shape.cells[i].r*this.CELL_SIZE+this.OFFSET+"px";
			img.style.left=this.shape.cells[i].c*this.CELL_SIZE+this.OFFSET+"px";
			frag.appendChild(img);
		}
		this.pg.appendChild(frag);
	}
}
window.onload=function(){
	tetris.start();
}