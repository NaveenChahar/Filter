const logger=require('../../Utils/winstonLogger');
const Products=require('../schemas/ProductSchema');

const filteredSearch={
    getFilteredData(res,params){
        var query={};
        query['$and']=[];
        console.log(params);
        for(let key in params){
            
            if(key=='brands'){
                if(params[key].length>0){ 
                    let orQuery={};
                    orQuery['$or']=[]
                    for(let brand of params[key]){
                        orQuery['$or'].push({"info.brand":brand});
                    }
                    query['$and'].push(orQuery);
                    console.log(orQuery.$or)
                }
            }

            if(key=="prices"){
                if(params[key].length>0){
                    let orQuery={};
                    orQuery['$or']=[]
                    for(let price of params[key]){
                        orQuery['$or'].push({"info.priceAndAmount":{$elemMatch:{price:
                            {$gt:parseInt(price.split(' ')[0]),$lte:parseInt(price.split(' ')[1])}}}});
                    }
                    query['$and'].push(orQuery);
                    console.log(orQuery.$or[0]['info.priceAndAmount']) 
                }
            }

            if(key=="discount"){
                if(params[key].length>0){
                    let orQuery={};
                    orQuery['$or']=[]
                    for(let discount of params[key]){
                        console.log()
                        orQuery['$or'].push({"info.priceAndAmount":{$elemMatch:{discount:
                            {$gt:parseInt(price.split(' ')[0]),$lte:parseInt(price.split(' ')[1])}}}});
                    }
                    query['$and'].push(orQuery);
                    console.log(orQuery.$or[0]['info.priceAndAmount']) 
                }
            }

            if(key=="packSize"){
                if(params[key].length>0){
                    let orQuery={};
                    orQuery['$or']=[]
                    for(let packSize of params[key]){
                        orQuery['$or'].push({"info.priceAndAmount":{$elemMatch:
                            {amount:packSize.amount,suffix:packSize.suffix}}});
                    }
                    query['$and'].push(orQuery);
                    console.log(orQuery.$or) 
                } 
            }

            if(key=="foodPreferences"){
                if(params[key].length>0){
                    let orQuery={};
                    orQuery['$or']=[]
                    for(let foodPreference of params[key]){
                        orQuery['$or'].push({"info.foodPreference":foodPreference});
                    }
                    query['$and'].push(orQuery);
                    console.log(orQuery.$or) 
                }  
            }
        }

        console.log(query);
        if(query.$and.length==0){
            query={};
        }
        console.log(query);

        Products.SubProduct.find(query,(err,docs)=>{
            // console.log(err)
            console.log('here')
            if(err){
                logger.debug('some error occured during retrival of data');
                res.status(500).json('some error occured');
            } 
            else if(docs==null){
                logger.debug('no results');
                res.status(200).json('no results');
            }
            else{
                res.status(200).json(docs);
            }
        })

    }
}

module.exports=filteredSearch;