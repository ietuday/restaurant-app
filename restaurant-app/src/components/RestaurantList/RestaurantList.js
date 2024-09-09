import React, { Component } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import styles from './RestaurantList.module.css';

export default class RestaurantList extends Component {
  constructor() {
    super();
    this.state = {
      list: [],
      searchTerm: '',
      sortOption: 'name',
      isLoading: true,
      visibleItems: 10,
      showSearch: false,
    };
  }

  componentDidMount() {
    this.fetchRestaurants();
  }

  fetchRestaurants = () => {
    fetch('http://localhost:5000/restaurants')
      .then((response) => response.json())
      .then((result) => {
        this.setState({ list: result, isLoading: false });
      })
      .catch((error) => console.error('Error fetching data:', error));
  };

  handleSearch = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleSort = (e) => {
    this.setState({ sortOption: e.target.value });
  };

  handleLoadMore = () => {
    this.setState((prevState) => ({
      visibleItems: prevState.visibleItems + 10,
    }));
  };

  toggleSearch = () => {
    this.setState((prevState) => ({
      showSearch: !prevState.showSearch,
    }));
  };

  getFilteredAndSortedList = () => {
    const { list, searchTerm, sortOption, visibleItems } = this.state;

    return list
      .filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.address.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOption === 'name') {
          return a.name.localeCompare(b.name);
        } else if (sortOption === 'rating') {
          return b.rating - a.rating;
        }
        return 0;
      })
      .slice(0, visibleItems);
  };

  render() {
    const { searchTerm, sortOption, isLoading, showSearch } = this.state;
    const filteredAndSortedList = this.getFilteredAndSortedList();
    const hasResults = filteredAndSortedList.length > 0;

    return (
      <div className={styles.restaurantList}>
        <h1>Restaurant List</h1>
        <div className={styles.controls}>
          <div className={styles.searchBar}>
            <button className={styles.searchIcon} onClick={this.toggleSearch}>
              <FaSearch />
            </button>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={this.handleSearch}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.filterContainer}>
            <FaFilter className={styles.filterIcon} />
            <select className={styles.sortSelect} value={sortOption} onChange={this.handleSort}>
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </div>
        {isLoading ? (
          <div className={styles.spinner}>Loading...</div>
        ) : (
          <div>
            <div className={styles.restaurantContainer}>
              {hasResults ? (
                filteredAndSortedList.map((item, i) => (
                  <div className={styles.restaurantCard} key={i}>
                    <div className={styles.restaurantHeader}>
                      <h2>{item.name}</h2>
                      <div className={styles.restaurantActions}>
                        <button className={`${styles.restaurantActionBtn} ${styles.editBtn}`}>✏️ Edit</button>
                        <button className={`${styles.restaurantActionBtn} ${styles.deleteBtn}`}>🗑️ Delete</button>
                      </div>
                    </div>
                    <p><strong>Address:</strong> {item.address}</p>
                    <p><strong>Rating:</strong> {item.rating} ★</p>
                    <p><strong>Email:</strong> {item.email}</p>
                  </div>
                ))
              ) : (
                <div className={styles.noResults}>No results found</div>
              )}
            </div>
            {hasResults && filteredAndSortedList.length < this.state.list.length && (
              <button className={styles.loadMoreBtn} onClick={this.handleLoadMore}>
                Load More
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

}
