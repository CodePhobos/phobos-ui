import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Searchbar from './Searchbar';

const mockdata = Object.freeze([
  { name: 'hello' },
  { name: 'hello there' },
  { name: 'hi' },
  { name: 'hi there' },
  { name: 'hello, world' },
]);

const lotsOfMockData = [];
for (let i = 0; i < 10; i++) {
  for (let j = 0, l = mockdata.length; j < l; j++) {
    lotsOfMockData.push({ name: `${mockdata[j].name}-${i}-${j}` });
  }
}


storiesOf('Searchbar', module)
  .add('Wihout scrollbars', () => (
    <div style={{ padding: '2rem', width: '40rem' }}>
      <Searchbar
        data={mockdata}
        onSubmit={f => f}
      />
    </div>
  ))

  .add('Scrollbars', () => (
    <div style={{ padding: '2rem', width: '40rem' }}>
      <Searchbar
        data={lotsOfMockData}
        onSubmit={f => f}
      />
    </div>
  ))

  .add('No data', () => (
    <div style={{ padding: '2rem', width: '40rem' }}>
      <Searchbar
        data={[]}
        onSubmit={f => f}
        nothingFound="Мы ничего не нашли"
      />
    </div>
  ))

  .add('Custom results message', () => (
    <div style={{ padding: '2rem', width: '40rem' }}>
      <Searchbar
        data={[]}
        onSubmit={f => f}
        nothingFound="Custom results message"
      />
    </div>
  ));
