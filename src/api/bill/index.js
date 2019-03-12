import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'

const router = new Router()
const { table, customer, status, total, details } = schema.tree

/**
 * @api {post} /bills Create bill
 * @apiName CreateBill
 * @apiGroup Bill
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam table Bill's table.
 * @apiParam customer Bill's customer.
 * @apiParam {Number} status Bill's status.
 * 1 is created,
 * 2 is ordering,
 * 3 is preparing,
 * 4 is completed,
 * @apiParam {Array} details
 * @apiParam {String} detail.id
 * @apiParam {Number} detail.quatity
 * @apiSuccess {Object} bill Bill's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Bill not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ table, customer, status, details }),
  create)

/**
 * @api {get} /bills Retrieve bills
 * @apiName RetrieveBills
 * @apiGroup Bill
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of bills.
 * @apiSuccess {Object[]} rows List of bills.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query(),
  index)

/**
 * @api {get} /bills/:id Retrieve bill
 * @apiName RetrieveBill
 * @apiGroup Bill
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} bill Bill's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Bill not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {put} /bills/:id Update bill
 * @apiName UpdateBill
 * @apiGroup Bill
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam table Bill's table.
 * @apiParam customer Bill's customer.
 * @apiParam {Number} status Bill's status.
 * 1 is created,
 * 2 is ordering,
 * 3 is preparing,
 * 4 is completed,
 * @apiParam {Array} details
 * @apiParam {String} detail.id
 * @apiParam {Number} detail.quatity
 * @apiSuccess {Object} bill Bill's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Bill not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ table, customer, status, total, details }),
  update)

/**
 * @api {delete} /bills/:id Delete bill
 * @apiName DeleteBill
 * @apiGroup Bill
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Bill not found.
 * @apiError 401 admin access only.
 */
router.delete('/:id',
  token({ required: true, roles: ['admin'] }),
  destroy)

export default router
