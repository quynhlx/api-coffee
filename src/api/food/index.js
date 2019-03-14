import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Food, { schema } from './model'

const router = new Router()
const { name, price, pictures, detail, quantity, categories } = schema.tree

/**
 * @api {post} /foods Create food
 * @apiName CreateFood
 * @apiGroup Food
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam name Food's name.
 * @apiParam price Food's price.
 * @apiParam pictures Food's pictures.
 * @apiParam detail Food Detail.
 * @apiParam categories Food's categories.
 * @apiSuccess {Object} food Food's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Food not found.
 * @apiError 401 admin access only.
 */
router.post('/',
  token({ required: true, roles: ['admin', 'water', 'bartender'] }),
  body({ name, price, pictures, detail, quantity, categories }),
  create)

/**
 * @api {get} /foods Retrieve foods
 * @apiName RetrieveFoods
 * @apiGroup Food
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of foods.
 * @apiSuccess {Object[]} rows List of foods.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query({
    categories: {
      type: Array,
      paths: ['categories'],
      operator: '$in'
    }
  }),
  index)

/**
 * @api {get} /foods/:id Retrieve food
 * @apiName RetrieveFood
 * @apiGroup Food
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} food Food's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Food not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {put} /foods/:id Update food
 * @apiName UpdateFood
 * @apiGroup Food
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam name Food's name.
 * @apiParam price Food's price.
 * @apiParam pictures Food's pictures.
 * @apiParam detail Food Detail.
 * @apiParam categories Food's categories.
 * @apiSuccess {Object} food Food's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Food not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ name, price, pictures, detail, quantity, categories }),
  update)

/**
 * @api {delete} /foods/:id Delete food
 * @apiName DeleteFood
 * @apiGroup Food
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Food not found.
 * @apiError 401 admin access only.
 */
router.delete('/:id',
  token({ required: true, roles: ['admin', 'water', 'bartender'] }),
  destroy)

export default router
