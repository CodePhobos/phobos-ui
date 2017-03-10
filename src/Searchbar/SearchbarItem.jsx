import React, { PropTypes } from 'react';
import cx from 'classnames';
import { Highlight } from 'components/ui';
import capitalize from 'lib/capitalize';

export default function SearchbarItem({ value, term, onClick, selected, height, ...others }) {
  return (
    <div
      className={cx('searchbar__item', { 'searchbar__item--selected': selected })}
      style={{ maxHeight: height }}
      onClick={() => onClick(value)} {...others}
    >
      <Highlight value={capitalize(value.name)} highlight={term} />
    </div>
  );
}

SearchbarItem.propTypes = {
  value: PropTypes.shape({ name: PropTypes.string.isRequired }),
  term: PropTypes.string.isRequired, // search term for highlight purposes
  selected: PropTypes.bool.isRequired, // shows if item is selected with keyboard arrows
  height: PropTypes.number.isRequired, // max item height
  onClick: PropTypes.func.isRequired,
};
