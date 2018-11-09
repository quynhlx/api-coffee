import { Table } from '.'

let table

beforeEach(async () => {
  table = await Table.create({ name: 'test', status: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = table.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(table.id)
    expect(view.name).toBe(table.name)
    expect(view.status).toBe(table.status)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = table.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(table.id)
    expect(view.name).toBe(table.name)
    expect(view.status).toBe(table.status)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
