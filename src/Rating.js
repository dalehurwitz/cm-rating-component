import React, { Component } from 'react'

const StarIcon = ({ filled }) => (
  <svg className='rating__star' version='1.2' baseProfile='tiny' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'>
    <path className={filled ? 'rating__star__fill--filled' : 'rating__star__fill'} strokeMiterlimit='10' d='M15 2.4l4.1 8.3 9.2 1.3-6.7 6.5 1.6 9.1-8.2-4.3-8.2 4.3 1.6-9.1L1.7 12l9.2-1.3z'/>
  </svg>
)

const getStar = (selected) => <StarIcon filled={selected} />

// Generates a single radio input & label to be used as a rating selector.
// Is a regular function rather than a stateless component in order
// to be able to return an array of adjacent elements (this is actually
// supported in components in React 16). You can just as easily take an
// approach to return a component, but I preferred to go for a more CSS-first
// approach.
const Star = (value, selected, onChange, ref = '', renderer) => {
  const id = `star${value}_${ref}`
  const title = `${value} ${value > 1 ? 'stars' : 'star'}`
  const isSelected = value === selected
  const renderedStar = renderer(isSelected, value)

  if (!React.isValidElement(renderedStar)) {
    throw new Error('You must return a valid React element from the renderer.')
  }

  return [
    <input
      className='rating__input'
      type='radio'
      name='rating'
      key={`i_${ref}`}
      id={id}
      value={value}
      title={title}
      checked={isSelected}
      onChange={onChange} />,
    <label className='rating__label' key={`l_${ref}`} htmlFor={id}>
      {renderer(isSelected, value)}
    </label>
  ]
}

/**
 * The main Rating component
 * @type {Function} onSubmit     callback for when rating is submitted
 * @type {Function} onChange     callback for when rating value is changed
 * @type {Function} renderer     returns a react element to be rendered as a rating 'star'
 * @type {Number}   selected     default rating selected
 * @type {Number}   max          max rating
 */
class Rating extends Component {
  static defaultProps = {
    onSubmit: function () {},
    onChange: function () {},
    renderer: getStar,
    selected: null,
    max: 5
  }

  state = {
    submitted: false,
    ref: Math.random().toString(36).substr(2, 9), // unique ref for input/label relationship
    selected: this.props.selected,
    max: this.props.max > 10 ? 10 : this.props.max // ensure max does not exceed 10
  }

  onChange = (e) => {
    const { value } = e.target

    this.setState({
      selected: Number(value)
    })

    // Support onChange as a prop for various use cases, i.e
    // update redux state or warn useragainst unfair ratings if
    // they select one star, etc
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(value)
    }
  }

  onSubmit = (e) => {
    e.preventDefault()

    if (this.state.selected === null) return

    this.setState({
      submitted: true
    })

    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit(this.state.selected)
    }
  }

  renderStars () {
    let stars = []
    let i = this.state.max
    while (i > 0) {
      stars[stars.length] = Star(i--, this.state.selected, this.onChange, this.state.ref, this.props.renderer)
    }
    return stars
  }

  render () {
    const { submitted } = this.state
    const formClass = ['rating__form', submitted ? 'rating__form--disabled' : ''].join(' ').trim()
    return (
      <div className='rating'>
        {submitted &&
          <div className='rating__success' role='alert'>Thanks for your rating!</div>
        }
        <form className={formClass} onSubmit={this.onSubmit}>
          <div className='rating__heading'>Rate this product</div>
          <fieldset className='rating__fieldset' disabled={submitted}>
            <div className='rating__stars'>
              {this.renderStars()}
            </div>
            <div>
              <button className='rating__submit' type='submit'>Apply</button>
            </div>
          </fieldset>
        </form>
      </div>
    )
  }
}

const StarStatic = (value, selected, ref, renderer) => {
  const isSelected = value === selected
  const className = ['rating__static-star', isSelected ? 'rating__static-star--selected' : ''].join(' ').trim()
  const renderedStar = renderer(isSelected, value)

  if (!React.isValidElement(renderedStar)) {
    throw new Error('You must return a valid React element from the renderer.')
  }

  return (
    <span className={className} aria-hidden='true' key={`${value}_${ref}`}>{renderedStar}</span>
  )
}

class AverageRating extends Component {
  static defaultProps = {
    rating: null,
    max: 5,
    renderer: getStar
  }

  state = {
    ref: Math.random().toString(36).substr(2, 9)
  }

  renderStars () {
    const { rating, max } = this.props
    const roundedRating = typeof rating === 'number' ? Math.round(rating) : 0
    const title = `${roundedRating} out of ${max} stars`
    let stars = []
    let i = max
    while (i > 0) {
      stars[stars.length] = StarStatic(i--, roundedRating, this.state.ref, this.props.renderer)
    }
    return (
      <div className='rating__stars rating__stars--inline' title={title}>
          {stars}
      </div>
    )
  }

  render () {
    return (
      <div className='rating__average'>
        <span>Average rating</span>
        {this.renderStars()}
      </div>
    )
  }
}

export default Rating
export { AverageRating }
