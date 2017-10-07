function GetMem(){
	$.ajax({
		type: "GET",
		url:"../GetDiskJSON",
		dataType: "json",
		async: true,
		cache: false,
		timeout:'2000',//请求超时时间
		success: function(data) {
			for(var i=0;i<data.length;i++){
				var tr=$("<tr></tr>")
				tr.append("<td>"+data[i].Name+"</td>")
				tr.append("<td>"+data[i].Size+"</td>")
				tr.append("<td>"+data[i].Used+"</td>")
				tr.append("<td>"+data[i].Free+"</td>")
				tr.append("<td>"+data[i].UseRate+"</td>")
				tr.append("<td>"+data[i].Mount+"</td>")
				$('#diskTable').append(tr)
			}
		}
	});
}
GetMem();