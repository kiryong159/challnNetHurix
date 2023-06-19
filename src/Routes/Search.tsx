import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { movieSearch, tvSearch } from "../api";
import useWindowDimensions from "../useWidowDimensions";
import { makeImgPath } from "../utils";

interface Iresult {
  backdrop_path: string;
  id: number;
  title: string;
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  release_date: string;
  name: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
interface ISearch {
  page: number;
  results: Iresult[];
}

const Wrapper = styled.div`
  background-color: black;
  overflow-x: hidden;
  height: 100vh;
`;

const Loader = styled.div`
  font-size: 30px;
  margin-top: 100px;
  text-align: center;
`;

const SearchTitle = styled.h1`
  font-size: 68px;
  margin-top: 150px;
  text-align: center;
`;

const MovieSearchSlider = styled.div`
  position: relative;
  top: +100px;
`;

const TvSearchSlider = styled.div`
  position: relative;
  top: +400px;
`;

const SliderName = styled.span`
  font-size: 29px;
  position: relative;
  font-weight: bold;
  top: -25px;
  left: 125px;
`;
const IndexNextButton = styled.button`
  position: absolute;
  top: 100px;
  right: 30px;
  background-color: transparent;
  color: ${(props) => props.theme.white.lighter};
  border: none;
  font-size: 30px;
  z-index: 3;
  cursor: pointer;
`;
const IndexPrevButton = styled.button`
  position: absolute;
  top: 100px;
  left: 30px;
  background-color: transparent;
  color: ${(props) => props.theme.white.lighter};
  border: none;
  font-size: 30px;
  z-index: 3;
  cursor: pointer;
`;
const offset = 6;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);

  height: 200px;
  position: absolute;
  width: 90%;
  left: 0;
  right: 0;
  margin: 0 auto;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  border-radius: 10px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const boxVar = {
  normal: { scale: 1 },
  hover: {
    scale: 1.3,
    y: -50,
    transition: { delay: 0.5, type: "tween" },
  },
};

const BoxName = styled(motion.div)`
  position: absolute;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  width: 100%;
  bottom: -00px;
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  span {
    font-weight: bold;
    text-align: center;
    font-size: 18px;
  }
`;
const boxNameVar = {
  hover: {
    opacity: 1,
    transition: { delay: 0.5, duration: 0.3, type: "tween" },
  },
};

const InfoBigBox = styled(motion.div)<{ ypoint: number }>`
  height: 80vh;
  width: 40vw;
  background-color: ${(props) => props.theme.black.lighter};
  padding: 15px;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: ${(props) => props.ypoint + 150}px;
  left: 30vw;
  border-radius: 10px;
  z-index: 2;
  img {
    border-radius: 10px;
    opacity: 0.7;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.7);
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  opacity: 0;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 40px;
  font-weight: bold;
  position: relative;
  padding: 10px;
  top: -80px;
`;

const BigOVerview = styled.p`
  position: relative;
  padding: 20px;
  top: -60px;
  color: ${(props) => props.theme.white.lighter};
`;

const MoreInfo = styled.div`
  display: flex;
  position: relative;
  top: -40px;
  flex-direction: column;
  margin-left: 15px;
  span {
    font-size: 20px;
    font-weight: bold;
    padding: 10px;
  }
`;

