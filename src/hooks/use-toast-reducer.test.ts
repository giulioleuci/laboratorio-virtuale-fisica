import { test, describe } from 'node:test';
import assert from 'node:assert';
import { reducer, actionTypes, type State, type ToasterToast } from './use-toast-reducer.ts';

describe('use-toast reducer', () => {
  const mockToast: ToasterToast = {
    id: '1',
    title: 'Test Title',
    description: 'Test Description',
    open: true,
  };

  test('ADD_TOAST should add a toast to empty state', () => {
    const initialState: State = { toasts: [] };
    const action = { type: actionTypes.ADD_TOAST, toast: mockToast };
    const newState = reducer(initialState, action);

    assert.strictEqual(newState.toasts.length, 1);
    assert.deepStrictEqual(newState.toasts[0], mockToast);
  });

  test('ADD_TOAST should respect TOAST_LIMIT and replace oldest', () => {
    const initialState: State = { toasts: [mockToast] };
    const newToast: ToasterToast = { ...mockToast, id: '2', title: 'New Toast' };
    const action = { type: actionTypes.ADD_TOAST, toast: newToast };
    const newState = reducer(initialState, action);

    assert.strictEqual(newState.toasts.length, 1);
    assert.strictEqual(newState.toasts[0].id, '2');
  });

  test('UPDATE_TOAST should update an existing toast', () => {
    const initialState: State = { toasts: [mockToast] };
    const updatedToast = { id: '1', title: 'Updated Title' };
    const action = { type: actionTypes.UPDATE_TOAST, toast: updatedToast };
    const newState = reducer(initialState, action);

    assert.strictEqual(newState.toasts.length, 1);
    assert.strictEqual(newState.toasts[0].title, 'Updated Title');
    assert.strictEqual(newState.toasts[0].description, 'Test Description'); // Should keep other fields
  });

  test('UPDATE_TOAST should not update non-existent toast', () => {
    const initialState: State = { toasts: [mockToast] };
    const updatedToast = { id: '999', title: 'Updated Title' };
    const action = { type: actionTypes.UPDATE_TOAST, toast: updatedToast };
    const newState = reducer(initialState, action);

    assert.strictEqual(newState.toasts.length, 1);
    assert.strictEqual(newState.toasts[0].title, 'Test Title');
  });

  test('DISMISS_TOAST with ID should mark specific toast as closed', () => {
    const initialState: State = { toasts: [mockToast] };
    const action = { type: actionTypes.DISMISS_TOAST, toastId: '1' };
    const newState = reducer(initialState, action);

    assert.strictEqual(newState.toasts.length, 1);
    assert.strictEqual(newState.toasts[0].open, false);
  });

  test('DISMISS_TOAST without ID should mark all toasts as closed', () => {
    const toast2 = { ...mockToast, id: '2' };
    const initialState: State = { toasts: [mockToast, toast2] };
    const action = { type: actionTypes.DISMISS_TOAST };
    const newState = reducer(initialState, action);

    assert.strictEqual(newState.toasts.length, 2);
    assert.strictEqual(newState.toasts[0].open, false);
    assert.strictEqual(newState.toasts[1].open, false);
  });

  test('REMOVE_TOAST with ID should remove specific toast', () => {
    const toast2 = { ...mockToast, id: '2' };
    const initialState: State = { toasts: [mockToast, toast2] };
    const action = { type: actionTypes.REMOVE_TOAST, toastId: '1' };
    const newState = reducer(initialState, action);

    assert.strictEqual(newState.toasts.length, 1);
    assert.strictEqual(newState.toasts[0].id, '2');
  });

  test('REMOVE_TOAST without ID should remove all toasts', () => {
    const toast2 = { ...mockToast, id: '2' };
    const initialState: State = { toasts: [mockToast, toast2] };
    const action = { type: actionTypes.REMOVE_TOAST };
    const newState = reducer(initialState, action);

    assert.strictEqual(newState.toasts.length, 0);
  });
});
