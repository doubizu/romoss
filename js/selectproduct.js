$(function(){
	
	var left = 1070;
	$(".og_next").click(function(){
		//alert($(".piclist li").length);
		//alert(parseInt((($(".piclist li").length)/5)));
		var num = parseInt((($(".piclist li").length)/3));
		if ( left == 1070*(num+1) ){
			left = 0;
		}
		//alert(left)
		
		$(".piclist").animate({
			left:-left+"px"
		},500);
		left += 1070;
	});
	
	$(".og_prev").click(function(){
		var num = parseInt((($(".piclist li").length)/3));
		if ( left == 1070*(num+1) ){
			left = 0;
		}
		$(".piclist").animate({
			left:-left+"px"
		},500);
		left += 1070;
	});
	
	
});

