// import { request } from 'https';

const fs=require('fs');
const http=require('http');
const path=require('path');

//mime需要输入指令引包，它不是node的内置模块
const mime=require('mime');

let rootPath=path.join(__dirname,'www');
//__dirname获得的是当前文件的根路径，是绝对路径

let server=http.createServer((request,response)=>{
//创建一个服务器
let targetPath=path.join(rootPath,request.url);
if(fs.existsSync(targetPath)) {
    //生成地址
    fs.stat(targetPath,(err,stats)=>{
        //判断路径是否存在
        if(stats.isFile()) {
            response.setHeader('content-type',mime.getType(targetPath));
              //设置响应头中的解析格式
           fs.readFile(targetPath,(err,data)=>{
                // 是文件 直接读取 并返回
            response.end(data);
           })
           
        }
        // 是文件夹 渲染出列表
        if(stats.isDirectory()) {
              // 读取文件夹信息
            fs.readdir(targetPath,(err,files)=>{
                let tem='';
                // 遍历
                for (let i = 0; i < files.length; i++) {
                     tem += `
                     <li>
                     <a href="${request.url}${request.url=='/'?'':'/'}${files[i]}">${files[i]}</a>
                 </li>
                     `  
                }
                response.end(`
                <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
                    <html>
                    
                    <head>
                        <title>Index of/ </title>
                        <meta charset=utf-8>
                    </head>
                    
                    <body>
                        <h1>Index of ${request.url}</h1>
                        <ul>
                            ${tem}
                        </ul>
                    </body>
                    
                    </html>
                `);
            })
               

               // 读取完毕之后再返回
        }
    })

}else{
    response.statusCode=404;
    response.setHeader('content-type','text/html;charset=utf-8');
    response.end(
        ` 
        <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
        <html><head>
        <title>404 Not Found</title>
        </head><body>
        <h1>Not Found</h1>
        <p>你请求的${request.url.slice(1)} 不在服务器上哦,检查一下呗</p>
        </body></html>
        `
    )
}

})

server.listen(9527,'127.0.0.1',()=>{
    console.log('恭喜你，输入成功');
    
})






//设置响应头中的解析格式

  // 数据才读取完毕