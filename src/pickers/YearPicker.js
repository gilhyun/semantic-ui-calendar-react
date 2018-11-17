import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

import YearView from '../views/YearView';
import { getUnhandledProps } from '../lib';
import BasePicker from './BasePicker';

const PAGE_WITH = 3;
const PAGE_HEIGHT = 4;
const YEARS_ON_PAGE = PAGE_WITH * PAGE_HEIGHT;

class YearPicker extends BasePicker {
  /*
    Note:
      use it like this <YearPicker key={someInputValue} />
      to make react create new instance when input value changes
  */
  constructor(props) {
    super(props);
    this.state = {
      /* moment instance */
      date: props.initializeWith.clone(),
    };
  }

  buildYears() {
    /*
      Return array of years (strings) like ['2012', '2013', ...]
      that used to populate calendar's page.
    */
    const years = [];
    const date = this.state.date;
    const padd = date.year() % YEARS_ON_PAGE;
    const first = date.year() - padd;
    for (let i = 0; i < YEARS_ON_PAGE; i++) {
      years[i] = (first + i).toString();
    }
    return years;
  }

  getInitialDatePosition = () => {
    return this.buildYears().indexOf(this.state.date.year().toString());
  }

  getActiveCellPosition() {
    /*
      Return position of a year that should be displayed as active
      (position in array returned by `this.buildYears`).
    */
    if (!_.isNil(this.props.value)) {
      const years = this.buildYears();
      const yearIndex = years.indexOf(this.props.value.year().toString());
      if (yearIndex >= 0) {
        return yearIndex;
      }
    }
  }

  getFirstActiveCellOnPage = () => {
    const activeOnly = _.filter(
      _.range(0, YEARS_ON_PAGE),
      y => !_.includes(this.getDisabledYearsPositions(), y),
    );
    return activeOnly[0];
  }

  getLastActiveCellOnPage = () => {
    const activeOnly = _.filter(
      _.range(0, YEARS_ON_PAGE),
      y => !_.includes(this.getDisabledYearsPositions(), y),
    );
    return activeOnly[activeOnly.length - 1];
  }

  // core
  shouldSwitchPage = () => {
    // case <- or ->
    //   next < start => -1
    //   next > start => 1
    //   0
    // case up or down
    //   next - width < start => -1
    //   next + width > end => 1
    //   0
  }

  // core
  getNextHoveredCellPosition = (key, curPos, width) => {
    // skips disabled cells
  }

  getDisabledYearsPositions() {
    /*
      Return position numbers of years that should be displayed as disabled
      (position in array returned by `this.buildYears`).
    */
    let disabled = [];
    const years = this.buildYears();
    if (_.isArray(this.props.enable)) {
      const enabledYears = this.props.enable.map(yearMoment => yearMoment.year().toString());
      disabled = _.concat(
        disabled,
        years
          .filter(year => !_.includes(enabledYears, year))
          .map(year => years.indexOf(year))
      );
    }
    if (_.isArray(this.props.disable)) {
      disabled = _.concat(
        disabled,
        this.props.disable
          .filter(yearMoment => _.includes(years, yearMoment.year().toString()))
          .map(yearMoment => years.indexOf(yearMoment.year().toString()))
      );
    }
    if (!_.isNil(this.props.maxDate)) {
      if (parseInt(_.first(years)) > this.props.maxDate.year()) {
        disabled = _.range(0, years.length);
      } else if (_.includes(years, this.props.maxDate.year().toString())) {
        disabled = _.concat(
          disabled,
          _.range(years.indexOf(this.props.maxDate.year().toString()) + 1, years.length)
        );
      }
    }
    if (!_.isNil(this.props.minDate)) {
      if (parseInt(_.last(years)) < this.props.minDate.year()) {
        disabled = _.range(0, years.length);
      } else if (_.includes(years, this.props.minDate.year().toString())) {
        disabled = _.concat(
          disabled,
          _.range(0, years.indexOf(this.props.minDate.year().toString()))
        );
      }
    }
    if (disabled.length > 0) {
      return _.uniq(disabled);
    }
  }

  isNextPageAvailable() {
    const {
      maxDate,
      enable,
    } = this.props;
    const lastOnPage = parseInt(_.last(this.buildYears()));

    if (_.isArray(enable)) {
      return _.some(enable, enabledYear => enabledYear.year() > lastOnPage);
    }
    if (_.isNil(maxDate)) return true;
    return lastOnPage < maxDate.year();
  }

  isPrevPageAvailable() {
    const {
      minDate,
      enable,
    } = this.props;
    const firstOnPage = parseInt(_.first(this.buildYears()));

    if (_.isArray(enable)) {
      return _.some(enable, enabledYear => enabledYear.year() < firstOnPage);
    }
    if (_.isNil(minDate)) return true;
    return firstOnPage > minDate.year();
  }

  handleChange = (e, { value }) => {
    const year = parseInt(value);
    _.invoke(this.props, 'onChange', e, { ...this.props, value: { year } });
  }

  switchToNextPage = () => {
    this.setState(({ date }) => {
      const nextDate = date.clone();
      nextDate.add(YEARS_ON_PAGE, 'year');
      return { date: nextDate };
    });
  }

  switchToPrevPage = () => {
    this.setState(({ date }) => {
      const prevDate = date.clone();
      prevDate.subtract(YEARS_ON_PAGE, 'year');
      return { date: prevDate };
    });
  }

  render() {
    const rest = getUnhandledProps(YearPicker, this.props);
    return (
      <YearView
        { ...rest }
        years={this.buildYears()}
        onNextPageBtnClick={this.switchToNextPage}
        onPrevPageBtnClick={this.switchToPrevPage}
        onYearClick={this.handleChange}
        hovered={this.state.hoveredCellPosition}
        onCellHover={this.onHoveredCellPositionChange}
        hasPrevPage={this.isPrevPageAvailable()}
        hasNextPage={this.isNextPageAvailable()}
        disabled={this.getDisabledYearsPositions()}
        active={this.getActiveCellPosition()} />
    );
  }
}

YearPicker.propTypes = {
  /** Called after year is selected. */
  onChange: PropTypes.func.isRequired,
  /** A value for initializing year picker's state. */
  initializeWith: PropTypes.instanceOf(moment).isRequired,
  /** Currently selected year. */
  value: PropTypes.instanceOf(moment),
  /** Array of disabled years. */
  disable: PropTypes.arrayOf(
    PropTypes.instanceOf(moment)
  ),
  /** Array of enabled years. */
  enable: PropTypes.arrayOf(
    PropTypes.instanceOf(moment)
  ),
  /** Minimal year that could be selected. */
  minDate: PropTypes.instanceOf(moment),
  /** Maximal year that could be selected. */
  maxDate: PropTypes.instanceOf(moment),
};

export default YearPicker;
