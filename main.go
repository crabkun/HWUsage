package main

import (
	"strings"
	"io/ioutil"
	"log"
	"fmt"
	"github.com/crabkun/MonitorKits"
	"github.com/crabkun/crab"
	"os/exec"
)

type CPUStat struct {
	Name string
	Total int
	Idle int
}

type MemStat struct {
	Total int
	Used int
}

func getCPU() []CPUStat {
	t:=make([]CPUStat,0)
	buf,err:=ioutil.ReadFile("/proc/stat")
	if err!=nil{
		log.Println("read /proc/stat error")
		return t
	}
	var a,b,c,d,e,f,g,h,i,n int
	var name string
	str:=string(buf)
	strArr:=strings.Split(str,"\n")
	for _,v:=range strArr{
		if len(v)<3 || v[:3]!="cpu"{
			continue
		}
		if n,_=fmt.Sscanf(v,"%s %d %d %d %d %d %d %d %d %d",&name,&a,&b,&c,&d,&e,&f,&g,&h,&i);n!=10{
			continue
		}
		c:=CPUStat{
			Name:name,
			Total:a+b+c+d+e+f+g+h+i,
			Idle:d,
		}
		t=append(t,c)
	}
	return t
}
func getMem() MemStat {
	t:=MemStat{}
	cmd1:=exec.Command("free")
	cmd2:=exec.Command("grep","Mem")
	cmd3:=exec.Command("awk",`{print $2 " " $3}`)
	cmd2.Stdin,_=cmd1.StdoutPipe()
	cmd3.Stdin,_=cmd2.StdoutPipe()
	cmd1.Start()
	cmd2.Start()
	output,err:=cmd3.CombinedOutput()
	if err!=nil{
		return t
	}
	outputStr:=string(output)
	fmt.Sscanf(outputStr,"%d%d",&t.Total,&t.Used)
	return t
}
func GetCpuJSON(c *crab.Context){
	c.WriteJSON(getCPU())
}
func GetMemJSON(c *crab.Context){
	c.WriteJSON(getMem())
}
func GetPluginInfo() *MonitorKits.PluginInfo {
	t:=&MonitorKits.PluginInfo{}
	t.Name="HWUsage"
	t.DisplayName="资源占用情况"
	t.Author="Crabkun"
	t.Description="Hardware Usage Monitor plugin"
	t.Version="1.0"
	return t

}

func GetPluginRoute() *MonitorKits.PluginRoute {
	t:=&MonitorKits.PluginRoute{}
	t.Add("GET","GetCpuJSON","GetCpuJSON")
	t.Add("GET","GetMemJSON","GetMemJSON")
	return t
}

func LoadPlugin() error {
	return nil
}

func UnloadPlugin() error {
	return nil
}

func PluginIndex(ctx *crab.Context) {
	ctx.Redirect(302,"static/show.html")
}
