import { success, notFound, authorOrAdmin } from '../../services/response/'
import Bill from './model'
import { Food } from './../food'
import { Table } from './../table '
export const create = ({ user, bodymen: { body } }, res, next) => {
  const getFoods = body.details.map(f => {
    return Food.findById(f.id).then(data => {
      return {
        foodId: f.id,
        foodName: data.name,
        quatity: f.quatity,
        price: data.price,
        pictures: f.pictures
      }
    })
  })
  return Table.findById(body.table).then(t => {
    if (t && t.bill) {
      return res.status(404).json({ error: 'Table is not avaiable' })
    } else if (!t) {
      return res.status(404).json({ error: 'Table is not avaiable' })
    }
    const saveBill = Promise.all(getFoods).then(details => {
      function getSum (sum, food) {
        return sum + parseFloat(food.price) * parseInt(food.quatity)
      }
      body.total = details.reduce(getSum, 0)
      body.details = details
      return Bill.create({ ...body, user: user })
        .then(bill =>
          Bill.findById(bill.id)
            .populate('user')
            .populate('table')
        )
        .then(bill => bill.view(true))
    })
    return saveBill
      .then(bill => {
        if (body.status === 4) {
          t.bill = null
        } else {
          t.bill = bill.id
        }
        return t.save().then(() => bill)
      })
      .then(success(res, 201))
      .catch(next)
  })
}

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Bill.count(query)
    .then(count =>
      Bill.find(query, select, cursor)
        .populate('user')
        .populate('table')
        .then(bills => ({
          count,
          rows: bills.map(bill => bill.view())
        }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Bill.findById(params.id)
    .populate('user')
    .populate('table')
    .then(notFound(res))
    .then(bill => (bill ? bill.view() : null))
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) => {
  const getFoods = body.details.map(f => {
    return Food.findById(f.id).then(data => {
      return {
        foodId: f.id,
        foodName: data.name,
        quatity: f.quatity,
        price: data.price,
        pictures: f.pictures
      }
    })
  })
  const saveBill = Promise.all(getFoods).then(details => {
    function getSum (sum, food) {
      return sum + parseFloat(food.price) * parseInt(food.quatity)
    }
    body.total = details.reduce(getSum, 0)
    body.details = details
    return Bill.findById(params.id)
      .populate('user')
      .then(notFound(res))
      .then(authorOrAdmin(res, user, 'user'))
      .then(bill => (bill ? Object.assign(bill, body).save() : null))
      .then(bill => {
        return Bill.findById(bill.id)
          .populate('user')
          .populate('table')
      })
      .then(bill => (bill ? bill.view() : null))
  })
  return saveBill
    .then(bill => {
      return Table.findById(bill.table.id.toString()).then((t, e) => {
        if (body.status === 4) {
          t.bill = null
        } else {
          t.bill = bill.id
        }
        return t.save().then(() => bill)
      })
    })
    .then(success(res, 201))
    .catch(next)
}

export const destroy = ({ params }, res, next) =>
  Bill.findById(params.id)
    .then(notFound(res))
    .then(bill => (bill ? bill.remove() : null))
    .then(success(res, 204))
    .catch(next)
