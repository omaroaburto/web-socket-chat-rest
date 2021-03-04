const isNumber = (x)=>{
    if(isNaN(x)){
        throw new Error(`El valor del precio del producto es inválido.`)
    }
}

const isPositiveNumber=(x)=>{
    if(x<0){
        throw new Error(`El valor del precio es negativo.`)
    } 
}

module.exports = {
    isNumber,
    isPositiveNumber
}