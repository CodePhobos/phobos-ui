import React, { Component, PropTypes } from 'react';
import onclickoutside from 'react-click-outside';
import cx from 'classnames';
import { Icon } from 'components/ui';
import COLORS from 'constants/colors';
import KEYCODES from 'constants/keycodes';
import SearchbarDropdown from './Dropdown';
import './searchbar.scss';

@onclickoutside
export default class Searchbar extends Component {
  static propTypes = {
    className: PropTypes.string,
    placeholder: PropTypes.string,             // input field placeholder
    onSubmit: PropTypes.func.isRequired,       // submits data object
    nothingFound: PropTypes.string,            // text displayed in nothing found item
    itemsToShow: PropTypes.number,             // maximum amount of items to show in dropdown
    itemHeight: PropTypes.number,              // dropdown item height for Scrollbars
    data: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
    })),
  }

  static defaultProps = {
    placeholder: 'Поиск',
    nothingFound: 'Ничего не найдено',
    itemsToShow: 5,
    itemHeight: 31,
  }

  state = {
    term: '',                      // value for input
    previousTerm: '',              // temporary input value to save previous results
    selected: -1,                  // index of selected item
    filteredData: this.props.data, // data filtered with input term
    showDropdown: false,           // dropdown opened state
    focused: false,
    submitError: false,
  }

  submitErrorTimeout = null

  triggerSubmitError = () => {
    if (this.submitErrorTimeout) {
      clearInterval(this.submitErrorTimeout);
    }

    this.setState({ submitError: true });
    this.submitErrorTimeout = setTimeout(() => this.setState({ submitError: false }), 1000);
  };

  closeDropdown = () => this.setState({ showDropdown: false })
  handleClickOutside = () => this.closeDropdown()

  handleValueChange = ({ value, requireUpdate }) => {
    const newState = { term: value };

    if (requireUpdate) {
      const searchTerm = value.toLowerCase().trim();
      const filteredData = this.props.data
        .filter(item => item.name.toLowerCase().includes(searchTerm));

      newState.filteredData = filteredData;
      newState.previousTerm = value;
      newState.selected = -1;
    }

    this.setState(newState);
  }

  handleInputChange = (event) => this.handleValueChange({
    value: event.target.value,
    requireUpdate: true,
  })

  handleKeyDown = (event) => {
    const { selected, term, previousTerm, filteredData } = this.state;
    const { data, onSubmit } = this.props;

    switch (event.keyCode) {
      case KEYCODES.ARROW_UP: {
        event.preventDefault();
        if (selected > 0) {
          const selectedId = selected - 1;
          const selectedItem = filteredData[selectedId];


          this.setState({
            selected: selectedId,
            term: selectedItem.name,
          });
        }

        break;
      }

      case KEYCODES.ARROW_DOWN: {
        event.preventDefault();
        if (selected < filteredData.length - 1) {
          const selectedId = selected + 1;
          const selectedItem = filteredData[selectedId];

          this.setState({
            selected: selectedId,
            term: selectedItem.name,
          });
        }
        break;
      }

      case KEYCODES.ENTER: {
        event.preventDefault();
        const selectedItem = this.props.data[selected];
        let valueToSubmit = null;

        if (selectedItem) {
          valueToSubmit = selectedItem;
        } else {
          const trimmedTerm = term.trim();
          valueToSubmit = data.find(item => item.name === trimmedTerm);
        }

        if (valueToSubmit) {
          onSubmit(valueToSubmit);
          this.setState({
            term: '',
            previousTerm: '',
            selected: -1,
            showDropdown: false,
            filteredData: this.props.data,
          });
        } else {
          this.triggerSubmitError();
        }

        break;
      }

      case KEYCODES.ESCAPE: {
        event.preventDefault();
        if (selected === -1) {
          this.closeDropdown();
        } else {
          this.setState({
            selected: -1,
            term: previousTerm,
          });
        }

        break;
      }

      default: {
        return null;
      }
    }
  }

  handleSubmit = (item) => {
    this.setState({
      selected: -1,
      term: '',
      previousTerm: '',
      showDropdown: false,
    });

    this.props.onSubmit(item);
  }

  clearField = () => {
    this.setState({
      selected: -1,
      term: '',
      previousTerm: '',
      filteredData: this.props.data,
    });

    this.field.focus();
  }

  handleFocus = () => this.setState({ focused: true, showDropdown: true })
  handleBlur = () => this.setState({ focused: false })

  handleInputClick = () => {
    if (this.state.focused && !this.state.showDropdown) {
      this.setState({ showDropdown: true });
    }
  }

  focusField = () => {
    this.field.focus();
  }

  render() {
    const { filteredData, selected, term, previousTerm, showDropdown, focused, submitError } = this.state;
    const { placeholder, className, nothingFound, itemsToShow, itemHeight } = this.props;
    const searchIconFill = focused ? COLORS.black : COLORS.gray;

    return (
      <div className={cx('searchbar', className)}>
        <div className={cx('searchbar__field', { 'searchbar__field--error': submitError })}>
          <input
            className={cx('searchbar__input', { 'searchbar__input--dropdown-opened': showDropdown })}
            placeholder={placeholder}
            value={term}
            onClick={this.handleInputClick}
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            ref={(node) => { this.field = node; }}
          />

          <span className="searchbar__search" onClick={this.focusField}>
            <Icon glyph="search" size={12} fill={searchIconFill} />
          </span>

          {term.length > 0 && (
            <button className="searchbar__clear" onClick={this.clearField}>
              <Icon glyph="cross" size={10} fill={COLORS.black} />
            </button>
          )}
        </div>


        <SearchbarDropdown
          data={filteredData}
          focusField={this.focusField}
          itemsToShow={itemsToShow}
          nothingFound={nothingFound}
          selected={selected}
          term={previousTerm}
          handleSubmit={this.handleSubmit}
          showDropdown={showDropdown}
          itemHeight={itemHeight}
        />
      </div>
    );
  }
}
