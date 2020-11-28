import { capitalize } from '../string'

test('Capitalize the first letter of a string', () => {
  expect(capitalize('foo')).toEqual('Foo')
  expect(capitalize('foo bar')).toEqual('Foo bar')
  expect(capitalize('Foo')).toEqual('Foo')
  expect(capitalize('foo bar')).not.toEqual('Foo Bar')
  expect(capitalize('foo bar baz')).not.toEqual('Foo Bar Baz')
})
