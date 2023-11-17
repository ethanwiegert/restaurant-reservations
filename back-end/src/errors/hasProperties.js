function hasProperties(...properties){
return function(res, req, next){
    const {data={}}=res.body

    try{
        properties.forEach((property)=>{
            if(!data[property]){
                const error=new Error(`Missing required ${property} for data.`)
                error.status=400
                throw error
            }
        })
    }
    catch(error){
        next(error)
    }
}
}

module.exports=hasProperties