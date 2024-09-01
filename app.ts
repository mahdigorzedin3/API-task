import * as express from 'express'
import * as session from 'express-session'
import * as cookieParser from 'cookie-parser'
import * as path from 'path';
import * as url from "url";
import * as bodyParser from 'body-parser';
import * as dotenv from "dotenv";
import * as cors from 'cors'
import { PrismaClient } from './prisma-bazar/node_modules/@prisma/client'
import * as jwt from 'jsonwebtoken'
import * as fs from 'fs'
import * as multer  from 'multer'
import { RequestHandler } from 'express-serve-static-core';
// import * as Minio from 'minio'

// var client = new Minio.Client({
//     endPoint: 'play.min.io',
//     port: 9000,
//     useSSL: true,
//     accessKey: 'Q3AM3UQ867SPQQA43P2F',
//     secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
// })

const app = express()
const prisma = new PrismaClient()
app.use(cookieParser())
dotenv.config()
app.use(cors());
app.use(session({
  secret:'dksj933iueddowd',
  resave:true,
  saveUninitialized:true,
  name:'yourin'
}))
const secret = 'thisshouldbeasecret';
interface property {
  id:number,
  name:string,
  number:string,
  category:string,
  email:string|null,
  address:string,
  card_id:string,
  about:string,
  password:string
}

  app.use(express.static(path.resolve(__dirname,'public')))
app.use( bodyParser.json() );  
app.use(bodyParser.urlencoded({  
  extended: true
})); 
declare module 'express-session' {
            interface SessionData {
              profile:property;
              profileid:number;
            }
          }


const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "./view/upload"
});




const login :RequestHandler = (req,res,next)=>{
  // if(req.session?.profile&&req.cookies?.login) next()
  //   else res.json('خطای احراز هویت! لطفا دوباره تلاش کنید')
  next()
}

app.get('/',login,(req,res)=>{
  res.sendFile(path.resolve(__dirname,"public","main.html"))
})
app.get('/info',login,(req,res)=>{
  res.sendFile(path.resolve(__dirname,"public","info.html"))
})
app.get('/profile/editpage',login,(req,res)=>{
  res.sendFile(path.resolve(__dirname,"public","editprof.html"))
})

app.get('/profilepage',login,(req,res)=>{
  res.sendFile(path.resolve(__dirname,"public","profile.html"))
})

app.get('/productpage',login,(req,res)=>{
  res.sendFile(path.resolve(__dirname,"public","product.html"))
})

app.get('/product/editpagee',login,(req,res)=>{
  res.sendFile(path.resolve(__dirname,'public','edit.html'))
})

app.get('/deal/done',login,(req,res)=>{
  res.sendFile(path.resolve(__dirname,'public','donedeal.html'))
})


app.get('/user',login,async(req,res)=>{
  const user=await prisma.merchant.findUnique({
    where:{
      id:1
    }
  })
  if(user?.id&&user){
  req.session.profile=user
  req.session.profileid=user.id
  }
  const deal=await prisma.orders.findMany({
    where:{
      owner_id:req.session.profileid
    }
  })
  var transaction_count=new Set()
  var order_product:Array<number>=new Array()
  var order_quantity=new Array()
  for(let x of deal){
    transaction_count.add(x.transaction_id)
    order_product.push(x.product_id)
    order_quantity.push(x.quantity)
  }
  const orders=await prisma.product.findMany({
    where:{
      id:{in:order_product}
    }
  })
  var sum=0
  for(let i=0;i<orders.length;i++){
     sum+= +(orders[i].price) * +(order_quantity[i]);
  }
  const merchant_product=await prisma.product.findMany({
    where:{
      id:req.session.profileid
    }
  })
  var overall_rating=0
for(let x of merchant_product){
  if(x?.rating){
    overall_rating+= +(x.rating)
  }
}
  req.session.save()
  res.json({
    user:user,
    trans_cou:transaction_count.size,
    sum:sum,
    rating:overall_rating
  })
})
 app.post('/profile/edit',login,upload.single("image"),async(req,res)=>{
  const{fullname,number,cartid,address,category,email,about,psw_new,psw_now,psw_repeat}=req.body
  try{if(req.session.profile?.password){
      if(psw_now==req.session.profile.password){
        var edit=await prisma.merchant.update({
          where:{
            id:req.session.profileid
          },
          data:{
           name:fullname,
           number:number,
           card_id:cartid,
           address:address,
           category:category,
           email:email,
           about:about
          }
      })
      if(psw_new&&psw_new==psw_repeat){
        var editpass=await prisma.merchant.update({
          where:{
            id:req.session.profileid
          },
          data:{
            password:psw_new
          }
      })
      }res.status(200).send()}else {res.status(390).send()
      }}
      }
      catch(e){
        res.status(305).send()
        console.log(e)
      }
  })

app.get('/product',login,async(req,res)=>{
    const products = await prisma.product.findMany({
    where:{
      owner_id:req.session.profileid
    }})
  res.json(products)
  })

