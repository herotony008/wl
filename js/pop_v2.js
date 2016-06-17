/***
	Author:LiuWang
	Date:2015/07/06
***/

//局限，body在ie6中 不能有 style 样式。
//在ie6下，会将select给占位隐藏；关闭弹窗的时候，再将select显示（这样会在select上多个style="visibility:visible;"）

/*使用说明：
	弹出窗口1 Popcall.showpop(id,maskindex,popindex)",
	其中id为弹窗的唯一id；
	maskindex 是背景层的zindex 的值， 为大于等于（默认999）的数值，如果（maskindex和popindex任意一个）不写，则为默认999；
	popindex  是弹窗的zindex 的值，为大于等于（默认1000）的数值，如果（maskindex和popindex任意一个）不写，则为默认1000；
	可在弹窗上，再弹弹窗，此时参数需写全；遮住前面的弹窗
	例如：第一次：Popcall.showpop('pop') or Popcall.showpop('pop',999,1002),
		第二次：Popcall.showpop('pop2',1001,1002) or Popcall.showpop('pop2',1003,1004),
		
	新增弹出窗口2 Popcall.showpopG(id,maskindex,popindex)",   用法同 弹出窗口1；(适用弹窗高度不定，在弹出的时候，还可能再次改变高度，该高度超过浏览器的高度。使其弹窗随滚动条滚动)
		  		  
	关闭窗口 Popcall.hidepop(id,maskindex)",
	其中id为弹窗的唯一id；
	maskindex 是背景层的zindex 的值， 为大于等于（默认999）的数值，如果不写，则会在这次关闭中，删除背景层；
	如果写上，这次只会改变背景层的zindex值，不会删掉背景层节点；
	例如：Popcall.hidepop('pop'), //删除背景层节点
		Popcall.hidepop('pop',999), //关闭弹窗，背景层zindex设为999;
		
	
*/
var Popcall = {
		showpop:function(id,maskindex,popindex){
			//背景层
			this.el = document.getElementById(id);
			this.Select = document.getElementsByTagName("select");
			var w = document.documentElement.clientWidth || document.body.clientWidth;
			var h = document.documentElement.clientHeight || document.body.clientHeight;
			var scrolltop_ie6 = document.documentElement.scrollTop || document.body.scrollTop;
			var isIE6=!-[1,]&&!window.XMLHttpRequest;
			if(this.el){
				//背景层
				var back_mask = document.getElementById("back_mask");
				if(!back_mask){
					this.mask = document.createElement("div");				
					document.body.appendChild(this.mask)
					this.mask.innerHTML = '<iframe style="position:absolute;z-index:900;width:100%;height:100%;top:0;left:0;opacity=0.5;filter:alpha(opacity=0.5);" frameborder="0" src="about:blank"></iframe>';
					this.mask.id="back_mask";
					
					
					this.mask.style.top=this.mask.style.left=0+"px";
					this.mask.style.backgroundColor="#000000";
					this.mask.style.opacity=0.5;
					this.mask.style.filter="alpha(opacity=50)";
					if(isIE6){
						this.mask.style.position = "absolute";
						if(document.body.scrollWidth>w){
							this.mask.style.width = document.body.scrollWidth + "px";
						}else{
							this.mask.style.width = "100%";	
						}
						if(document.body.scrollHeight>h){
							this.mask.style.height = document.body.scrollHeight + "px";
						}else{
							this.mask.style.height = h + "px";
						}
					}else{
						this.mask.style.position = "fixed";
						this.mask.style.width = "100%";
						this.mask.style.height = "100%";
					}
					
					if(maskindex<999 || !maskindex || !popindex){
						this.mask.style.zIndex=999;
					}else{
						this.mask.style.zIndex=maskindex;
					}
				}else{
					if(maskindex<999|| !maskindex || !popindex){
						this.mask.style.zIndex=999;
					}else{
						this.mask.style.zIndex=maskindex;
					}
				}
				
				
				
				
				//弹窗
				this.el.style.display = "block";
				if(popindex<1000||  !maskindex || !popindex){
					this.el.style.zIndex=1000;
				}else{
					this.el.style.zIndex=popindex;
				}
				
				
				if(this.el.offsetHeight<=h && this.el.offsetWidth<=w){
					if (isIE6) {
						this.el.style.position = "absolute";	
					}else{
						this.el.style.position = "fixed";
					}
					this.el.style.left="50%";
					this.el.style.top="50%";
					this.el.style.marginLeft = -this.el.offsetWidth/2 +"px";
					this.el.style.marginTop = -this.el.offsetHeight/2 +"px";
					if (isIE6) {
						//解决ie6使用表达式时会发现跳动现象
						document.body.style.backgroundAttachment = "fixed";
						document.body.style.backgroundImage = "url(about:blank)";
						this.el.style.setExpression('top', 'documentElement.scrollTop+documentElement.clientHeight/2');
						document.documentElement.scrollTop = document.documentElement.scrollTop-1;
					}
				}else if(this.el.offsetHeight>h  && this.el.offsetWidth<=w){
					this.el.style.position = "absolute";
					this.el.style.left="50%";
					this.el.style.top=0;
					this.el.style.marginLeft = -this.el.offsetWidth/2 +"px";
					this.el.style.marginTop = 0;
					if (isIE6) {
						for(var i =0;i<this.Select.length;i++){
							this.Select[i].style.visibility = 'hidden'
						}
						
					}
				}else{
					this.el.style.position = "absolute";
					this.el.style.left=0;
					this.el.style.top=0;
					this.el.style.marginLeft = 0;
					this.el.style.marginTop = 0;
				}
			}
			
		},
		showpopG:function(id,maskindex,popindex){
			//背景层
			this.el = document.getElementById(id);
			this.Select = document.getElementsByTagName("select");
			var w = document.documentElement.clientWidth || document.body.clientWidth;
			var h = document.documentElement.clientHeight || document.body.clientHeight;
			var scrolltop_ie6 = document.documentElement.scrollTop || document.body.scrollTop;
			var isIE6=!-[1,]&&!window.XMLHttpRequest;
			if(this.el){
				//背景层
				var back_mask = document.getElementById("back_mask");
				if(!back_mask){
					this.mask = document.createElement("div");				
					document.body.appendChild(this.mask)
					this.mask.innerHTML = '<iframe style="position:absolute;z-index:900;width:100%;height:100%;top:0;left:0;opacity=0;filter:alpha(opacity=0);" frameborder="0" src="about:blank"></iframe>';
					this.mask.id="back_mask";
					this.mask.style.top=this.mask.style.left=0+"px";
					this.mask.style.backgroundColor="#000000";
					this.mask.style.opacity=0.5;
					this.mask.style.filter="alpha(opacity=50)";
					if(isIE6){
						this.mask.style.position = "absolute";
						if(document.body.scrollWidth>w){
							this.mask.style.width = document.body.scrollWidth + "px";
						}else{
							this.mask.style.width = w + "px";	
						}
						if(document.body.scrollHeight>h){
							this.mask.style.height = document.body.scrollHeight + "px";
						}else{
							this.mask.style.height = h + "px";
						}
					}else{
						this.mask.style.position = "fixed";
						this.mask.style.width = "100%";
						this.mask.style.height = "100%";
					}
					
					
					if(maskindex<999 || !maskindex || !popindex){
						this.mask.style.zIndex=999;
					}else{
						this.mask.style.zIndex=maskindex;
					}
				}else{
					if(maskindex<999|| !maskindex || !popindex){
						this.mask.style.zIndex=999;
					}else{
						this.mask.style.zIndex=maskindex;
					}
				}
				
				
				
				
				//弹窗
				this.el.style.display = "block";
				if(popindex<1000||  !maskindex || !popindex){
					this.el.style.zIndex=1000;
				}else{
					this.el.style.zIndex=popindex;
				}
				this.el.style.position = "absolute";
				
				if(this.el.offsetHeight<=h && this.el.offsetWidth<=w){
					this.el.style.left="50%";
					this.el.style.top="50%";
					this.el.style.marginLeft = -this.el.offsetWidth/2 +"px";
					this.el.style.marginTop = -this.el.offsetHeight/2 +"px";
				}else if(this.el.offsetHeight>h  && this.el.offsetWidth<=w){
					this.el.style.left="50%";
					this.el.style.top=0;
					this.el.style.marginLeft = -this.el.offsetWidth/2 +"px";
					this.el.style.marginTop = 0;
					
				}else{
					this.el.style.left=0;
					this.el.style.top=0;
					this.el.style.marginLeft = 0;
					this.el.style.marginTop = 0;
				}
				
				
				if (isIE6) {
					for(var i =0;i<this.Select.length;i++){
						this.Select[i].style.visibility = 'hidden'
					}
				}
			}
			
		},
		hidepop:function(id,maskindex){
			var isIE6=!-[1,]&&!window.XMLHttpRequest;
			var bodyObj = document.getElementsByTagName("body")[0];
			this.el = document.getElementById(id);
			this.Select = document.getElementsByTagName("select");
			this.mask = document.getElementById("back_mask");
			if(this.mask){
				this.el.style.zIndex = 1000;
				if(!maskindex){
					bodyObj.removeChild(this.mask);
					if (isIE6) {
						document.body.removeAttribute("style");
						this.el.style.removeExpression('top')
						for(var i =0;i<this.Select.length;i++){
							this.Select[i].style.visibility = 'visible'
						}
					}
				}else{
					if(maskindex<=999){
						this.mask.style.zIndex=999;
					}else{
						this.mask.style.zIndex=maskindex;
					}
				}
				
			}
			this.el.style.display = "none";
		}
	}
	
	
	
window.onresize = function(){
	var back_mask = document.getElementById("back_mask");
	var isIE6=!-[1,]&&!window.XMLHttpRequest;
	if(back_mask && isIE6){
		if(document.body.scrollWidth>back_mask.offsetWidth){
			back_mask.style.width = document.body.scrollWidth + "px";
		}else{
			back_mask.style.width = "100%";	
		}
	}
}	