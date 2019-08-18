const express=require('express');
const filterRoutes=express.Router();

const filterSearch=require('../../db/crudOperations/filteredSearch');


filterRoutes.post('/getfilteredproducts',(req,res)=>{
    //should contain productid/productName/subcatid/catid
    console.log(req.body);
    var obj=req.body;
    filterSearch.getFilteredData(res,obj);
})

module.exports=filterRoutes;