//   app.get('/donedeal',login,async(req,res)=>{
//     const donedeal=await prisma.transaction.findMany({
//       where:{
//         owner_id:req.session.profileid,
//         sent:true,
//         paid:true
//       }
//     })
//     res.json(donedeal)
//   })
//   app.get('/donedeal',login,async(req,res)=>{
//     const donedeal=await prisma.transaction.findMany({
//       where:{
//         owner_id:req.session.profileid,
//         sent:true,
//         paid:true
//       }
//     })
//     res.json(donedeal)
//   })
// app.get('/newdeal',login,async(req,res)=>{
//   const newdeal=await prisma.orders.findMany({
//     where:{
//       owner_id:req.session.profileid,
//       sent:false
//     }
//   })
//   res.json(newdeal)
// })


app.post("/product/add",
  upload.single("image"),login,
  async (req, res, err) => {
    try{
      const{name,price,quantity,weight,description,tags,title,detail,min,color}=req.body
    if(req.session?.profile&&req.session?.profileid){
      const adddatabase= await prisma.product.create({    
    data:{
    name:name,
    owner_id:req.session.profileid,
    price:price,
    quantity:quantity,
    weight:weight,
    category:req.session.profile.category,
    description:description,
    min_amount:+min
  }})
var taglist=tags.split(',')
type tagsinpu= {
  product_id:number;
  tag:string;
}
var arr:Array<tagsinpu>=[]
for(let x of taglist){
  arr.push({product_id:adddatabase.id,tag:x})
}
  const addtags =await prisma.tags.createMany({
    data:arr
  })
  type tablesinpu= {
    product_id:number;
    title:string;
    detail:string;
  }

  var tables:Array<tablesinpu>= []
  for(let i=0;i<detail.length;i++){
    tables.push({product_id:adddatabase.id,title:title[i],detail:detail[i]})
  }
  const addtable =await prisma.jadval.createMany({
    data:tables
  })

  type colorinput= {
    product_id:number;
    color:string;
  }
  var colorlist=color.split(',')
  var colors:Array<colorinput>=[]
  for(let j of colorlist){
    colors.push({product_id:adddatabase.id,color:j})
  }
    const addcolors =await prisma.color.createMany({
      data:colors
    })
  
}
res.status(200).send()
    }catch(err){
      console.log(err)
      res.status(400).send()
    }
  }
);

app.get('/product/delete',login,async(req,res)=>{
  var q =url.parse(req.url,true).query;
  if(q?.id){
      var delet=await prisma.product.delete({
    where:{
      id:+q.id
    }
  })
  }
  res.status(204).send()
});

app.get('/product/editpage',login,async(req,res)=>{
  var q =url.parse(req.url,true).query;
  if(q?.id){
    var product=await prisma.product.findUnique({
        where:{
            id:+q.id
        }
    })
    var tags = await prisma.tags.findMany({
      where:{
        product_id:+q.id
      }
    })
    var color=await prisma.color.findMany({
      where:{
        product_id:+q.id
      }
    })
    var jadval=await prisma.jadval.findMany({
      where:{
        product_id:+q.id
      }
    })

     if(product?.name){
      res.json({
        product:product,
        tags:tags,
        color:color,
        jadval:jadval
      })
    }else{
        res.status(404).send()
      }
  }  
})

