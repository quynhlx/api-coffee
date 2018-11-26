import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Table, { schema } from './model'

const router = new Router()
const { name, bill } = schema.tree

/**
 * @api {post} /tables Create table
 * @apiName CreateTable
 * @apiGroup Table
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam name Table's name.
 * @apiParam status Table's status.
 * @apiSuccess {Object} table Table's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Table not found.
 * @apiError 401 admin access only.
 */
router.post('/',
  token({ required: true, roles: ['admin'] }),
  body({ name, bill }),
  create)

/**
 * @api {get} /tables Retrieve tables
 * @apiName RetrieveTables
 * @apiGroup Table
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} tables List of tables.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query(),
  index)

/**
 * @api {get} /tables/:id Retrieve table
 * @apiName RetrieveTable
 * @apiGroup Table
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} table Table's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Table not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {put} /tables/:id Update table
 * @apiName UpdateTable
 * @apiGroup Table
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam name Table's name.
 * @apiParam status Table's status.
 * @apiSuccess {Object} table Table's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Table not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ name, bill }),
  update)

/**
 * @api {delete} /tables/:id Delete table
 * @apiName DeleteTable
 * @apiGroup Table
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Table not found.
 * @apiError 401 admin access only.
 */
router.delete('/:id',
  token({ required: true, roles: ['admin'] }),
  destroy)

export default router
