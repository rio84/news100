const model=require('../model/News')
module.exports={
	index:async (ctx,next)=>{
		//ctx.type='json'
		try{
			//console.log(ctx.query)
			var json=await model.getlist(ctx.query)
			
			ctx.body= json;
		}catch(e){
			ctx.body= 'error'
		}
		
	},
	slider:async (ctx,next)=>{
		try{
			//console.log(ctx.query)
			var json=await model.getslider(ctx.query)
			
			ctx.body= json;
		}catch(e){
			ctx.body= 'error'
		}

	}
}