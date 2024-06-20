import { expect, test } from 'vitest'
import { bingoCheck } from "./check_win"

test('horizontal positive', () => {
  const board = [
    '--', '[]', '[]', '[]', '[]',
    '[]', '[]', '--', null, '[]',
    '[]', null, '--', null, '[]',
    null, null, null, null, null,
    '[]', '[]', '[]', '[]', '[]',
  ]

  expect(bingoCheck(board)?.winner).toBe('[]')
})

test('vertical positive', () => {
  const board = [
    '--', null, '[]', '[]', '--',
    '[]', null, '--', null, '--',
    '[]', null, '--', null, '--',
    '[]', null, null, '[]', '--',
    '[]', null, '[]', '[]', '--',
  ]

  expect(bingoCheck(board)?.winner).toBe('--')
})

test('diagonal 1', () => {
  const board = [
    '[]', '[]', '[]', '[]', '--',
    '[]', '[]', '--', null, '--',
    '--', null, '[]', null, '--',
    '--', null, null, '[]', '--',
    '[]', '[]', '--', '[]', '[]',
  ]

  expect(bingoCheck(board)?.winner).toBe('[]')
})

test('diagonal 2', () => {
  const board = [
    null, '[]', '[]', '[]', '--',
    '[]', '[]', '--', '--', '--',
    '--', null, '--', null, '--',
    '--', '--', null, '[]', '--',
    '--', '[]', '[]', '[]', '[]',
  ]


  expect(bingoCheck(board)?.winner).toBe('--')
})

test('negative', () => {
  const board = [
    null, '[]', '[]', '[]', '--',
    '[]', '[]', '--', '--', '--',
    '--', null, '[]', null, '--',
    '--', '--', null, '[]', '--',
    '--', '[]', '[]', '[]', '[]',
  ]

  expect(bingoCheck(board)).toBe(null)
})