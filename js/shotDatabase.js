var database = {
    existingItems: null,
    clear: function(){
        this.existingItems = null;
        window.localStorage.clear();
    },
    setItem: function(key,args){
        if(this.existingItems==null) this.existingItems = [];
        this.existingItems.push(args);
        window.localStorage.setItem(key,JSON.stringify(this.existingItems));
    },
    getAllItems: function(){

    }
}

jQuery(window).on('DispersionData:add',function(e,args){
    database.setItem("DispersionData",args);
});
if(typeof module !== 'undefined') module.exports = database;