import mongoose, { Schema } from 'mongoose'

const tableSchema = new Schema({
  name: {
    type: String
  },
  bill: {
    type: Schema.ObjectId,
    ref: 'Bill'
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

tableSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      name: this.name,
      status: this.bill ? this.bill.status : 0,
      customerName: this.bill ? this.bill.customer : '',
      numberOrder: this.bill ? this.bill.toObject().details.length : 0,
      billId: this.bill ? this.bill.id : undefined
      // createdAt: this.createdAt,
      // updatedAt: this.updatedAt
    }
    return full ? {
      ...view,
      // add properties for a full view
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    } : view
  }
}

const model = mongoose.model('Table', tableSchema)

export const schema = model.schema
export default model
