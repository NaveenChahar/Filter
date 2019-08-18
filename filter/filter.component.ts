import { Component, OnInit } from "@angular/core";
import { FilterProductDataService } from './services/filterProductDataService';


@Component({
    selector:'filter-search',
    templateUrl:'./filter.component.html',
    styleUrls:['./filter.component.css'],
    providers:[FilterProductDataService]
})

export class FilterSearchComponent implements OnInit{

    private currentFilter="";
    private initialData=false;
    private resultDataLength;   //broadcast to outside
    private filterParams={
        brands:[],
        prices:[],
        discount:[],
        packSize:[],                  //for query formation on backend, pass to div that
        foodPreferences:[],           //shows what all filters are applied and keeps track of all 
                                      //the selected checkboxes
    };
    private filteredBrands=[];
    private filteredFoodPreferences=[]; //for display on front 
    private filteredDiscount=[
        {name:'0-15%',range:'0 15',isChecked:false},
        {name:'15-25%',range:'15 25',isChecked:false},
        {name:'25-40%',range:'25 40',isChecked:false},
        {name:'40-60%',range:'40 60',isChecked:false},
        {name:'More than 60%',range:'60 100',isChecked:false}
    ];      
    private filteredPackSize=[];
    private filteredPrices=[{name:'Less than Rs 20',range:'0 20',isChecked:false},
        {name:'Rs 20 to Rs 50',range:'20 50',isChecked:false},
        {name:'Rs 51 to Rs 100',range:'51 100',isChecked:false},
        {name:'Rs 101 to Rs 200',range:'101 200',isChecked:false},
        {name:'Rs 201 to Rs 500',range:'201 500',isChecked:false},         //predefined ranges
        {name:'More than Rs 501',range:'501 1000000',isChecked:false},             
    ];

    constructor(private filterData:FilterProductDataService){}

    ngOnInit(){ 
        this.getFilteredData();
    }

    getFilteredData(){
        this.filterData.getFilteredProducts(this.filterParams).subscribe(data=>{
            if(data!=null){
                //set the arrays for display
                this.setUnCheckedStatus();
                this.setDisplayArrays(data);
                this.setCheckedStatus();
                this.initialData=true;
            }
            else{
                console.log('no data')
            }
        },(err)=>{
            console.log(err)
        })
    }
    setDisplayArrays(data){
        if(this.currentFilter!="brands"){   //resetting all the display arrays on
            this.filteredBrands=[];         //arrival of new data
        }           
        if(this.currentFilter!="packSize"){
            this.filteredPackSize=[];
        }
        if(this.currentFilter!="foodPreferences"){
            this.filteredFoodPreferences=[];
        }

        // this.filteredBrands=[]; 
        // this.filteredPackSize=[];
        // this.filteredFoodPreferences=[];
        for(let product of data){
            for(let pna of product.info.priceAndAmount){
                let packSize={amount:pna.amount,suffix:pna.suffix,isChecked:false};   //set pcksize for display
                if(!this.containsObject(this.filteredPackSize,packSize)){
                    this.filteredPackSize.push(packSize);
                }
            }
            let brand={name:product.info.brand,isChecked:false};
            if(!this.containsObject(this.filteredBrands,brand)){
                console.log(this.filteredBrands)
                this.filteredBrands.push(brand);           //set brands for display
            }
            let foodpref={foodType:product.info.foodPreference,isChecked:false};
            if(!this.containsObject(this.filteredFoodPreferences,foodpref)){
                this.filteredFoodPreferences.push(foodpref);     //set foodpref for display
                console.log(this.filteredFoodPreferences)
            }
        }
    }

