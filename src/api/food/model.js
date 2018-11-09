import mongoose, { Schema } from 'mongoose'

const foodSchema = new Schema({
  name: {
    type: String
  },
  price: {
    type: Number
  },
  pictures: [{
    type: String
  }],
  quantity: {
    type: Number,
    default: 0
  },
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

foodSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      name: this.name,
      price: this.price,
      pictures: this.pictures,
      quantity: this.quantity,
      categories: this.categories,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Food', foodSchema)

export const schema = model.schema
export default model
