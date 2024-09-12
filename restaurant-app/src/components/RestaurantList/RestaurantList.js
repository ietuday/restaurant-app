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
      currentPage: 1, // Track current page
      itemsPerPage: 5, // Number of items per page for pagination
      showSearch: false,
      isModalOpen: false,
      selectedRestaurant: null,
      showDeleteConfirm: false,
      restaurantToDelete: null,
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
    this.setState({ searchTerm: e.target.value, currentPage: 1 });
  };

  handleSort = (e) => {
    this.setState({ sortOption: e.target.value, currentPage: 1 });
  };

  // Filter, sort, and paginate the restaurant list
  getFilteredAndSortedList = () => {
    const { list, searchTerm, sortOption, currentPage, itemsPerPage } = this.state;

    // Filter and sort the list
    const filteredList = list
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
      });

    // Paginate the filtered and sorted list
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredList.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Function to handle pagination
  paginate = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  toggleSearch = () => {
    this.setState((prevState) => ({
      showSearch: !prevState.showSearch,
    }));
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

  confirmDelete = (restaurant) => {
    this.setState({ showDeleteConfirm: true, restaurantToDelete: restaurant });
  };

  handleDelete = () => {
    const { restaurantToDelete, list } = this.state;
    fetch(`http://localhost:5000/restaurants/${restaurantToDelete.id}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedList = list.filter((item) => item.id !== restaurantToDelete.id);
        this.setState({
          list: updatedList,
          showDeleteConfirm: false,
          restaurantToDelete: null,
        });
      })
      .catch((error) => console.error('Error deleting data:', error));
  };

  closeDeleteConfirm = () => {
    this.setState({ showDeleteConfirm: false, restaurantToDelete: null });
  };

  render() {
    const {
      searchTerm,
      sortOption,
      isLoading,
      currentPage,
      itemsPerPage,
      isModalOpen,
      selectedRestaurant,
      showDeleteConfirm,
      restaurantToDelete,
    } = this.state;

    const filteredAndSortedList = this.getFilteredAndSortedList();
    const totalRestaurants = this.state.list.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.address.toLowerCase().includes(searchTerm.toLowerCase())
    ).length;
    const totalPages = Math.ceil(totalRestaurants / itemsPerPage);

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
              {filteredAndSortedList.length > 0 ? (
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
                        <button
                          className={`${styles.restaurantActionBtn} ${styles.deleteBtn}`}
                          onClick={() => this.confirmDelete(item)}
                        >
                          🗑️ Delete
                        </button>
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => this.paginate(i + 1)}
                    className={currentPage === i + 1 ? styles.activePage : ''}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Edit Modal */}
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

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className={styles.deleteModal}>
            <div className={styles.modalContent}>
              <p>Are you sure you want to delete {restaurantToDelete?.name}?</p>
              <div className={styles.modalActions}>
                <button onClick={this.handleDelete} className={styles.confirmDeleteBtn}>
                  Yes, Delete
                </button>
                <button onClick={this.closeDeleteConfirm} className={styles.cancelBtn}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
