import { jest, expect, test } from '@jest/globals';
import state from './index.js';

state.set({ a: 1, b: 1, c: 1 });

test('Check state value', () => {
  expect(state.a).toBe(1);
});

test('Check watch mode', () => {
  const setCallback = jest.fn();
  const paramCallback = jest.fn();

  state.watch.a = setCallback;
  state.watch.a(paramCallback);

  state.a = 2;
  expect(setCallback).toBeCalled();
  expect(paramCallback).toBeCalled();
});

test('Check watch mode with condition true', () => {
  const setCallback = jest.fn();
  const paramCallback = jest.fn();

  state.when.b.watch.a = setCallback;
  state.when.b.watch.a(paramCallback);
  
  state.a = 2;
  
  expect(setCallback).toBeCalled();
  expect(paramCallback).toBeCalled();
});

test('Check watch mode with condition false', () => { 
  const setCallback = jest.fn();
  const paramCallback = jest.fn();

  state.when.b.watch.a = setCallback;
  state.when.b.watch.a(paramCallback);
  
  state.b = false;
  state.a = 3;
  
  expect(setCallback).not.toBeCalled();
  expect(paramCallback).not.toBeCalled();
  
});

test('Check watch mode with multiple conditions with and chaining resulting in true', () => { 
  const setCallback = jest.fn();
  const paramCallback = jest.fn();

  state.when.b.and.c.watch.a = setCallback;
  state.when.b.and.c.watch.a(paramCallback);
  
  state.b = true;
  state.c = true;
  state.a = 3;
  
  expect(setCallback).toBeCalled();
  expect(paramCallback).toBeCalled();
});

test('Check watch mode with multiple conditions with and chaining resultig in false', () => { 
  const setCallback = jest.fn();
  const paramCallback = jest.fn();

  state.when.b.and.c.watch.a = setCallback;
  state.when.b.and.c.watch.a(paramCallback);
  
  state.b = true;
  state.c = false;
  state.a = 3;
  
  expect(setCallback).not.toBeCalled();
  expect(paramCallback).not.toBeCalled();
});

test('Check watch mode with multiple conditions with or chaining resulting in true', () => { 
  const setCallback = jest.fn();
  const paramCallback = jest.fn();

  state.when.b.or.c.watch.a = setCallback;
  state.when.b.or.c.watch.a(paramCallback);
  
  state.b = true;
  state.c = true;
  state.a = 3;
  
  expect(setCallback).toBeCalled();
  expect(paramCallback).toBeCalled();
});

test('Check watch mode with multiple conditions with or chaining resultig in true 2', () => { 
  const setCallback = jest.fn();
  const paramCallback = jest.fn();

  state.when.b.or.c.watch.a = setCallback;
  state.when.b.or.c.watch.a(paramCallback);
  
  state.b = true;
  state.c = false;
  state.a = 3;
  
  expect(setCallback).toBeCalled();
  expect(paramCallback).toBeCalled();
});

test('Check watch mode with multiple conditions with or chaining resultig in false', () => { 
  const setCallback = jest.fn();
  const paramCallback = jest.fn();

  state.when.b.or.c.watch.a = setCallback;
  state.when.b.or.c.watch.a(paramCallback);
  
  state.b = false;
  state.c = false;
  state.a = 3;
  
  expect(setCallback).not.toBeCalled();
  expect(paramCallback).not.toBeCalled();
});

test('Check watch mode with is keyword comparison with string', () => {
  const setCallback = jest.fn();
  const paramCallback = jest.fn();

  state.when.b.is('asd').watch.a = setCallback;
  state.when.b.is('asd').watch.a(paramCallback);
  
  state.b = 'asd';
  state.a = 3;
  
  expect(setCallback).toBeCalled();
  expect(paramCallback).toBeCalled();
});
test('Check watch mode with is keyword comparison with object', () => {
  const setCallback = jest.fn();
  const paramCallback = jest.fn();

  const obj = { testobj: 1 };
  
  state.when.b.is(obj).watch.a = setCallback;
  state.when.b.is(obj).watch.a(paramCallback);
  
  state.b = obj;
  state.a = 3;
  
  expect(setCallback).toBeCalled();
  expect(paramCallback).toBeCalled();
});

test('Check watch mode with is keyword comparison with object 2', () => {
  const setCallback = jest.fn();
  const paramCallback = jest.fn();
  
  const obj = { testobj: 1 };
  
  state.when.b.is({ ...obj }).watch.a = setCallback;
  state.when.b.is({...obj}).watch.a(paramCallback);
  
  state.b = obj;
  state.a = 3;
  
  expect(setCallback).not.toBeCalled();
  expect(paramCallback).not.toBeCalled();
});

test('Check when.watch error', () => {
  try {
    state.when.watch
  } catch (error) {
    expect(error.message).toBe('You should specify a state member to check after "when" before calling watch'); 
  }
});

test('Check when.is error', () => {
  try {
    state.when.is
  } catch (error) {
    expect(error.message).toBe('You should specify a state member to check after "when" before calling watch'); 
  }
});

test('Check or.more without is error', () => {
  try {
    state.when.a.or.more
  } catch (error) {
    expect(error.message).toBe('You must use the is() method before using the "more"'); 
  }
});

test('Check or.more without is error', () => {
  try {
    state.when.a.or.less
  } catch (error) {
    expect(error.message).toBe('You must use the is() method before using the "less"'); 
  }
});