    setCheckedStatus(){
        for(let name of this.filterParams.brands){
            for(let brand of this.filteredBrands){ 
                if(brand.name==name){
                    brand.isChecked=true;          //setting checked status for selected brands
                }
            }
        }
        for(let obj of this.filterParams.packSize){
            for(let packSize of this.filteredPackSize){
                if(obj.amount==packSize.amount&&obj.suffix==packSize.suffix){
                    packSize.isChecked=true;          //setting checked status for selected packSizes
                }
            }
        }
        for(let foodPref of this.filterParams.foodPreferences){
            for(let obj of this.filteredFoodPreferences){
                if(obj.foodType==foodPref){
                    obj.isChecked=true;        //setting checked status for selected foodPref
                }
            }
        }
 
    }

    setUnCheckedStatus(){
        
        for(let brand of this.filteredBrands){     
            brand.isChecked=false;          //setting unchecked status for all brands
        }
        for(let packSize of this.filteredPackSize){     
            packSize.isChecked=false;       //setting unchecked status for all packSizes   
        }
        for(let foodPref of this.filteredFoodPreferences){     
            foodPref.isChecked=false;       //setting unchecked status for all foodpref   
        }                                   //to avoid repitition

    }

    containsObject(list, obj) {       //check for repetition
        var i;
        var res=false;
        for (i = 0; i < list.length; i++) {
            for(let key in obj){
                if(list[i][key]===obj[key]){
                    res=true;
                }
                else{
                    res=false;
                    break;
                }
            }
            if(res==true){
                return true;
            }
        }
    
        return res;
    }

    giveIndex(list, obj) {       //give index in array
        var i;
        var res=false;
        for (i = 0; i < list.length; i++) {
            for(let key in obj){
                if(list[i][key]===obj[key]){
                    res=true;
                }
                else{
                    res=false;
                    break;
                }
            }
            if(res==true){
                return i;
            }
        }
    
        return -1;
    }

    applyBrandFilter(data){
        var name=data.name;
        this.currentFilter="brands"; 
        console.log(data.isChecked)        //set currentFilter
        if(!data.isChecked){
            this.filterParams.brands.push(name);
            console.log(this.filterParams)
        }
        else{
            let index=this.filterParams.brands.indexOf(name);
            if(index>-1){
                this.filterParams.brands.splice(index,1);
            }
            console.log(this.filterParams)
        }
        this.getFilteredData()
    }

    applyPriceFilter(data){
        var range=data.range;
        this.currentFilter="prices";
        if(!data.isChecked){
            data.isChecked=true;
            this.filterParams.prices.push(range);
        }
        else{
            data.isChecked=false;
            let index=this.filterParams.prices.indexOf(range);
            if(index>-1){
                this.filterParams.prices.splice(index,1);
            }
        }
        this.getFilteredData();
    }

    applyDiscountFilter(data){
        var range=data.range;
        this.currentFilter="discount";
        if(!data.isChecked){
            data.isChecked=true;
            this.filterParams.discount.push(range);
        }
        else{
            data.isChecked=false;
            let index=this.filterParams.discount.indexOf(range);
            if(index>-1){
                this.filterParams.discount.splice(index,1);
            }
        }
        this.getFilteredData();
    }

    applyPackSizeFilter(data){
        this.currentFilter="packSize";
        if(!data.isChecked){
            this.filterParams.packSize.push({amount:data.amount,suffix:data.suffix});
        }
        else{
            let index=this.giveIndex(this.filterParams.packSize,{amount:data.amount,suffix:data.suffix});
            if(index>-1){
                this.filterParams.packSize.splice(index,1);
            }
        }
        data.isChecked=false;
        this.getFilteredData();
    }

    applyFoodPreferenceFilter(data){
        var foodType=data.foodType;
        this.currentFilter="foodPreferences";         //set currentFilter
        if(!data.isChecked){
            this.filterParams.foodPreferences.push(foodType);
        }
        else{
            let index=this.filterParams.foodPreferences.indexOf(foodType);
            if(index>-1){
                this.filterParams.foodPreferences.splice(index,1);
            }
        }
        data.isChecked=false;
        this.getFilteredData() 
    }
}