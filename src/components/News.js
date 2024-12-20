import React, { useEffect, useState } from "react";

import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  // const { country, category, pageSize, setProgress } = props;

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  
  const capitalizeFirstLetter = (val) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  };
  
  const fetchMoreData = async () => {
    try {
      const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${
        page + 1
      }&pageSize=${props.pageSize}`;
      setPage(page + 1);
      const data = await fetch(url);
      const parsedData = await data.json();
      
      if (parsedData.articles) {
        setArticles(articles.concat(parsedData.articles));
        setTotalResults(parsedData.totalResults);
      } else {
        console.error("Error fetching more articles:", parsedData);
      }
    } catch (error) {
      console.error("Error in fetchMoreData:", error);
    }
  };
  
  
  const updateNews = async () => {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(70);
    // console.log(parsedData);
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    
    props.setProgress(100);
  };
  
  useEffect(() => {
    updateNews();
    document.title = `${capitalizeFirstLetter(props.category)} - InsightNews`;
  }, []);

  return (
    <>
      <h1
        className="text-center"
        style={{ margin: "30px 0", marginTop: "90px" }}
      >
        Insight News - Top {capitalizeFirstLetter(props.category)}
       {''} Headlines
      </h1>
      {loading && <Spinner />}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles && articles.map((element) => {
              return (
                <div className="col-md-4">
                  <NewsItem
                    key={element.urlToImage}
                    title={element.title ? element.title.slice(0, 30) : ""}
                    description={
                      element.description
                        ? element.description.slice(0, 70)
                        : ""
                    }
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              );
            })}
            ;
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

News.defaultProps = {
  country: "us",
  pageSize: 6,
  category: "general",
};
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};
export default News;
