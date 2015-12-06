var total = 17;
var zWin = $(window);
var largeImg = $("#large_img");
var largeImgDom = largeImg[0];//取得largeImg的Dom引用
var imgContainer = $("#container");
var render = function() {
	var padding = 2;//事先定义好每个图片的间距
	var winWidth = zWin.width();//获得屏幕的宽度
	var picWidth = Math.floor((winWidth - padding * 3) / 4);
	var temp = "";
	for(var i = 1; i <= total; i++) {
		var paddingLeft = padding;
		if(i % 4 == 1) {//每行第一张图片时没有左padding的
			paddingLeft = 0;
		}
		var imgSrc = "imgs/" + i + ".jpg";
		temp += "<li data-id='"+ i +"' class='animated bounceIn' style='width:"+ picWidth +"px;height:"+ picWidth +"px;paddin-top:"+ padding +"px;padding-left:"+ paddingLeft +"px'><canvas id=cvs_" + i + "></canvas></li>";
		var img = new Image();
		img.index = i;
		img.onload = function() {
			var cvs = $("#cvs_" + this.index)[0].getContext("2d");
			cvs.width = this.width;
			cvs.height = this.height;
			cvs.drawImage(this, 0, 0);
		}
		img.src = imgSrc;//请求指定路径的图片~请求完成后就触发onload事件
	}
	$("#container").html(temp);
}

//加载大图
function loadImage(_id, callback) {
	$("#large_container").css({
		"width": zWin.width(),
		"height":zWin.height()
	}).show();
	var imgSrc = "imgs/" + _id + ".large.jpg";
	var img = new Image();
	img.onload = function() {
		//获取图片的真实的宽高
		var w = this.width;
		var h = this.height;
		//获取window窗口的宽度和高
		var winW = zWin.width();
		var winH = zWin.height();
		var realW = winH / h * w;
		var realH = winW / w * h;
		var paddingLeft = parseInt((winW - realW) / 2);
		var paddingTop = parseInt((winH - realH) / 2);
		largeImg.css({//每次调用显示大图的函数时都要先将图片的样式还原成最初的样式~不然横图切换到竖图时~之前的样式会造成影响
			"width": "auto",
			"height": "auto",
			"padding-top": "0",
			"padding-left": "0"
		});
		if(h / w > 1.2) {
			//此时认为图片是竖图
			largeImg.attr("src", imgSrc).css("height", winH).css("padding-left",paddingLeft);

		}else {
			//此时认为是横图
			largeImg.attr("src", imgSrc).css("width", winW).css("padding-top",paddingTop);
		}
		callback && callback();
	}
	img.src = imgSrc;//获取图片
}

var cid;//记录当前显示的大图的id~（大图小图的id与存储的图片的文件名的id的索引是一样的~~）
$("#container").delegate("li", "tap", function() {
	imgContainer.hide();
	var _id = cid = $(this).attr("data-id");
	loadImage(_id);
});

$("#large_container").tap(function() {
	imgContainer.show();
	$(this).hide();
}).swipeLeft(function() {
	cid++;
	if(cid > total) {
		cid = total;
	}else {
		loadImage(cid, function() {
			largeImgDom.addEventListener("webkitAnimationEnd", function() {
				largeImg.removeClass("animated bounceInRight");
				largeImgDom.removeEventListener("webkitAnimationEnd");
				//上面的操作完成后这个事件处理就不再需要了~使用链式调用remove掉
			}, false);//这种添加事件的方法几乎兼容所有移动端的浏览器
			largeImg.addClass("animated bounceInRight");
		});
	}
}).swipeRight(function() {
	cid--;
	if(cid < 1) {
		cid = 1;
	}else {
		loadImage(cid, function() {
			largeImgDom.addEventListener("webkitAnimationEnd", function() {
				largeImg.removeClass("animated bounceInLeft");
				largeImgDom.removeEventListener("webkitAnimationEnd");
			}, false);
			largeImg.addClass("animated bounceInLeft");
		});
	}
});

render();