function Search() {
  const history = useHistory();
  const { scrollY } = useScroll();
  const width = useWindowDimensions();
  const location = useLocation();
  const [movingRow, setMovingRow] = useState(false);
  const [indexBack, setIndexBack] = useState(false);
  const movieSearchMatch = useRouteMatch<{ movieId: string }>(
    `/search/movie/:movieId`
  );
  const tvSearchMatch = useRouteMatch<{ tvId: string }>(`/search/tv/:tvId`);

  const keyword = new URLSearchParams(location.search).get("keyword");
  const { data: movieSearchData, isLoading: movieLoading } = useQuery<ISearch>(
    ["MovieSearch", `${keyword}`],
    () => movieSearch(keyword + "")
  );
  const { data: tvSearchData, isLoading: tvLoading } = useQuery<ISearch>(
    ["TvSearch", `${keyword}`],
    () => tvSearch(keyword + "")
  );
  const isLoading = tvLoading && movieLoading;
  const [movieSearchIndex, setMovieSearchIndex] = useState(0);
  const [tvSearchIndex, settvSearchIndex] = useState(0);

  const movieSearchPlusClick = () => {
    if (movieSearchData) {
      if (movingRow) return;
      toggleMovingRow();
      setIndexBack(false);
      const totalMovies = movieSearchData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setMovieSearchIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const movieSearchMinusClick = () => {
    if (movieSearchData) {
      if (movingRow) return;
      toggleMovingRow();
      setIndexBack(true);
      const totalMovies = movieSearchData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setMovieSearchIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const tvSearchPlusClick = () => {
    if (tvSearchData) {
      if (movingRow) return;
      toggleMovingRow();
      setIndexBack(false);
      const totalMovies = tvSearchData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      settvSearchIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const tvSearchMinusClick = () => {
    if (tvSearchData) {
      if (movingRow) return;
      toggleMovingRow();
      setIndexBack(true);
      const totalMovies = tvSearchData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      settvSearchIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const toggleMovingRow = () => {
    setMovingRow((prev) => !prev);
  };

  const rowVar = {
    hidden: {
      x: indexBack ? -width - 5 : width + 5,
    },
    visible: {
      x: 0,
    },
    exit: {
      x: indexBack ? width + 5 : -width - 5,
    },
  };

  const onMovieSearchBoxClicked = (movieId: number) => {
    history.push(`/search/movie/${movieId}?keyword=${keyword}`);
  };

  const onTvSearchBoxClicked = (movieId: number) => {
    history.push(`/search/tv/${movieId}?keyword=${keyword}`);
  };

  const clickedmovieSearch =
    movieSearchMatch?.params.movieId &&
    movieSearchData?.results.find(
      (movie) => movie.id + "" === movieSearchMatch?.params.movieId
    );

  const clickedTvSearch =
    tvSearchMatch?.params.tvId &&
    tvSearchData?.results.find(
      (tv) => tv.id + "" === tvSearchMatch?.params.tvId
    );

  const overlayClick = () => {
    history.push(`/search?keyword=${keyword}`);
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading ... </Loader>
      ) : (
        <>
          <SearchTitle>Search : {keyword}</SearchTitle>
          <MovieSearchSlider>
            <SliderName>
              Search Movie Result (
              {movieSearchData &&
              movieSearchData.results &&
              movieSearchData?.results.length < 6
                ? movieSearchData?.results.length
                : movieSearchData?.results.length
                ? Math.floor(movieSearchData?.results.length / offset) * 6
                : 0}
              )
            </SliderName>
            {movieSearchData && movieSearchData.results.length > 7 ? (
              <>
                <IndexNextButton onClick={movieSearchPlusClick}>
                  <FontAwesomeIcon icon={faAnglesRight} />
                </IndexNextButton>
                <IndexPrevButton onClick={movieSearchMinusClick}>
                  <FontAwesomeIcon icon={faAnglesLeft} />
                </IndexPrevButton>
              </>
            ) : null}

            <AnimatePresence initial={false} onExitComplete={toggleMovingRow}>
              <Row
                custom={indexBack}
                key={movieSearchIndex}
                variants={rowVar}
                initial="hidden"
                animate="visible"
                transition={{ type: "tween", duration: 1 }}
                exit="exit"
              >
                {movieSearchData?.results
                  .slice(
                    offset * movieSearchIndex,
                    offset * movieSearchIndex + offset
                  )
                  .map((Movie) => (
                    <Box
                      key={Movie.id}
                      layoutId={Movie.id + "movieSearch"}
                      variants={boxVar}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      onClick={() => onMovieSearchBoxClicked(Movie.id)}
                      bgphoto={
                        Movie.backdrop_path
                          ? makeImgPath(Movie.backdrop_path, "w300")
                          : Movie.poster_path
                          ? makeImgPath(Movie.poster_path, "w300")
                          : "https://www.shoshinsha-design.com/wp-content/uploads/2020/05/noimage-760x460.png"
                      }
                    >
                      <BoxName variants={boxNameVar}>
                        <span>
                          {Movie.title.length > 20
                            ? `${Movie.title.slice(0, 20)}...`
                            : Movie.title}
                        </span>
                      </BoxName>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </MovieSearchSlider>

          <TvSearchSlider>
            <SliderName>
              Search Tv Result (
              {tvSearchData &&
              tvSearchData.results &&
              tvSearchData?.results.length < 6
                ? tvSearchData?.results.length
                : tvSearchData?.results.length
                ? Math.floor(tvSearchData?.results.length / offset) * 6
                : 0}
              )
            </SliderName>
            {tvSearchData && tvSearchData.results.length > 7 ? (
              <>
                <IndexNextButton onClick={tvSearchPlusClick}>
                  <FontAwesomeIcon icon={faAnglesRight} />
                </IndexNextButton>
                <IndexPrevButton onClick={tvSearchMinusClick}>
                  <FontAwesomeIcon icon={faAnglesLeft} />
                </IndexPrevButton>
              </>
            ) : null}

            <AnimatePresence initial={false} onExitComplete={toggleMovingRow}>
              <Row
                custom={indexBack}
                key={tvSearchIndex}
                variants={rowVar}
                initial="hidden"
                animate="visible"
                transition={{ type: "tween", duration: 1 }}
                exit="exit"
              >
                {tvSearchData?.results
                  .slice(
                    offset * tvSearchIndex,
                    offset * tvSearchIndex + offset
                  )
                  .map((Tv) => (
                    <Box
                      key={Tv.id}
                      layoutId={Tv.id + "tvSearch"}
                      variants={boxVar}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      onClick={() => onTvSearchBoxClicked(Tv.id)}
                      bgphoto={
                        Tv.backdrop_path
                          ? makeImgPath(Tv.backdrop_path, "w300")
                          : Tv.poster_path
                          ? makeImgPath(Tv.poster_path, "w300")
                          : "https://www.shoshinsha-design.com/wp-content/uploads/2020/05/noimage-760x460.png"
                      }
                    >
                      <BoxName variants={boxNameVar}>
                        <span>
                          {Tv.name.length > 20
                            ? `${Tv.name.slice(0, 20)}...`
                            : Tv.name}
                        </span>
                      </BoxName>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </TvSearchSlider>

          <AnimatePresence>
            {movieSearchMatch ? (
              <>
                <Overlay
                  onClick={overlayClick}
                  animate={{ opacity: 1, transition: { duration: 0.5 } }}
                  exit={{ opacity: 0, transition: { duration: 0.5 } }}
                />
                <InfoBigBox
                  ypoint={scrollY.get()}
                  layoutId={movieSearchMatch.params.movieId + "movieSearch"}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                >
                  {clickedmovieSearch ? (
                    <>
                      <img
                        style={{ height: "360px" }}
                        src={
                          clickedmovieSearch.backdrop_path
                            ? makeImgPath(
                                clickedmovieSearch.backdrop_path,
                                "w300"
                              )
                            : clickedmovieSearch.poster_path
                            ? makeImgPath(
                                clickedmovieSearch.poster_path,
                                "w300"
                              )
                            : "https://www.shoshinsha-design.com/wp-content/uploads/2020/05/noimage-760x460.png"
                        }
                        alt=""
                      />
                      <BigTitle>
                        {clickedmovieSearch.title.length < 25
                          ? clickedmovieSearch.title
                          : clickedmovieSearch.title.slice(0, 25) + "..."}
                      </BigTitle>
                      <BigOVerview>{clickedmovieSearch.overview}</BigOVerview>
                      <MoreInfo>
                        <span>
                          ⭐ : {clickedmovieSearch.vote_average} (
                          {clickedmovieSearch.vote_count})
                        </span>
                        <span>
                          Popularity :
                          {Math.floor(clickedmovieSearch.popularity)}
                        </span>
                        <span>
                          Release Date : {clickedmovieSearch.release_date}
                        </span>
                      </MoreInfo>
                    </>
                  ) : null}
                </InfoBigBox>
              </>
            ) : tvSearchMatch ? (
              <>
                <Overlay
                  onClick={overlayClick}
                  animate={{ opacity: 1, transition: { duration: 0.5 } }}
                  exit={{ opacity: 0, transition: { duration: 0.5 } }}
                />
                <InfoBigBox
                  ypoint={scrollY.get()}
                  layoutId={tvSearchMatch.params.tvId + "tvSearch"}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                >
                  {clickedTvSearch ? (
                    <>
                      <img
                        style={{ height: "360px" }}
                        src={
                          clickedTvSearch.backdrop_path
                            ? makeImgPath(clickedTvSearch.backdrop_path, "w300")
                            : clickedTvSearch.poster_path
                            ? makeImgPath(clickedTvSearch.poster_path, "w300")
                            : "https://www.shoshinsha-design.com/wp-content/uploads/2020/05/noimage-760x460.png"
                        }
                        alt=""
                      />
                      <BigTitle>
                        {clickedTvSearch.name.length < 25
                          ? clickedTvSearch.name
                          : clickedTvSearch.name.slice(0, 25) + "..."}
                      </BigTitle>
                      <BigOVerview>{clickedTvSearch.overview}</BigOVerview>
                      <MoreInfo>
                        <span>
                          ⭐ : {clickedTvSearch.vote_average} (
                          {clickedTvSearch.vote_count})
                        </span>
                        <span>
                          Popularity :{Math.floor(clickedTvSearch.popularity)}
                        </span>
                        <span>
                          First Air Date : {clickedTvSearch.first_air_date}
                        </span>
                      </MoreInfo>
                    </>
                  ) : null}
                </InfoBigBox>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Search;
