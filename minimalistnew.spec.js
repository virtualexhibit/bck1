import { shallowMount } from '@vue/test-utils'
import Minimalist from '@/components/Minimalist/MinimalistNew.vue'

// Mock ApiCaller globally
const mockFetch = jest.fn()
const mockPost = jest.fn()
const mockDelete = jest.fn()
const mockPut = jest.fn()

jest.mock('@/config/apiCaller', () => {
  return jest.fn().mockImplementation(() => {
    return {
      fetch: mockFetch,
      post: mockPost,
      delete: mockDelete,
      put: mockPut,
    }
  })
})

describe('Minimalist.vue Full Test Coverage', () => {
  let wrapper

  beforeEach(async () => {
    mockFetch.mockResolvedValue([]) // default fetch behavior

    wrapper = shallowMount(Minimalist)

    // Wait for mounted()
    await Promise.resolve()
  })

  // -----------------------------------------
  //  MODAL TESTS
  // -----------------------------------------
  test('faq() shows modal', () => {
    wrapper.vm.showModal = false
    wrapper.vm.faq()
    expect(wrapper.vm.showModal).toBe(true)
  })

  test('handleCloseButton() hides modal', () => {
    wrapper.vm.showModal = true
    wrapper.vm.handleCloseButton()
    expect(wrapper.vm.showModal).toBe(false)
  })

  // -----------------------------------------
  //  BUTTON ACTION TESTS
  // -----------------------------------------
  test('clickButton → faq()', () => {
    const spy = jest.spyOn(wrapper.vm, 'faq')
    wrapper.vm.clickButton({ on: { action: 'faq' } })
    expect(spy).toHaveBeenCalled()
  })

  test('clickButton → clearAll()', () => {
    const spy = jest.spyOn(wrapper.vm, 'clearAll')
    wrapper.vm.clickButton({ on: { action: 'clearAll' } })
    expect(spy).toHaveBeenCalled()
  })

  test('clickButton → clearCompleted()', () => {
    const spy = jest.spyOn(wrapper.vm, 'clearCompleted')
    wrapper.vm.clickButton({ on: { action: 'clearCompleted' } })
    expect(spy).toHaveBeenCalled()
  })

  // -----------------------------------------
  // findButtonDisable()
  // -----------------------------------------
  test('findButtonDisable: faq should return false', () => {
    expect(wrapper.vm.findButtonDisable('faq')).toBe(false)
  })

  test('findButtonDisable: other keys use computed', () => {
    wrapper.vm.allTask = true
    expect(wrapper.vm.findButtonDisable('allTask')).toBe(true)
  })

  // -----------------------------------------
  // COMPUTED PROPERTIES TESTS
  // -----------------------------------------
  test('incompleteTask counts incomplete tasks', () => {
    wrapper.vm.tasks = [
      { completed: false },
      { completed: true },
      { completed: false },
    ]
    expect(wrapper.vm.incompleteTask).toBe(2)
  })

  test('completedTask true only when no completed tasks exist', () => {
    wrapper.vm.tasks = [{ completed: false }]
    expect(wrapper.vm.completedTask).toBe(true)
  })

  test('allTask true only when no tasks exist', () => {
    wrapper.vm.tasks = []
    expect(wrapper.vm.allTask).toBe(true)
  })

  // -----------------------------------------
  // addNewTask()
  // -----------------------------------------
  test('addNewTask adds task and refetches', async () => {
    mockFetch.mockResolvedValue([{ id: 1, text: 'A', completed: false }])
    mockPost.mockResolvedValue({})

    await wrapper.vm.addNewTask('A')

    expect(mockPost).toHaveBeenCalledWith('tasks', { taskName: 'A' })
    expect(mockFetch).toHaveBeenCalled()
    expect(wrapper.vm.tasks.length).toBe(1)
  })

  // -----------------------------------------
  // onEmitDeleteTask()
  // -----------------------------------------
  test('onEmitDeleteTask deletes a task and refetches', async () => {
    wrapper.vm.tasks = [{ id: 99 }]
    mockDelete.mockResolvedValue({})
    mockFetch.mockResolvedValue([])

    await wrapper.vm.onEmitDeleteTask(0)

    expect(mockDelete).toHaveBeenCalledWith('tasks', { id: 99 })
    expect(mockFetch).toHaveBeenCalled()
  })

  // -----------------------------------------
  // onEmitToggleTask()
  // -----------------------------------------
  test('onEmitToggleTask toggles completed status and refetches', async () => {
    wrapper.vm.tasks = [{ id: 7, completed: false }]
    mockPut.mockResolvedValue({})
    mockFetch.mockResolvedValue([{ id: 7, completed: true }])

    await wrapper.vm.onEmitToggleTask(0)

    expect(mockPut).toHaveBeenCalledWith('tasks', {
      id: 7,
      completed: true,
    })
  })

  // -----------------------------------------
  // clearAll()
  // -----------------------------------------
  test('clearAll deletes all tasks', async () => {
    mockDelete.mockResolvedValue({})
    mockFetch.mockResolvedValue([])

    await wrapper.vm.clearAll()

    expect(mockDelete).toHaveBeenCalledWith('tasks', { id: 'all' })
    expect(mockFetch).toHaveBeenCalled()
  })

  // -----------------------------------------
  // clearCompleted()
  // -----------------------------------------
  test('clearCompleted deletes only completed tasks', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true)

    wrapper.vm.tasks = [
      { id: 1, completed: true },
      { id: 2, completed: false },
      { id: 3, completed: true },
    ]

    mockDelete.mockResolvedValue({})
    mockFetch.mockResolvedValue([])

    await wrapper.vm.clearCompleted()

    expect(mockDelete).toHaveBeenCalledTimes(2)
    expect(mockDelete).toHaveBeenCalledWith('tasks', { id: 1 })
    expect(mockDelete).toHaveBeenCalledWith('tasks', { id: 3 })
  })
})
