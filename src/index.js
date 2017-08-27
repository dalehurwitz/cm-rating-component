import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Rating, { AverageRating } from './Rating';

class App extends Component {
  onChange = (rating) => {
    console.log(`Rating changed to ${rating} ${rating > 1 ? 'stars' : 'star'}`)
  }

  onSubmit = (rating) => {
    console.log(`${rating} ${rating > 1 ? 'stars' : 'star'} selected`)
  }

  customRenderer () {
    return <span className='rating-heart'>❤</span>
  }

  render () {
    return (
      <div>
        <div>
          <div className='demo-block'>
            <h3>Default</h3>
            <Rating onChange={this.onChange} onSubmit={this.onSubmit} />
          </div>
          <div className='demo-block'>
            <h3>Custom number of stars</h3>
            <Rating onChange={this.onChange} onSubmit={this.onSubmit} max={8} />
          </div>
          <div className='demo-block'>
            <h3>Pre-selected rating</h3>
            <Rating onChange={this.onChange} onSubmit={this.onSubmit} selected={4} />
          </div>
          <div className='demo-block'>
            <h3>Custom renderer</h3>
            <Rating onChange={this.onChange} onSubmit={this.onSubmit} renderer={this.customRenderer} />
          </div>
        </div>
        <div>
          <div className='demo-block'>
            <h3>Default Average Rating</h3>
            <AverageRating rating={3} />
          </div>
          <div className='demo-block'>
            <h3>Average Rating with custom renderer</h3>
            <AverageRating rating={3} renderer={this.customRenderer} />
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
