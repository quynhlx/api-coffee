import mongoose, { Schema } from 'mongoose'

const billSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  table: {
    type: Schema.ObjectId,
    ref: 'Table',
    required: true
  },
  customer: {
    type: String,
    required: true
  },
  status: {
    type: Number, // 0 đang đặt, 1 đã thanh toán , 2 đang pha chế, 3 kết thúc
    required: true
  },
  total: {
    type: Number
  },
  details: [{
    foodId: String,
    foodName: String,
    quatity: Number,
    price: Number
  }]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

billSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      user: this.user ? {
        name: this.user.name,
        id: this.user.id
      } : { },
      table: this.table ? {
        name: this.table.toObject().name,
        id: this.table.toObject()._id
      } : {},
      customer: this.customer,
      status: this.status,
      total: this.total,
      details: this.details,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Bill', billSchema)

export const schema = model.schema
export default model
