function SearchBar({ city, setCity, onSearch, loading }) {
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!city.trim() || loading) {
      return;
    }

    onSearch(city.trim());
  };

  return (
    <form
      className="search-form"
      onSubmit={handleSubmit}
      role="search"
    >
      <span className="search-icon" aria-hidden="true">
        ⌕
      </span>

      <label htmlFor="city-search" className="sr-only">
        Enter a city name
      </label>

      <input
        id="city-search"
        type="text"
        placeholder="Search any city..."
        value={city}
        onChange={(event) => setCity(event.target.value)}
        autoComplete="off"
        spellCheck="false"
        disabled={loading}
      />

      <button
        type="submit"
        className="search-button"
        disabled={!city.trim() || loading}
      >
        {loading ? (
          <>
            <span className="button-spinner" />
            Searching
          </>
        ) : (
          <>
            Explore weather
            <span aria-hidden="true"> ↗</span>
          </>
        )}
      </button>
    </form>
  );
}

export default SearchBar;