import { Bill } from '.'
import { User } from '../user'

let user, bill

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  bill = await Bill.create({ user : user, table: 'test', user: 'test', customer: 'test', status: 'test', total: 'test', details: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = bill.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(bill.id)
    expect(typeof view.user ).toBe('object')
    expect(view.user .id).toBe(user.id)
    expect(view.table).toBe(bill.table)
    expect(view.user).toBe(bill.user)
    expect(view.customer).toBe(bill.customer)
    expect(view.status).toBe(bill.status)
    expect(view.total).toBe(bill.total)
    expect(view.details).toBe(bill.details)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = bill.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(bill.id)
    expect(typeof view.user ).toBe('object')
    expect(view.user .id).toBe(user.id)
    expect(view.table).toBe(bill.table)
    expect(view.user).toBe(bill.user)
    expect(view.customer).toBe(bill.customer)
    expect(view.status).toBe(bill.status)
    expect(view.total).toBe(bill.total)
    expect(view.details).toBe(bill.details)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
