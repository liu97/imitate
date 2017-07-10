	var canvas=document.getElementById("canvas");
	var ctx=canvas.getContext("2d");

	var play=document.getElementById("play");
	var oselect=document.getElementById("select");
	var sbutton=document.querySelectorAll(".select_button") ;
	var operation=document.getElementById("operation");
	var mask=document.getElementById("mask");
	var score=document.getElementById("score");
	var nowScore=document.getElementById("nowScore");
	var highScore=document.getElementById("highScore");
	var re=/[0-9]+/g;
	var height=parseInt(getStyle(canvas,"height").match(re));
	var width=parseInt(getStyle(canvas,"width").match(re));

	var snake=[];//蛇身数组
	var use=[];//食物可用位置数组
	var snakex=-1,snakey=1;//蛇头位置（格数）
	var dir=3;//蛇头方向
	var len=6;//蛇长度
	var speed=200;//蛇前进方向
	var foodx=foody=3;//食物位置（格数）
	var foodColor="yellow";//食物颜色
	var snakeColor="white";//蛇颜色
	var boxwh=20;//格子大小
	var jishu=0;//判断play按键是否已经点击
	var nscore=0;//现在的分数
	var timer=0;//计时器

	window.onload=function(){
		if(isPC()){
			for (var i = 0; i < width/boxwh; i++) {
				for(var j=0; j < height/boxwh; j++){
					use.unshift({'x':i,'y':j})
				}
			}
			writeHeight();
			writeWidth();
			nowScore.innerHTML="Now&nbsp;Score:<span>"+nscore+"</span>";
			play.onclick=select;
		}
		else{
			operation.style.display="none";
			play.style.display="none";
			mask.style.fontSize="40px";
			mask.innerHTML="对不起，本游戏版本只支持电脑使用";
		}

		
				// move();
	}
	//检测是否不是手机访问
	function isPC() {
	    var userAgentInfo = navigator.userAgent;
	    var Agents = ["Android", "iPhone",
	                "SymbianOS", "Windows Phone",
	                "iPad", "iPod"];
	    var flag = true;
	    for (var v = 0; v < Agents.length; v++) {
	        if (userAgentInfo.indexOf(Agents[v]) > 0) {
	            flag = false;
	            break;
	        }
	    }
	    return flag;
	}
	//画竖线
	function writeHeight(){
		for (var i = 0; i <width-1; i=i+boxwh) {
			ctx.save();
			ctx.lineWidth=1;
			ctx.strokeStyle="white";
			ctx.beginPath();
			ctx.moveTo(i,0);
			ctx.lineTo(i,height);
			ctx.stroke();
			ctx.closePath();
			ctx.restore();
		}
	}
	//画横线
	function writeWidth(){
		for (var i = 0; i <height-1; i=i+boxwh) {
			ctx.save();
			// ctx.translate(i,0)
			ctx.lineWidth=1;
			ctx.strokeStyle="white";
			ctx.beginPath();
			ctx.moveTo(0,i);
			ctx.lineTo(width,i)	;
			ctx.stroke();
			ctx.closePath();
			ctx.restore();
		}
	}
	//画食物
	function writeFood(fx,fy){
		ctx.save();
		ctx.fillStyle=foodColor;
		ctx.translate(fx*boxwh+boxwh/2,fy*boxwh+boxwh/2)
		ctx.beginPath();
		ctx.arc(0,0,boxwh/2.5,0,2*Math.PI,false);
		ctx.closePath();
		ctx.fill();
		ctx.restore();

	}
	//画蛇
	function writeSnake(){
		ctx.save();
		ctx.fillStyle=snakeColor;
		ctx.beginPath();
		ctx.translate(snakex*boxwh+boxwh/2,snakey*boxwh+boxwh/2)
		ctx.arc(0,0,boxwh/2.5,0,2*Math.PI,false);
		// ctx.fillRect(+2,+2,boxwh-3,boxwh-3);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}
	//蛇前进
	function move(){
		switch(dir){
			case 1:
				snakex-=1;break;
			case 2:
				snakey-=1;break;
			case 3:
				snakex+=1;break;
			case 4:
				snakey+=1;break;
		}
		// console.log(snakex,snakey);
		snake.unshift({'x':snakex,'y':snakey});
		// console.log(snake);
		
		for (var i = 0; i < use.length; i++) {
			if(use[i].x==snakex&&use[i].y==snakey){
				use.splice(i,1);

			}
		}
		// console.log(use);
		if(snakex==foodx&&snakey==foody){//判断蛇是否吃了食物
			nscore++;
			nowScore.innerHTML="Now&nbsp;Score:<span>"+nscore+"</span>";//更新现在的分数
			if(typeof(Storage)!=="undefined")
			{
				if(nscore>localStorage.hscore){
					localStorage.hscore=nscore;
				}
			}
			len++;
			if(use.length==0){
				alert("恭喜你吃完了所有的豆豆，棒棒哒！");
				window.location.reload();

			}
			flashFood();
		}
		if(snake.length>len){//让蛇保持前进
			
			clearFood();
			clearPath();
			use.push(snake.pop());

		}
		writeSnake();
		for (var i = 1; i < snake.length; i++) {
			if(snakex==snake[i].x&&snakey==snake[i].y){
				window.clearInterval(timer);
				alert("撞到自己，游戏结束！！！");
				window.location.reload();
			}
		}
		if(snakex<=-1||snakey<=-1||snakex>=width/boxwh||snakey>=height/boxwh){
			window.clearInterval(timer);
			alert("撞到墙，游戏结束！！！");
			window.location.reload();
		}
	}
	//更新食物
	function flashFood(){

		var u=Math.ceil(Math.random()*(use.length-1));
		foodx=use[u].x;
		foody=use[u].y;
		
		writeFood(foodx,foody);
	}
	//清除被吃掉的食物
	function clearFood(foodx,foody){
		ctx.beginPath();
		ctx.clearRect(foodx+2,foody+2,boxwh-3,boxwh-3);
	}
	//清除前进留下的痕迹
	function clearPath(){
		ctx.beginPath();
		ctx.clearRect(snake[snake.length-1].x*boxwh+2,snake[snake.length-1].y*boxwh+2,boxwh-3,boxwh-3);
		// writeFood(snake[snake.length-1].x,snake[snake.length-1].y);
	}
	function getStyle(obj,name){
		if(obj.currentStyle){
			return obj.currentStyle[name];
		}
		else{
			return getComputedStyle(obj,false)[name];
		}
	}
	//选择速度
	function select(){
		// operation.style.display="none";
		$("#operation").fadeOut("2000");//操作提示消失
		// play.style.display="none";
		$("#play").fadeOut("2000");//开始按键消失
		// oselect.style.display="block";
		$("#select").fadeIn("1000");//速度选择显示
		sbutton[0].onclick=function(){
			speed=200;
			// oselect.style.display="none";
			$("#select").fadeOut("2000");
			start();
			// alert(speed);
		}
		sbutton[1].onclick=function(){
			speed=130;
			$("#select").fadeOut("2000");
			start();
			// alert(speed);
		}
		sbutton[2].onclick=function(){
			speed=80;
			$("#select").fadeOut("2000");
			start();
			// alert(speed);
		}
	}
	//获取本地最高分数
	function readLocal(){
		if(typeof(Storage)!=="undefined")
		{
			// localStorage.setItem('hscore',0);
			// console.log(localStorage.getItem('hscore'));
			if (localStorage.hscore)
			{

				$("#highScore").html("High&nbsp;Score:"+localStorage.hscore);

			}
			else
			{
				localStorage.hscore=0;
				$("#highScore").html("High&nbsp;Score:"+localStorage.hscore);
			}

		}
		else
		{

			$("#highScore").html("对不起，您的浏览器不支持 web 存储。");
		}
	}
	//点了play,选择了速度,开始游戏
	function start(){
		if(!jishu){
			jishu=1;
			window.setTimeout(function(){
				mask.innerHTML=3;
				window.setTimeout(function(){
					mask.innerHTML=2;
					window.setTimeout(function(){
						mask.innerHTML=1;
						window.setTimeout(function(){
							mask.innerHTML="开始";
							window.setTimeout(function(){
								mask.style.display="none";//遮罩消失
								score.style.opacity=1,score.style.filter="alpha(opacity=100)"//分数出现
								writeFood(foodx,foody);//画食物
								readLocal();//获取最高分数
								
								move();
								timer=window.setInterval(move,speed);
								document.onkeydown=function(e){
										var event=e|window.event;
										var keydown=e.keyCode;
										switch(keydown){
											case 37:
												if(dir!=3)
													dir=1;break;//左
											case 38:
												if(dir!=4)
													dir=2;break;//上
											case 39:
												if(dir!=1)
													dir=3;break;//右
											case 40:
												if(dir!=2)
													dir=4;break;//下
										}
										num=0;
								}
							},1000)
						},500)
					},500)
				},500)
			},500)
		}
	}