function GetMem(){
	$.ajax({
		type: "GET",
		url:"../GetMemJSON",
		dataType: "json",
		async: true,
		cache: false,
		timeout:'2000',//请求超时时间
		success: function(data) {
			var total=Math.floor(data.Total/1024)
			var used=Math.floor(data.Used/1024)
			var free=total-used
			$('#MemTotal').html(total+"MB")
			$('#MemFree').html(free+"MB")
			$('#MemUsed').html(used+"MB")
		}
	});
}
GetMem();
setInterval(GetMem,3000);