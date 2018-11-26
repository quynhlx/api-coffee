import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Bill } from '.'
export const create = ({ user, bodymen: { body } }, res, next) =>
  Bill.create({ ...body, user: user })
    .then((bill) => bill.view(true))
    .then((bill) => Bill.findById(bill.id)
      .populate('user')
      .populate('table')
    )
    .then((bill) => {
      let editedTable = {
        bill: bill.id
      }
      return Object.assign(bill.table, editedTable).save()
        .then(() => bill)
    })
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Bill.count(query)
    .then(count => Bill.find(query, select, cursor)
      .populate('user')
      .populate('table')
      .then((bills) => ({
        count,
        rows: bills.map((bill) => bill.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Bill.findById(params.id)
    .populate('user')
    .populate('table')
    .then(notFound(res))
    .then((bill) => bill ? bill.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Bill.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((bill) => bill ? Object.assign(bill, body).save() : null)
    .then((bill) => bill ? bill.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Bill.findById(params.id)
    .then(notFound(res))
    .then((bill) => bill ? bill.remove() : null)
    .then(success(res, 204))
    .catch(next)
