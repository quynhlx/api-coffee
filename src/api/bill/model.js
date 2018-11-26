import mongoose, { Schema } from 'mongoose'

const billSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  table: {
    type: Schema.ObjectId,
    ref: 'Table'
  },
  customer: {
    type: String
  },
  status: {
    type: Number // 0 đang đặt, 1 đã thanh toán , 2 đang pha chế, 3 kết thúc
  },
  total: {
    type: Number
  },
  details: [{
    food: {
      type: Schema.ObjectId,
      ref: 'Food'
    },
    foodName: String,
    quatity: Number,
    amount: Number
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
      user: this.user.view(full),
      // table: this.table.view(full),
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
