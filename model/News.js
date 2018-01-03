"use strict";
const ModelBase = require('./Base');


const OPERATOR={
    EQ:'eq',

    NE:'ne',

    LT:'lt',
    LTE:'lte',
    GT:'gt',
    GTE:'gte',

    CONTAINS:'contains',
    IN:'in'
}
class NewsModel extends ModelBase {
    constructor() {
        var collectionName = 'news',
            fields = [
                'origin_id', 'origin_url', 'type', 'mainpic', 'tag', 'title', 'content', 'source', 'time', {
                    name: 'imgs',
                    type: 'json'
                }, {
                    name: 'cmt',
                    type: 'number'
                }
        ];        
        super(fields, collectionName)
    }

    
    async getlist(query, fn) {

        
        var limit = (query.limit || 100) - 0;
        var filters = query.filter && query.filter.split(',')
        var filter = {},
        selector={};

        for(var i=0;i<100;i++){
            var name=query['name'+i],
                operator=query['operator'+i],
                value=query['value'+i];
            if(!name){
                break
            }
            if(value){
                switch(operator){
                    case OPERATOR.EQ:
                        selector[name]=value;
                    break
                    case OPERATOR.NE:
                    case OPERATOR.LTE:
                    case OPERATOR.LT:
                    case OPERATOR.GTE:
                    case OPERATOR.GT:
                        selector[name]={};
                        selector[name]['$'+operator]=value
                      
                    break
                    case OPERATOR.CONTAINS:
                        selector[name]={
                            $regex:new RegExp(value),
                            $options:'i'
                        }
                    break
                    case OPERATOR.IN:
                        var in_arr=value.split(',');
                        selector[name]={
                            $in:in_arr
                        }
                        limit=Math.max(in_arr.length,limit)
                    break

                }
            }
        }

        if (filters && filters.length) {
            for (var i = 0, n; n = filters[i++];) {
                filter[n] = 1;
            }
        } else {
            filter._ds_id = 0;
            filter._cts = 0;
            filter.content = 0;
            filter.origin_url = 0;
            filter.source = 0;
        }

        if(selector._id){
            selector._id=this.ObjectID(selector._id) 
            if(filter.content==0){
                delete filter.content
            }
        }

        return await this.collection.find(selector,filter).sort({
            _cts: -1
        }).limit(limit).toArray();


    }
    async getslider(query, fn) {
        var limit = (query.limit || 5) - 0;

        var result= await this.collection.find({
            type: 'img',
            "imgs.2": {
                $exists: 1
            }
        }, {
            id: 1,
            title: 1,
            mainpic: 1
        }).sort({
            _cts: -1
        }).limit(limit).toArray();
        return result.map((n)=>{
            return {
                src: n.mainpic,
                title: n.title
            }
        });
    }



}
module.exports = new NewsModel();



