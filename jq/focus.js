;(function($){
	/***
	Author:LiuWang
	Date:2015/06/29
	***/
	var Focus = function(Focus_one){
		var self = this;
		this.Focus_one = Focus_one;
		this.FocusItemMain = Focus_one.find("ul");
		this.FocusItems    = Focus_one.find("li");
		this.FocusFirstItem = Focus_one.find("li").first();
		this.FocusLastItem = Focus_one.find("li").last();
		
		this.Focus_one_lisW = Math.ceil(Focus_one.outerWidth()/this.FocusFirstItem.outerWidth());
		this.Focus_one_lisH = Math.ceil(Focus_one.outerHeight()/this.FocusFirstItem.outerHeight());
		
		this.nextBtn = Focus_one.find("div.poster-next-btn");
		this.prevBtn = Focus_one.find("div.poster-prev-btn");
		
		
		
		
		
		this.animateFlag   = true;
		this.showItemsNum = 0;
		
		
		//配置默认参数
		//默认参数配置;
		this.setting  = {
						"speed":500,			//切换速度
						//"autoPlay":true,		//是否自动播放
						"delay":5000,           //自动播放时间
						"PlayNum":1,			//一次切换数量
						"effect":"horizontal", //fade 淡入淡出  horizontal 左右滚动   vertical 上下滚动;
                        "focus_tab":["tab",false,false],    //切换小标 1.默认绑定class = tab ,2.是否自定义样式，3.是否显示切换小标
                        "selectClass":"selected",   //绑定小标选中class
						"txt":["txt",false]
		}
		//用获取的人工配置参数覆盖默认的参数配置
		$.extend(this.setting,this.getSetting())
		
		//重新设置位置
		this.setFocusPos();
		
		
		this.prevBtn.click(function(){
			self.starMove("prev");
		})
		
		this.nextBtn.click(function(){
			self.starMove("next");
		})
		
		//是否开启自动播放
		if(this.setting.autoPlay){
			this.autoPlay();
			this.Focus_one.hover(function(){
										window.clearInterval(self.timer);
										},function(){
										self.autoPlay();
										});
			
		};
		
		//
		self.Focus_one.find("."+this.setting.focus_tab[0]).children().each(function(index){
			var index = index;
			$(this).click(function(){
				if(self.animateFlag){
					$(this).siblings("."+self.setting.selectClass).removeClass(self.setting.selectClass)
					$(this).addClass(self.setting.selectClass)
					self.starTabMove(index)
				}
			})
		})
		
	}
	
	Focus.prototype = {
		//自动播放
		autoPlay:function(){
			var self = this;
			this.timer = window.setInterval(function(){
				self.starMove("prev");
			},self.setting.delay);
		},
		starTabMove:function(idx){
			var self = this;
			self.animateFlag = false;
			//切换小标
			if(self.setting.effect==="fade"){//淡入淡出
				self.FocusItemMain.find(".fadeShow").removeClass("fadeShow").addClass("fadeHide")
				self.FocusItems.eq(idx).addClass("fadeShow")
				self.FocusItemMain.find(".fadeShow").fadeIn(self.setting.speed,function(){self.animateFlag = true;});
				self.FocusItemMain.find(".fadeHide").fadeOut(self.setting.speed,function(){self.FocusItemMain.find(".fadeHide").removeClass("fadeHide")});
			}else if(self.setting.effect==="horizontal"){//左右滚动
				self.FocusItemMain.animate({
					left:-self.FocusFirstItem.outerWidth()*(idx+1)
				},self.setting.speed,function(){
					self.animateFlag = true;
				})
			}else if(self.setting.effect==="vertical"){//上下滚动
				self.FocusItemMain.animate({
					top:-self.FocusFirstItem.outerHeight()*(idx+1)
				},self.setting.speed,function(){
					self.animateFlag = true;
				})
			}
			
		},
		//效果运动
		starMove:function(dir){
			var self = this;
			
			if(dir==="prev"){
				
				//切换小标
				if(/*self.setting.focus_tab[1]==false && */self.setting.focus_tab[2]==true && self.setting.PlayNum==1 && self.Focus_one.outerWidth()==self.FocusFirstItem.outerWidth() && self.animateFlag){
					var selected_next =self.Focus_one.find("."+this.setting.focus_tab[0]).find("."+self.setting.selectClass).next();
					self.Focus_one.find("."+this.setting.focus_tab[0]).find("."+self.setting.selectClass).removeClass(self.setting.selectClass);
					if(selected_next.length>0){
						selected_next.addClass(self.setting.selectClass)
					}else{
						self.Focus_one.find("."+this.setting.focus_tab[0]).children().first().addClass(self.setting.selectClass)
					}
					
				}
				
				if(self.setting.effect==="fade" && self.animateFlag){//淡入淡出
										
					var last_fadeShow = self.Focus_one.find(".fadeShow").last();
					var loopnum = self.setting.PlayNum;
					//当显示的数量 个 总共的 数量一直时候，不做任何动作；
					if(loopnum>=self.FocusItems.length){return false;}
					
					
					self.animateFlag = false;
					self.Focus_one.find(".fadeShow").removeClass("fadeShow").addClass("fadeHide")
					
					if(!last_fadeShow.next().get(0)){
						last_fadeShow = self.FocusFirstItem
						self.FocusFirstItem.addClass("fadeShow")
						loopnum = loopnum-1;
					}
					for(var i =0;i<loopnum;i++){
						
							if(last_fadeShow.next().get(0)){
								last_fadeShow.next().addClass("fadeShow");
								last_fadeShow = last_fadeShow.next();
							}else{
									break;
							}
							
					}
					
					self.FocusItemMain.find(".fadeShow").fadeIn(self.setting.speed,function(){self.animateFlag = true;});
					self.FocusItemMain.find(".fadeHide").fadeOut(self.setting.speed,function(){self.FocusItemMain.find(".fadeHide").removeClass("fadeHide")});
					
				}else if(self.setting.effect==="horizontal" && self.animateFlag){//左右滚动
					
					//alert(self.showItemsNum)
					if(self.FocusItemMain.position().left<=-self.FocusFirstItem.outerWidth()*self.FocusItems.length){
						self.FocusItemMain.css("left",self.FocusItemMain.position().left+self.FocusFirstItem.outerWidth()*self.FocusItems.length)
					}
					
					var W_left = self.FocusItemMain.position().left-self.FocusFirstItem.outerWidth()*self.setting.PlayNum;
					
					if(Math.abs(W_left)>=self.FocusFirstItem.outerWidth()*self.FocusItems.length){
						self.animateFlag = false;
						self.FocusItemMain.animate({
							left:W_left
						},self.setting.speed,function(){
							self.FocusItemMain.css("left",W_left+self.FocusFirstItem.outerWidth()*self.FocusItems.length);
							self.animateFlag = true;
						})
					}else{
						self.animateFlag = false;
						self.FocusItemMain.animate({
							left:W_left
						},self.setting.speed,function(){
							self.animateFlag = true;
						})
					}
					
					
				}else if(self.setting.effect==="vertical" && self.animateFlag){//上下滚动
					
					if(self.FocusItemMain.position().top<=-self.FocusFirstItem.outerHeight()*self.FocusItems.length){
						self.FocusItemMain.css("top",self.FocusItemMain.position().top+self.FocusFirstItem.outerHeight()*self.FocusItems.length)
					}
					
					var W_Top = self.FocusItemMain.position().top-self.FocusFirstItem.outerHeight()*self.setting.PlayNum;
					
					if(Math.abs(W_Top)>=self.FocusFirstItem.outerHeight()*self.FocusItems.length){
						self.animateFlag = false;
						self.FocusItemMain.animate({
							top:W_Top
						},self.setting.speed,function(){
							self.FocusItemMain.css("top",W_Top+self.FocusFirstItem.outerHeight()*self.FocusItems.length);
							self.animateFlag = true;
						})
					}else{
						self.animateFlag = false;
						self.FocusItemMain.animate({
							top:W_Top
						},self.setting.speed,function(){
							self.animateFlag = true;
						})
					}
					
					
				}
				
				
				
			}else if(dir==="next"){
				
				//切换小标
				if(/*self.setting.focus_tab[1]==false && */self.setting.focus_tab[2]==true && self.setting.PlayNum==1 && self.Focus_one.outerWidth()==self.FocusFirstItem.outerWidth() && self.animateFlag){
					var selected_prev =self.Focus_one.find("."+this.setting.focus_tab[0]).find("."+self.setting.selectClass).prev();
					self.Focus_one.find("."+this.setting.focus_tab[0]).find("."+self.setting.selectClass).removeClass(self.setting.selectClass);
					if(selected_prev.length>0){
						selected_prev.addClass(self.setting.selectClass)
					}else{
						self.Focus_one.find("."+this.setting.focus_tab[0]).children().last().addClass(self.setting.selectClass)
					}
					
				}
				
				
				
				if(self.setting.effect==="fade" && self.animateFlag){
					var first_fadeShow = self.Focus_one.find(".fadeShow").first();
					var loopnum = self.setting.PlayNum;
					//当显示的数量 个 总共的 数量一直时候，不做任何动作；
					if(loopnum>=self.FocusItems.length){return false;}
					
					self.animateFlag = false;
					self.Focus_one.find(".fadeShow").removeClass("fadeShow").addClass("fadeHide")
					
					if(!first_fadeShow.prev().get(0)){
						first_fadeShow = self.FocusLastItem
						self.FocusLastItem.addClass("fadeShow")
						
						if(self.FocusItems.size()%self.setting.PlayNum==0){
							loopnum = self.setting.PlayNum-1;
						}else{
							loopnum = self.FocusItems.size()%self.setting.PlayNum-1;
						}
						
					}
					for(var i =0;i<loopnum;i++){
						
							if(first_fadeShow.prev().get(0)){
								first_fadeShow.prev().addClass("fadeShow");
								first_fadeShow = first_fadeShow.prev();
							}else{
									break;
							}
							
					}
					
					self.FocusItemMain.find(".fadeShow").fadeIn(self.setting.speed,function(){self.animateFlag = true;});
					self.FocusItemMain.find(".fadeHide").fadeOut(self.setting.speed,function(){self.FocusItemMain.find(".fadeHide").removeClass("fadeHide")});
				}else if(self.setting.effect==="horizontal" && self.animateFlag){//左右滚动
					
					if(self.FocusItemMain.position().left>=-self.FocusFirstItem.outerWidth()*self.showItemsNum){
						self.FocusItemMain.css("left",self.FocusItemMain.position().left-self.FocusFirstItem.outerWidth()*self.FocusItems.length)
					}
					
					var W_left = self.FocusItemMain.position().left+self.FocusFirstItem.outerWidth()*self.setting.PlayNum;
					
					if(Math.abs(W_left)<=self.FocusFirstItem.outerWidth()*self.setting.PlayNum){
						self.animateFlag = false;
						self.FocusItemMain.animate({
							left:W_left
						},self.setting.speed,function(){
							self.FocusItemMain.css("left",W_left-self.FocusFirstItem.outerWidth()*self.FocusItems.length);
							self.animateFlag = true;
						})
					}else{
						self.animateFlag = false;
						self.FocusItemMain.animate({
							left:W_left
						},self.setting.speed,function(){
							self.animateFlag = true;
						})
					}
					
					
				}else if(self.setting.effect==="vertical" && self.animateFlag){//上下滚动
					
					if(self.FocusItemMain.position().top>=-self.FocusFirstItem.outerHeight()*self.showItemsNum){
						self.FocusItemMain.css("top",self.FocusItemMain.position().top-self.FocusFirstItem.outerHeight()*self.FocusItems.length)
					}
					
					var W_top = self.FocusItemMain.position().top+self.FocusFirstItem.outerHeight()*self.setting.PlayNum;
					
					if(Math.abs(W_top)<=self.FocusFirstItem.outerHeight()*self.setting.PlayNum){
						self.animateFlag = false;
						self.FocusItemMain.animate({
							top:W_top
						},self.setting.speed,function(){
							self.FocusItemMain.css("top",W_top-self.FocusFirstItem.outerHeight()*self.FocusItems.length);
							self.animateFlag = true;
						})
					}else{
						self.animateFlag = false;
						self.FocusItemMain.animate({
							top:W_top
						},self.setting.speed,function(){
							self.animateFlag = true;
						})
					}
					
					
				}
				
			
			}
			
			
			
		},
		
		//重新设置位置
		setFocusPos:function(){
			var self = this;
			
			var sliceSize  = this.FocusItems.size()/this.setting.PlayNum;
			
			if(this.setting.PlayNum>this.FocusItems.size()){
				this.setting.PlayNum=this.FocusItems.size();
			}else if(this.setting.PlayNum<=0){
				this.setting.PlayNum=1;
			}
			
			
			
			//切换小标
			if(/*self.setting.focus_tab[1]==false && */self.setting.focus_tab[2]==true && self.setting.PlayNum==1 && self.Focus_one.outerWidth()==self.FocusFirstItem.outerWidth() && self.Focus_one.outerHeight()==self.FocusFirstItem.outerHeight()){
				
				if(self.setting.focus_tab[1]==false){
					self.FocusItemMain.after("<div class='"+this.setting.focus_tab[0]+"'></div>")
					
					self.FocusItems.each(function(i){
						if(i==0){
							self.FocusItemMain.next().append("<i class='"+self.setting.selectClass+"'></i>")
						}else{
							self.FocusItemMain.next().append("<i></i>")
						}
					})
				
					self.FocusItemMain.next().css({"left":"50%","marginLeft":-(self.FocusItemMain.next().children().last().offset().left-self.FocusItemMain.next().children().first().offset().left+self.FocusItemMain.next().children().last().outerWidth())/2})
				}
			}else{
				self.Focus_one.find("."+this.setting.focus_tab[0]).css("display","none")//当滚动数量 不是1
			}
			
			
			
			//动画层父级div 设置
			//this.FocusItemMain.closest("div").css({"position":"relative","overflow":"hidden","width":this.FocusItemMain.outerWidth(),"height":this.FocusItemMain.outerHeight()})
			
			this.FocusItemMain.wrap("<div style='position:relative;overflow:hidden;width:"+this.FocusItemMain.outerWidth()+"px;height:"+this.Focus_one.outerHeight()+"px;'></div>");
			
			//内层设置
			if(self.setting.effect==="fade"){//淡入淡出
				
				self.FocusItemMain.css("position","relative")
				self.FocusItems.each(function(i){
					$(this).css({"position":"absolute","top":0,"left":self.FocusFirstItem.outerWidth()*(i%self.setting.PlayNum),"display":"none","top":0})
					if(Math.floor(i/self.setting.PlayNum)==0){
						$(this).css("display","block");
						$(this).addClass("fadeShow")
					}
					
				})
				
			}else if(self.setting.effect==="horizontal"){//向左滚动
				
				//sliceItems.slice(0,sliceSize)
				self.FocusItems.each(function(i){
					$(this).css({"float":"left","display":"inline"})
				})
				
				if(self.Focus_one_lisW<=self.setting.PlayNum){
					self.showItemsNum = self.setting.PlayNum
				}else{
					self.showItemsNum = self.Focus_one_lisW
				}
				
				self.FocusItemMain.append(self.FocusItems.slice(0,self.showItemsNum).clone())
				self.FocusItemMain.prepend(self.FocusItems.slice(-self.showItemsNum).clone())
				var FocusItems_new = self.Focus_one.find("li");
				self.FocusItemMain.css({"width":self.FocusFirstItem.outerWidth()*Math.ceil(FocusItems_new.length),"position":"absolute","left":-self.FocusFirstItem.outerWidth()*self.showItemsNum})
				
				
			}else if(self.setting.effect==="vertical"){//上下滚动
				if(self.Focus_one_lisH<=self.setting.PlayNum){
					self.showItemsNum = self.setting.PlayNum
				}else{
					self.showItemsNum = self.Focus_one_lisH
				}
				
				self.FocusItemMain.append(self.FocusItems.slice(0,self.showItemsNum).clone())
				self.FocusItemMain.prepend(self.FocusItems.slice(-self.showItemsNum).clone())
				var FocusItems_new = self.Focus_one.find("li");
				//self.FocusItemMain.css({"position":"absolute","height":self.FocusFirstItem.outerHeight()*FocusItems_new.length});
				self.FocusItemMain.css({"width":self.FocusFirstItem.outerHeight()*Math.ceil(FocusItems_new.length),"position":"absolute","top":-self.FocusFirstItem.outerHeight()*self.showItemsNum})
				
			}
		},
		
		
		
		
		
		
		//获取人工配置参数
		getSetting:function(){
			var setting = this.Focus_one.attr("data-setting");
			if(setting && setting != ""){
				return $.parseJSON(setting);
			}else{
				return {};	
			}
		}
	}
	
	Focus.init = function(Focus_every){
		var _this_ = this;
		Focus_every.each(function(){
			new _this_($(this));
		})
	}
	window["Focus"] = Focus;
})(jQuery)