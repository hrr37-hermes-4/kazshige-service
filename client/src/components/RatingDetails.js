import React, { Component } from 'react'
import styled from 'styled-components';
import FormatAlignLeft from '@material-ui/icons/FormatAlignLeft'
import StarRatingComponent from 'react-star-rating-component';

const RatingDetailsContainer = styled.div`
  display: inline-block;
`
const RatingPopup = styled.div`
  display: ${props => props.isOpen ? 'block' : 'none' };
  position: absolute;
  top: 30px;
  padding: 10px 12px;
  left:0;
  border: 5px solid rgb(215, 210, 196);
  border-radius: 5px;
  background: #fff;
  font-size: 12px;
  color: #382110;
  font-family: "Lato", "Helvetica Neue", Helvetica, Arial, sans-serif;
`

const OpenButton = styled.div`
  border: none;
  cursor: pointer;
  margin: 0 10px;

  svg {
    width: .8em;
    height: .8em;
    display: block;
  }
`

const CloseButton = styled.div`
  position: relative;
  float: right;
  width: 19px;
  height: 15px;
  display: block;
  line-height: 0;
  border: 0;
  cursor: pointer;
  color: #382110;
  font-weight: bold;
  font-family: "Lato", "Helvetica Neue", Helvetica, Arial, sans-serif;
`

const BarContainer = styled.div`
  position: relative;
  margin: 3px;
  display: flex;
  align-items: center;
  `

const BarLine = styled.div`
  width: 350px;
  margin: 0 10px;
`
const BarFill = styled.div`
  background-color: #215625;
  width: ${props => props.percent}%;
  height: 18px;
  border-radius: 2px;
`
const FlexColumnReverse = styled.div`
  display: flex;
  flex-direction: column-reverse;
  margin-top: 10px;
`

const SimpleText = styled.div`
  line-height: 24px
  font-size: 12px;
  color: #382110;
  font-weight: bold;
  text-align: left;
  font-family: "Lato", "Helvetica Neue", "Helvetica", sans-serif;
`
class Bar extends Component {
  render(){
    const { ratings, rating, votes, largestVotingNumber, amountOfRatings } = this.props;

    const percent = votes / amountOfRatings * 100;
    const width = votes / largestVotingNumber * 100;
    return (
      <BarContainer>
       <SimpleText><span>{ rating }</span></SimpleText>
       <StarRatingComponent starCount={1} value={1}/>
       <BarLine>
        <BarFill percent={width} />
       </BarLine>
       <SimpleText><span>{ Math.round(percent * 100) / 100 }% </span></SimpleText>
        <SimpleText><span>({ votes })</span></SimpleText>
      </BarContainer>
    )
  }
};

class RatingDetails extends Component {
  state = {
    isOpen: false
  }

  toggle = () => this.setState( s => ({ isOpen: !s.isOpen }))

  render(){
    const { isOpen } = this.state;
    const { ratings, rating, likedBy, reviews, users } = this.props;

    const ratingSummary = !ratings ? null : ratings.reduce((acc, v)=>{
      const upd = {};
      upd[v.rating] = acc[v.rating]+1;
      return {...acc, ...upd}
    }, {1:0, 2:0, 3:0, 4:0, 5:0});
    let total = 0;
    let liked = 0
    let totalLiked = 0

    if(ratingSummary){
       Object.keys(ratingSummary).forEach((val)=>{
      if (val >= 3){
        liked += ratingSummary[val];
      }
      total += ratingSummary[val];
      })
      totalLiked = (liked/total) * 100
      console.log(totalLiked)
    }

    const largestVotingNumber = !ratings ? null : Object.keys(ratingSummary).reduce((acc,v)=>{
      if(ratingSummary[v] > acc) return ratingSummary[v];
      return acc;
    }, 0);

    return (
      <RatingDetailsContainer>
        <OpenButton onClick={this.toggle}><FormatAlignLeft/></OpenButton>
        <RatingPopup isOpen={isOpen}>
          <CloseButton onClick={this.toggle}>x</CloseButton>
          <strong>Rating Details</strong>
          {
            !!ratings && <FlexColumnReverse>{
            Object.keys(ratingSummary).map( rating => {
              return <Bar rating={rating} votes={ratingSummary[rating]} largestVotingNumber={largestVotingNumber} amountOfRatings={ratings.length} />
            })
            }</FlexColumnReverse>
          }
          <div>
            <strong>{likedBy}%</strong> of people liked it
          </div>
          <div>
            <strong>This edition:</strong> {rating} average rating,&nbsp;
            {ratings.length} ratings,&nbsp;
            {reviews.length} reviews,&nbsp;
            {users.length} users
          </div>
        </RatingPopup>
      </RatingDetailsContainer>
    )
  }
};

export default RatingDetails;