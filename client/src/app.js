import React from "react";
import axios from "axios";
import config from "./config.js";
import { Title, Description, Author, Image } from "./components/BookInfo.js";
import { Container, LeftGrid, RightGrid, Wrapper } from './components/Container';
import Ratings, { RatingsLine, Center, RatingText, RatingContainer } from './components/Ratings';
import RatingDetails from './components/RatingDetails';
import { DropDown, RightButton, Options, Option, AddShelf } from './components/ReadStatus';
import DoneIcon from '@material-ui/icons/Done';
import StarRatingComponent from 'react-star-rating-component';

const Dot = () => <span style={{margin:'0 5px'}}>·</span>

export default class App extends React.Component{
  state = {
    bookInfo: null,
    options: [{
      selected: false,
      text: 'Want to Read'
    }, {
      selected: true,
      text: 'Read'
    }, {
      selected: false,
      text: 'Currently Reading'
    }],
    rating: 0
  }
  componentDidMount(){
    const bookId = this.props.match.params.id
    this.fetchData(`books/${bookId}/info`, "bookInfo")
    this.fetchData(`books/${bookId}/image`, "bookImage")
    this.fetchData(`books/${bookId}/users`, "users")
    this.fetchData(`books/${bookId}/ratings`, "ratings")
    this.fetchData(`books/${bookId}/reviews`, "reviews")
    this.fetchData(`books/${bookId}/readstatus`, "readstatus")
  }

  fetchData = (url, state) => {
    axios.get(`${config.backendUrl}/${url}`)
      .then((response)=> {
        console.log(response.data)
        this.setState({
          [state]: response.data
        })
      })
  }

  handleClick = () => {
    window.location.href = `${config.backendUrl}/books/2`
  }

  toggleOption = (optionText) => {
    const statusArr = [];

    this.state.options.forEach(option => {
      option.selected = option.text === optionText;
      statusArr.push(option);
    });

    this.setState({ options: statusArr });
  }

  addShelf = () => {
    const { shelf } = this.state;

    // Adds shelf
    shelf;
  }

  toggleMenu = () => {
    this.setState({
      statusOpened: !this.state.statusOpened
    });
  }

  updateShelfInput = (event) => {
    this.setState({
      shelf: event.target.value
    });
  }

  getAverageRating = (ratings) => {
    return (ratings && ratings.reduce(
      (sum, currentRating) => sum + currentRating.rating
    , 0) / ratings.length) || 5;
  }

  likedBy = (ratings) => {
    return (ratings && ratings.reduce(
      (sum, currentRating) => sum + (currentRating.rating >= 3 ? 1 : 0)
    , 0) / ratings.length * 100) || 0;
  }

  shortText = (text, len) => {
    return text.length <= len
      ? text
      : text.substr(0, len - 2) + '...';
  }

  onStarClick = (nextValue, prevValue, name) => {
    this.setState({rating: nextValue});
  }

  render(){
    const { bookInfo, bookImage, rating, ratings, reviews, statusOpened, options, users } = this.state;

    const selectedOption = options.find(option => option.selected);

    const averageRating = this.getAverageRating(ratings);
    const likedBy = this.likedBy(ratings);

    return (
      <Container>
        <LeftGrid>
          { bookImage && <Image src={bookImage.image}/> }
          <Wrapper>
            <DropDown>
              <div style={{color:'#63ce92'}}><DoneIcon/></div>
              <span title="Read">{this.shortText(selectedOption.text, 12)}</span>
              </DropDown>
              <RightButton onClick={this.toggleMenu} className={statusOpened ? 'show-menu' : ''}>
                <Options>
                  {options.filter(option => !option.selected).map(option => (
                    <Option onClick={this.toggleOption.bind(this, option.text)}>
                      {option.text}
                    </Option>
                  ))}
                  <AddShelf>
                    <div>Add shelf</div>
                    <input type="text" onChange={this.updateShelfInput} />
                    <button onClick={this.addShelf}>Add</button>
                  </AddShelf>
                </Options>
              </RightButton>
          </Wrapper>
          <RatingText>Rate this book</RatingText>
          <Center>
            <StarRatingComponent
              starCount={5}
              value={Math.round(rating)}
              onStarClick={this.onStarClick}
            />
          </Center>
        </LeftGrid>
        <RightGrid>
          <Title>
          { bookInfo && bookInfo.title  }
          </Title>
          <Author> by
          { bookInfo && bookInfo.author }
          </Author>
          <RatingsLine>
            <Ratings rating={averageRating}/>
            <Dot />
            <RatingContainer><RatingDetails ratings={ratings || []} likedBy={likedBy} rating={averageRating} reviews={reviews || []} users={users || []} /> rating details </RatingContainer>
            <Dot />
            { ratings && <span>{ratings.length} ratings</span> }
            <Dot />
            { reviews && <span>{reviews.length} reviews</span> }
          </RatingsLine>
          <Description>
          { bookInfo && bookInfo.description }
          </Description>
        </RightGrid>
      </Container>
    );
  }
};