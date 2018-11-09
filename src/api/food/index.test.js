import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Food } from '.'

const app = () => express(apiRoot, routes)

let userSession, adminSession, food

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  food = await Food.create({})
})

test('POST /foods 201 (admin)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: adminSession, name: 'test', price: 'test', pictures: 'test', quantity: 'test', categories: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.name).toEqual('test')
  expect(body.price).toEqual('test')
  expect(body.pictures).toEqual('test')
  expect(body.quantity).toEqual('test')
  expect(body.categories).toEqual('test')
})

test('POST /foods 401 (user)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('POST /foods 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /foods 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /foods 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /foods/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${food.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(food.id)
})

test('GET /foods/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${food.id}`)
  expect(status).toBe(401)
})

test('GET /foods/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /foods/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${food.id}`)
    .send({ access_token: userSession, name: 'test', price: 'test', pictures: 'test', quantity: 'test', categories: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(food.id)
  expect(body.name).toEqual('test')
  expect(body.price).toEqual('test')
  expect(body.pictures).toEqual('test')
  expect(body.quantity).toEqual('test')
  expect(body.categories).toEqual('test')
})

test('PUT /foods/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${food.id}`)
  expect(status).toBe(401)
})

test('PUT /foods/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: userSession, name: 'test', price: 'test', pictures: 'test', quantity: 'test', categories: 'test' })
  expect(status).toBe(404)
})

test('DELETE /foods/:id 204 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${food.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(204)
})

test('DELETE /foods/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${food.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /foods/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${food.id}`)
  expect(status).toBe(401)
})

test('DELETE /foods/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
