import { success, notFound } from '../../services/response/'
import { Food } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  Food.create(body)
    .populate('categories')
    .then((food) => food.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Food.count(query)
    .then(count => Food.find(query, select, cursor)
      .populate('categories')
      .then((foods) => ({
        count,
        rows: foods.map((food) => food.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Food.findById(params.id)
    .then(notFound(res))
    .populate('categories')
    .then((food) => food ? food.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Food.findById(params.id)
    .then(notFound(res))
    .then((food) => food ? Object.assign(food, body).save() : null)
    .populate('categories')
    .then((food) => food ? food.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Food.findById(params.id)
    .then(notFound(res))
    .then((food) => food ? food.remove() : null)
    .then(success(res, 204))
    .catch(next)
