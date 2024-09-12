import React, { Component } from 'react';
import styles from './Home.module.css';
import { Link } from 'react-router-dom';

export default class Home extends Component {
  render() {
    return (
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Welcome to Restaurant Explorer</h1>
            <p>Your gateway to discovering the best restaurants around you.</p>
            <Link to="/list">
              <button className={styles.exploreButton}>Explore Now</button>
            </Link>
          </div>
        </section>

        <section className={styles.features}>
          <h2>Our Features</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureItem}>
              <img src='img/f1.jpeg' alt="Feature 1" className={styles.featureImage} />
              <p>Find your favorite restaurants easily.</p>
            </div>
            <div className={styles.featureItem}>
              <img src='img/f2.jpg' alt="Feature 2" className={styles.featureImage} />
              <p>Rate and review places you visit.</p>
            </div>
            <div className={styles.featureItem}>
              <img src='img/f3.jpg' alt="Feature 3" className={styles.featureImage} />
              <p>Get personalized recommendations.</p>
            </div>
          </div>
        </section>

        <section className={styles.about}>
          <h2>About Us</h2>
          <p>
            Restaurant Explorer is your one-stop solution to finding the best dining spots in town. 
            We provide you with accurate information, reviews, and ratings to help you make the best choice.
          </p>
        </section>

        <footer className={styles.footer}>
          <p>&copy; 2024 Restaurant Explorer. All rights reserved.</p>
          <p>
            <a href="/contact" className={styles.footerLink}>Contact Us</a> | 
            <a href="/privacy" className={styles.footerLink}>Privacy Policy</a>
          </p>
        </footer>
      </div>
    );
  }
}
