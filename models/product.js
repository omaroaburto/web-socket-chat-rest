const {
    Schema, 
    model
} = require("mongoose");

const ProductSchema = Schema({
    name:{
        type:String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    status:{
        type:Boolean,
        default: true,
        required: true
    },
    price: {
        type:Number,
        default:0
    },
    img: {
        type: String, 
    },
    description:{
        type:String,
        required: [true, 'La descripción es obligatoria']
    },
    available:{
        type:Boolean,
        default:true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
});

ProductSchema.methods.toJSON = function (){
    const {__v, status, ...data} = this.toObject();
    return data;
}

module.exports = model('Product',ProductSchema);