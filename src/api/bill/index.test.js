import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Bill } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, adminSession, bill

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  adminSession = signSync(admin.id)
  bill = await Bill.create({ user : user })
})

test('POST /bills 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, table: 'test', user: 'test', customer: 'test', status: 'test', total: 'test', details: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.table).toEqual('test')
  expect(body.user).toEqual('test')
  expect(body.customer).toEqual('test')
  expect(body.status).toEqual('test')
  expect(body.total).toEqual('test')
  expect(body.details).toEqual('test')
  expect(typeof body.user ).toEqual('object')
})

test('POST /bills 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /bills 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
  expect(typeof body.rows[0].user ).toEqual('object')
})

test('GET /bills 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /bills/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${bill.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(bill.id)
  expect(typeof body.user ).toEqual('object')
})

test('GET /bills/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${bill.id}`)
  expect(status).toBe(401)
})

test('GET /bills/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /bills/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${bill.id}`)
    .send({ access_token: userSession, table: 'test', user: 'test', customer: 'test', status: 'test', total: 'test', details: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(bill.id)
  expect(body.table).toEqual('test')
  expect(body.user).toEqual('test')
  expect(body.customer).toEqual('test')
  expect(body.status).toEqual('test')
  expect(body.total).toEqual('test')
  expect(body.details).toEqual('test')
  expect(typeof body.user ).toEqual('object')
})

test('PUT /bills/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${bill.id}`)
    .send({ access_token: anotherSession, table: 'test', user: 'test', customer: 'test', status: 'test', total: 'test', details: 'test' })
  expect(status).toBe(401)
})

test('PUT /bills/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${bill.id}`)
  expect(status).toBe(401)
})

test('PUT /bills/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, table: 'test', user: 'test', customer: 'test', status: 'test', total: 'test', details: 'test' })
  expect(status).toBe(404)
})

test('DELETE /bills/:id 204 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${bill.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(204)
})

test('DELETE /bills/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${bill.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /bills/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${bill.id}`)
  expect(status).toBe(401)
})

test('DELETE /bills/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
