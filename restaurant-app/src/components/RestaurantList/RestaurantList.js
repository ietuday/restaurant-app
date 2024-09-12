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
      isModalOpen: false,
      selectedRestaurant: null,
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

  handleEdit = (restaurant) => {
    this.setState({ selectedRestaurant: restaurant, isModalOpen: true });
  };

  handleModalChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      selectedRestaurant: { ...prevState.selectedRestaurant, [name]: value },
    }));
  };

  handleUpdate = (e) => {
    e.preventDefault();
    const { selectedRestaurant, list } = this.state;

    const updatedList = list.map((item) =>
      item.id === selectedRestaurant.id ? selectedRestaurant : item
    );

    fetch(`http://localhost:5000/restaurants/${selectedRestaurant.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedRestaurant),
    })
      .then((response) => response.json())
      .then((updatedRestaurant) => {
        this.setState({
          list: updatedList,
          isModalOpen: false,
          selectedRestaurant: null,
        });
      })
      .catch((error) => console.error('Error updating data:', error));
  };

  closeModal = () => {
    this.setState({ isModalOpen: false, selectedRestaurant: null });
  };

  render() {
    const { searchTerm, sortOption, isLoading, isModalOpen, selectedRestaurant } = this.state;
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
                        <button
                          className={`${styles.restaurantActionBtn} ${styles.editBtn}`}
                          onClick={() => this.handleEdit(item)}
                        >
                          ✏️ Edit
                        </button>
                        <button className={`${styles.restaurantActionBtn} ${styles.deleteBtn}`}>🗑️ Delete</button>
                      </div>
                    </div>
                    <p>
                      <strong>Address:</strong> {item.address}
                    </p>
                    <p>
                      <strong>Rating:</strong> {item.rating} ★
                    </p>
                    <p>
                      <strong>Email:</strong> {item.email}
                    </p>
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

        {isModalOpen && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <button className={styles.closeBtn} onClick={this.closeModal}>
                ×
              </button>
              <h2>Edit Restaurant</h2>
              {selectedRestaurant && (
                <form onSubmit={this.handleUpdate}>
                  <div>
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={selectedRestaurant.name}
                      onChange={this.handleModalChange}
                    />
                  </div>
                  <div>
                    <label>Address:</label>
                    <input
                      type="text"
                      name="address"
                      value={selectedRestaurant.address}
                      onChange={this.handleModalChange}
                    />
                  </div>
                  <div>
                    <label>Rating:</label>
                    <input
                      type="number"
                      name="rating"
                      value={selectedRestaurant.rating}
                      onChange={this.handleModalChange}
                    />
                  </div>
                  <div>
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={selectedRestaurant.email}
                      onChange={this.handleModalChange}
                    />
                  </div>
                  <div className={styles.modalActions}>
                    <button type="submit" className={styles.updateBtn}>
                      Update
                    </button>
                    <button type="button" onClick={this.closeModal} className={styles.cancelBtn}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}
