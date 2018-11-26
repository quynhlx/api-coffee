import { success, notFound } from '../../services/response/'
import { Table } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  Table.create(body)
    .then((table) => table.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Table.find(query, select, cursor)
    .populate('bill')
    .then((tables) => tables.map((table) => table.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Table.findById(params.id)
    .populate('bill')
    .then(notFound(res))
    .then((table) => table ? table.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Table.findById(params.id)
    .then(notFound(res))
    .then((table) => table ? Object.assign(table, body).save() : null)
    .then((table) => table ? table.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Table.findById(params.id)
    .then(notFound(res))
    .then((table) => table ? table.remove() : null)
    .then(success(res, 204))
    .catch(next)
