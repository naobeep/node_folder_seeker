import { fs } from "fs";
import { path } from "path";
const dir = process.argv[2] || '.'

const walk =(p,cb) =>{
  const results = []
  fs.readdir(p,(err,files)=>{
    if(err) throw err

    const pending = files.length
    if(!pending) return cb(null,results);

    files.map(file=>{
      return path.join(p,file)
    }).filter(file=>{
      if(fs.statSync(file).isDirectory()) walk(file,(err,res)=>{
        
      })
    })
  })
}