app.post('/product/edit',login,upload.single("image"),async(req,res)=>{
try {
  var q =url.parse(req.url,true).query;
    const{name,price,quantity,weight,description,title,detail,min}=req.body
  if(req.session?.profile&&req.session?.profileid&&q?.id){
    const editpro= await prisma.product.update({  
      where:{
        id:+q.id
      } ,
  data:{
  name:name,
  owner_id:req.session.profileid,
  price:price,
  quantity:quantity,
  weight:weight,
  category:req.session.profile.category,
  description:description,
  min_amount:+min
}})


type tagsinpu= {
product_id:number;
tag:string;
id:number|undefined
}
var arr:Array<tagsinpu>=[]


for(let i=0;i<3;i++){
  if(req.body[`taginfo${i+1}`]){
    let currentobj=JSON.parse(req.body[`taginfo${i+1}`])
    arr.push({product_id:editpro.id,tag:currentobj.tag,id:+currentobj.id})
  }else{
    break
  }
}


var previoustag = await prisma.tags.findMany({
  where:{
    product_id:+q.id
  }
})
let previoustagid:Array<number>=[]
for(let x of previoustag){
  previoustagid.push(x.id)
}

arr.forEach(async(item,index) => {
  if(!item.id){
    item.id=0
  }
  previoustagid.forEach((x,index)=>{
    if(x==item.id) previoustagid.splice(index,1)
  })
  const updatetag=await prisma.tags.upsert({
    where:{id:item.id},
    update:{
      product_id:item.product_id,
      tag:item.tag
    },
    create:{
      product_id:item.product_id,
      tag:item.tag
    }
  })
});
previoustagid.forEach(async(y, index)=>{
  const deletag=await prisma.tags.delete({
    where:{
      id:y
    }
  })
})


type colorinput= {
  product_id:number;
  color:string;
  id:number|undefined
}

var colors:Array<colorinput>=[]
for(let i=0;i<8;i++){
  if(req.body[`colinfo${i+1}`]){
    let currentobj=JSON.parse(req.body[`colinfo${i+1}`])
    colors.push({product_id:editpro.id,color:currentobj.color,id:+currentobj.id})
  }else{
    break
  }
}

var previouscolor = await prisma.color.findMany({
  where:{
    product_id:+q.id
  }
})
let previouscolorid:Array<number>=[]
for(let x of previouscolor){
  previouscolorid.push(x.id)
}

colors.forEach(async(item,index) => {
  if(!item.id){
    item.id=0
  }
  previouscolorid.forEach((x,index)=>{
    if(x==item.id) previouscolorid.splice(index,1)
  })
  const updatecolor=await prisma.color.upsert({
    where:{id:item.id},
    update:{
      product_id:item.product_id,
      color:item.color
    },
    create:{
      product_id:item.product_id,
      color:item.color
    }
  })
});
previouscolorid.forEach(async(y, index)=>{
  const deletcol=await prisma.color.delete({
    where:{
      id:y
    }
  })
})

type tablesinpu= {
  product_id:number;
  title:string;
  detail:string;
  id:number|undefined
}

var jadvalinput:Array<tablesinpu>=[]
for(let i=0;i<12;i++){
  if(req.body[`tableinfo${i+1}`]){
    let currentobj=JSON.parse(req.body[`tableinfo${i+1}`])
    console.log(currentobj)
    jadvalinput.push({product_id:editpro.id,title:currentobj.title,detail:currentobj.detail,id:+currentobj.id})
  }else{
    break
  }
}
var previoustable = await prisma.jadval.findMany({
  where:{
    product_id:+q.id
  }
})
let previoustableid:Array<number>=[]
for(let x of previoustable){
  previoustableid.push(x.id)
}
jadvalinput.forEach(async(item,index) => {
  previoustableid.forEach((x,index)=>{
    if(x==item.id)previoustableid.splice(index,1)
    })
  if(!item.id){
    item.id=0
  }
if(item.detail!==''&&item.title!==''){
    const updatetable=await prisma.jadval.upsert({
    where:{id:item.id},
    update:{
      product_id:item.product_id,
      title:item.title,
      detail:item.detail
    },
    create:{
      product_id:item.product_id,
      title:item.title,
      detail:item.detail
    }
})
console.log(updatetable)
  }else{
    previoustableid.push(item.id)
  }
  
  console.log(previoustableid)
  })
  console.log(previoustableid)
  previoustableid.forEach(async(y, index)=>{
  const deletable=await prisma.jadval.delete({
    where:{
      id:y
    }
})
})
res.status(200).send()}
} catch (error) {
  console.log(error)
  res.status(400).send()
}
})

app.get('/done/deals',login,async(req,res)=>{
  if(req.session?.profileid){
    const doneorders= await prisma.orders.findMany({
    where:{
      owner_id:req.session.profileid
    }
  })
  const result:Array<object>=[]
  for(let x of doneorders){
    const donetrans=await prisma.transaction.findUnique({
      where:{
        id:x.transaction_id,
        sent:true,
        paid:true
      }
    })
    const product=await prisma.product.findUnique({
        where:{
          id:x.product_id
        }
      })
    if(donetrans?.id&&product?.id){
        result.push({
        description:x.description,
        color:x.color,
        product_name:product.name,
        product_id:product.id,
        quantity:x.quantity,
        transactionid:x.transaction_id,
        customer_address:x.address,
        customer_postcode:x.post_code,
        buytime:donetrans.time,
        whole_money:((+product.price)*(x.quantity)),
        your_amount:((+product.price)*(x.quantity))*0.97,
        recieve:donetrans.recieve,
        deposit:x.deposit_merchant
      })
    }else{
      
    }
  }
res.json(result) 
 }
})

app.get('/incompelete/deals',login,async(req,res)=>{
  if(req.session?.profileid){
    const incomporders= await prisma.orders.findMany({
    where:{
      owner_id:req.session.profileid
    }
  })
  const result:Array<object>=[]
  for(let x of incomporders){
    const incomptranse=await prisma.transaction.findUnique({
      where:{
        id:x.transaction_id,
        paid:true
      }
    })
    const product=await prisma.product.findUnique({
        where:{
          id:x.product_id
        }
      })
    if(incomptranse?.id&&product?.id){
        result.push({
        description:x.description,
        color:x.color,
        product_name:product.name,
        product_id:product.id,
        quantity:x.quantity,
        transactionid:x.transaction_id,
        customer_address:x.address,
        customer_postcode:x.post_code,
        buytime:incomptranse.time,
        whole_money:((+product.price)*(x.quantity)),
        your_amount:((+product.price)*(x.quantity))*0.97
      })
    }else{
      
    }
  }
res.json(result) 
 }
})


app.listen(8000)


