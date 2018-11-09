import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Table } from '.'

const app = () => express(apiRoot, routes)

let userSession, adminSession, table

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  table = await Table.create({})
})

test('POST /tables 201 (admin)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: adminSession, name: 'test', status: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.name).toEqual('test')
  expect(body.status).toEqual('test')
})

test('POST /tables 401 (user)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('POST /tables 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /tables 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /tables 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /tables/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${table.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(table.id)
})

test('GET /tables/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${table.id}`)
  expect(status).toBe(401)
})

test('GET /tables/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /tables/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${table.id}`)
    .send({ access_token: userSession, name: 'test', status: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(table.id)
  expect(body.name).toEqual('test')
  expect(body.status).toEqual('test')
})

test('PUT /tables/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${table.id}`)
  expect(status).toBe(401)
})

test('PUT /tables/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: userSession, name: 'test', status: 'test' })
  expect(status).toBe(404)
})

test('DELETE /tables/:id 204 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${table.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(204)
})

test('DELETE /tables/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${table.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /tables/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${table.id}`)
  expect(status).toBe(401)
})

test('DELETE /tables/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
