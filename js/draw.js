(function( global,factory ){
	factory(global);
}( window,function(){
	window.Draw = function( id ) {
		this.current = null; //定义当前对象
	    this.changeEvent = []; //定义事件栈
	    this.stage = new createjs.Stage( id );//创建舞台对象
	
		createjs.Touch.enable(this.stage);
		createjs.Ticker.setFPS(20);
		var that = this;
	    createjs.Ticker.addEventListener("tick", function() {
	    	that.stage.update();	
	    });
	}
	
	Draw.prototype.onchange = function( cb ) {
		this.changeEvent.push(cb);
	    return this;
	}
	
	Draw.prototype.addBitmap = function( img, name ) {
		var bitmap = new createjs.Bitmap(); 
		bitmap.name = name || 'bitmap' + bitmap.id;
		bitmap.image = img;
		
		if( img.width > this.stage.canvas.width ) {
			 bitmap.scaleX = bitmap.scaleY = this.stage.canvas.width / img.width;
		}
		
		//设置点击区域
		var bounds = bitmap.getBounds();
		var hit = new createjs.Shape();
	    hit.graphics.beginFill('#000').drawRect(0,0,bounds.width,bounds.height);
	    bitmap.hitArea = hit;
		
		//设置事件
		var that = this;
		bitmap.on("mousedown", function( evt ) {
			that.__dragstart(evt);
		});
		bitmap.on("pressmove", function( evt ) {
			that.__dragmove(evt);	
		});
		
		//切换当前组件
		this.__changeCurrent(bitmap);
		this.stage.addChild(bitmap);
		
		return this;
	}
	
	Draw.prototype.addText = function( str ) {
		str = str || "请输入";
		var text = new createjs.Text(str,"20px Arial", "#000000");
		text.name = 'text' + text.id;
		text.x = text.y = 50;
	
		//设置点击区域
		var bounds = text.getBounds();
		var hit = new createjs.Shape();
	    hit.graphics.beginFill('#000').drawRect(0,0,bounds.width,bounds.height);
	    text.hitArea = hit;
		
		//设置事件
		var that = this;
		text.on("mousedown", function( evt ) {
			that.__dragstart(evt);
		});
		text.on("pressmove", function( evt ){
			that.__dragmove(evt);	
		});
	
		//切换激活对象
		this.__changeCurrent(text);
		this.stage.addChild(text);
		
		return this;
	}
	
	Draw.prototype.save = function() {
		//清除透明
		this.__clearAlpha(1);
		var d = $.Deferred();
		
		var that = this;
		setTimeout( function() {
	        d.resolve( that.stage.toDataURL("#FFFFFF","image/jpeg") );
	    },300 );
		return d.promise();
	}
		
	Draw.prototype.delete = function() {
		//删除当前
		this.stage.removeChild(this.current);
		this.current = null;
		
		//如果舞台中还有其它图形，则激活第一个
		var children = this.stage.children;
		if( children.length ) {
			//切换激活对象
			this.__changeCurrent(children[0]);
		}
	}
	
	Draw.prototype.clear = function() {
		this.stage.removeAllChildren();
	}
	
	//图形大小
	Draw.prototype.setScale = function( x, y ) {
		this.current.scaleX = x;
		this.current.scaleY = y;
	}
	Draw.prototype.getScale = function() {
		return {
			x : this.current.scaleX ,
			y : this.current.scaleY
		}
	}
	
	//旋转
	Draw.prototype.setRotation = function( deg ) {
		this.current.rotation = deg;
		
		//设置点击区域
		var bounds = this.current.getBounds();
		var hit = new createjs.Shape();
	    hit.graphics.beginFill('#000').drawRect(0,0,bounds.width,bounds.height);
	    this.current.hitArea = hit;
	}
	Draw.prototype.getRotation = function() {
		return this.current.rotation;
	}
	
	//颜色
	Draw.prototype.setColor = function( color ) {
		this.current.color = color;
	}
	Draw.prototype.getColor = function() {
		return this.current.color;
	}
	
	//大小
	Draw.prototype.setSize = function( size ) {
		var arr = this.current.font.split(" ");
		arr[0] = size;
		this.current.font = arr.join(" ");
	
		//设置点击区域
		var bounds = this.current.getBounds();
		var hit = new createjs.Shape();
	    hit.graphics.beginFill('#000').drawRect(0,0,bounds.width,bounds.height);
	    this.current.hitArea = hit;
	}
	Draw.prototype.getSize = function() {
		return this.current.font.split(" ")[0];
	}
	
		//字体
	Draw.prototype.setFamily = function( family ) {
		var arr = this.current.font.split(" ");
		arr[1] = family;
		this.current.font = arr.join(" ");
	}
	Draw.prototype.getFamily = function() {
		return this.current.font.split(" ")[1];
	}
	
		//图片
	Draw.prototype.setImage = function( img ) {
		this.current.image = img;
	}
	
	Draw.prototype.__firechange = function() {
		for( var i = 0;i < this.changeEvent.length;i++ ) {
			this.changeEvent[i]();
		}
	}
	
	Draw.prototype.__dragstart = function(evt) {
		//计算鼠标与图形的相对坐标
		evt.target.diffx = evt.stageX - evt.target.x;
		evt.target.diffy = evt.stageY - evt.target.y;
		
		this.stage.addChild(evt.target);
		//切换激活对象
		this.__changeCurrent(evt.target);
	}
	
	Draw.prototype.__dragmove = function(evt){
	    this.stage.addChild(evt.target); 
	    evt.target.x = evt.stageX - evt.target.diffx;
	    evt.target.y = evt.stageY - evt.target.diffy;
	}
	
	Draw.prototype.__clearAlpha = function( alpha ) {
		alpha = alpha || 0.5;
		this.stage.children.map(function( item ) {
			item.alpha = alpha;
		});
	}
	
	Draw.prototype.__changeCurrent = function( obj ) {
		//清空
	    if( this.current != obj  ) {
	        this.current = obj;
	        this.__clearAlpha();
	        this.current.alpha = 1;
	        this.__firechange();
	    }
	}
}));