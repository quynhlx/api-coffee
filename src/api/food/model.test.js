import { Food } from '.'

let food

beforeEach(async () => {
  food = await Food.create({ name: 'test', price: 'test', pictures: 'test', quantity: 'test', categories: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = food.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(food.id)
    expect(view.name).toBe(food.name)
    expect(view.price).toBe(food.price)
    expect(view.pictures).toBe(food.pictures)
    expect(view.quantity).toBe(food.quantity)
    expect(view.categories).toBe(food.categories)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = food.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(food.id)
    expect(view.name).toBe(food.name)
    expect(view.price).toBe(food.price)
    expect(view.pictures).toBe(food.pictures)
    expect(view.quantity).toBe(food.quantity)
    expect(view.categories).toBe(food.categories)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
