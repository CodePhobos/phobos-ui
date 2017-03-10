import React, { PropTypes } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import cx from 'classnames';
import SearchbarItem from './SearchbarItem';

export default function SearchbarDropdown(props) {
  const scrollbarsHeight = props.itemsToShow * props.itemHeight;
  let dropdownContent = <div className="searchbar__nothing" onClick={props.focusField}>{props.nothingFound}</div>;

  if (props.data.length > 0) {
    const dropdownItems = props.data.map((item, index) => (
      <SearchbarItem
        key={`item-${index}`}
        selected={props.selected === index}
        onClick={props.handleSubmit}
        term={props.term}
        value={item}
        height={props.itemHeight}
      />
    ));

    if (dropdownItems.length >= props.itemsToShow) {
      dropdownContent = (
        <Scrollbars
          style={{ height: scrollbarsHeight }}
        >
          {dropdownItems}
        </Scrollbars>
      );
    } else {
      dropdownContent = dropdownItems;
    }
  }

  return (
    <div className={cx('searchbar__dropdown', { 'searchbar__dropdown--opened': props.showDropdown })}>
      {dropdownContent}
    </div>
  );
}

SearchbarDropdown.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })).isRequired,
  showDropdown: PropTypes.bool.isRequired,
  itemsToShow: PropTypes.number.isRequired,
  focusField: PropTypes.func.isRequired,
  nothingFound: PropTypes.string.isRequired,
  itemHeight: PropTypes.number.isRequired,
};
