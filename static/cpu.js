// 基于准备好的dom，初始化echarts实例
var CpuChart = echarts.init(document.getElementById('cpu-chart'));
// 指定图表的配置项和数据
var CpuChartOption = {
	color: ['#3398DB'],
	tooltip : {
		trigger: 'axis',
		axisPointer : {            // 坐标轴指示器，坐标轴触发有效
			type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		}
	},
	grid: {
		left: '3%',
		right: '4%',
		bottom: '3%',
		containLabel: true
	},
	xAxis : [
		{
			type : 'category',
			data : [],
			axisTick: {
				alignWithLabel: true
			}
		}
	],
	yAxis : [
		{
			type : 'value',
			min:0,
			max:100
		}
	],
	series : [
		{
			name:'使用率',
			type:'bar',
			barWidth: '60%',
			label: {
				normal: {
					show: true,
					position: 'top'
				}
			},
			data:[]
		}
	],
	color:['#00b5ad']
};
function InitCpuChart(CpuNum){
	for(var i=0;i<CpuNum;i++){
		var coreName="CPU"+i
		if(i==0){
			coreName="整体"
		}
		CpuChartOption.xAxis[0].data.push(coreName)
		CpuChartOption.series[0].data.push(0)
	}

	CpuChart.setOption(CpuChartOption);
}
function UpdateCPUChart(){
	for(var i=0;i<CPUData.length;i++){
		CpuChartOption.series[0].data[i]=CPUData[i].Rate
	}
	CpuChart.setOption(CpuChartOption);
}

var LastCPUData;
var CPUData=[];

function GetCPU(){
	$.ajax({
		type: "GET",
		url:"../GetCpuJSON",
		dataType: "json",
		async: true,
		cache: false,
		timeout:'2000',//请求超时时间
		success: function(data) {
			if(LastCPUData==null){
				LastCPUData=data
				InitCpuChart(LastCPUData.length)
				return
			}
			$('.dimmer').removeClass("active")
			CPUData=[]
			for(var i=0;i<data.length;i++){
				CPUData.push({
					Name:data[i].Name,
					Rate:Math.floor(100-(data[i].Idle-LastCPUData[i].Idle)/(data[i].Total-LastCPUData[i].Total)*100)
				})
			}
			UpdateCPUChart()
			LastCPUData=data
		}
	});
}
GetCPU();
setInterval(GetCPU,3000);
$(window).resize(function(){
	CpuChart.resize();
});