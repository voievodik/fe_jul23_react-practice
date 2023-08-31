import React, { useState } from 'react';
import cn from 'classnames';

import './App.scss';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const FEMALE_LETTER = 'f';
const MALE_LETTER = 'm';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer
    .find(({ id }) => id === product.categoryId);
  const user = usersFromServer.find(({ id }) => category.ownerId === id);

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedUser, setSelectedUser] = useState('all');
  const [query, setQuery] = useState('');

  const visibleProducts = filteredProducts
    .filter(({ name }) => name.toLowerCase()
      .includes(query.toLowerCase()));

  function filteredByOwner(name) {
    setSelectedUser(name);
    setFilteredProducts(products.filter(({ user }) => user.name === name));
  }

  function resetAllFilters() {
    setFilteredProducts(products);
    setSelectedUser('all');
    setQuery('');
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({
                  'is-active': selectedUser === 'all',
                })}
                onClick={() => {
                  setSelectedUser('all');
                  setFilteredProducts(products);
                }}
              >
                All
              </a>

              {usersFromServer.map((user) => {
                const { name, id } = user;

                return (
                  <a
                    key={id}
                    data-cy="FilterUser"
                    href="#/"
                    className={cn({
                      'is-active': selectedUser === name,
                    })}
                    onClick={() => filteredByOwner(name)}
                  >
                    {name}
                  </a>
                );
              })}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button mr-6 outlined is-success"
              >
                All
              </a>

              {categoriesFromServer.map((category) => {
                const { title } = category;

                return (
                  <a
                    data-cy="Category"
                    href="#/"
                    className="button mr-2 my-1 is-info"
                  >
                    {title}
                  </a>
                );
              })}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetAllFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!visibleProducts.length ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map((product) => {
                  const { id, name, user, category } = product;

                  return (
                    <tr data-cy="Product">
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {id}
                      </td>

                      <td data-cy="ProductName">{name}</td>
                      <td data-cy="ProductCategory">
                        {`${category.icon} -
                        ${category.title}`}
                      </td>

                      <td
                        data-cy="ProductUser"
                        className={cn({
                          'has-text-link': user.sex === MALE_LETTER,
                          'has-text-danger': user.sex === FEMALE_LETTER,
                        })}
                      >
                        {user.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
