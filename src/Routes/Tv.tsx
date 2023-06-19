import { useQuery } from "@tanstack/react-query";
import {
  airTodayTvfetch,
  popularTvfetch,
  topTvfetch,
  trandTvfetch,
} from "../api";
import styled from "styled-components";
import { makeImgPath } from "../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useHistory, useRouteMatch } from "react-router-dom";
import useWindowDimensions from "../useWidowDimensions";

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
  name: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
interface ITv {
  page: number;
  results: Iresult[];
}

const Wrapper = styled.div`
  background-color: black;
  overflow-x: hidden;
`;

const Loader = styled.div`
  font-size: 30px;
  margin-top: 100px;
  text-align: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  position: relative;
  top: -100px;
  font-size: 68px;
  margin-bottom: 15px;
`;

const Overview = styled.p`
  position: relative;
  top: -100px;
  font-size: 20px;
  width: 50%;
`;

const TrandSlider = styled.div`
  position: relative;
  top: -350px;
`;

const TopTvSlider = styled.div`
  position: relative;
  top: -50px;
`;

const PopularTvSlider = styled.div`
  position: relative;
  top: 250px;
`;

const AirTodaySlider = styled.div`
  position: relative;
  background-color: black;
  top: 550px;
  height: 300px;
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

function Tv() {
  const { data: airTodayTvData } = useQuery<ITv>(
    ["Tv", "AirToday"],
    airTodayTvfetch
  );
  const { data: popularTvData } = useQuery<ITv>(
    ["Tv", "Popular"],
    popularTvfetch
  );
  const { data: topTvData } = useQuery<ITv>(["Tv", "Top"], topTvfetch);
  const { data: trandTvData, isLoading } = useQuery<ITv>(
    ["Tv", "Trand"],
    trandTvfetch
  );
  const history = useHistory();
  const { scrollY } = useScroll();
  const width = useWindowDimensions();
  const [trandIndex, setTrandIndex] = useState(0);
  const [topIndex, setTopIndex] = useState(0);
  const [popularIndex, setPopularIndex] = useState(0);
  const [airTodayIndex, setAirTodayIndex] = useState(0);
  const [movingRow, setMovingRow] = useState(false);
  const [indexBack, setIndexBack] = useState(false);
  const trandTvMatch = useRouteMatch<{ TvId: string }>(`/tv/trand/:TvId`);
  const topTvMatch = useRouteMatch<{ TvId: string }>(`/tv/top/:TvId`);
  const popularTvMatch = useRouteMatch<{ TvId: string }>(`/tv/popular/:TvId`);
  const airTodayTvMatch = useRouteMatch<{ TvId: string }>(`/tv/airtoday/:TvId`);
  const trandPlusClick = () => {
    if (trandTvData) {
      if (movingRow) return;
      toggleMovingRow();
      setIndexBack(false);
      const totalMovies = trandTvData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setTrandIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const trandMinusClick = () => {
    if (trandTvData) {
      if (movingRow) return;
      toggleMovingRow();
      setIndexBack(true);
      const totalMovies = trandTvData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setTrandIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const topTvPlusClick = () => {
    if (topTvData) {
      if (movingRow) return;
      toggleMovingRow();
      setIndexBack(false);
      const totalMovies = topTvData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setTopIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const topTvMinusClick = () => {
    if (topTvData) {
      if (movingRow) return;
      toggleMovingRow();
      setIndexBack(true);
      const totalMovies = topTvData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setTopIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const popularPlusClick = () => {
    if (popularTvData) {
      if (movingRow) return;
      toggleMovingRow();
      setIndexBack(false);
      const totalMovies = popularTvData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setPopularIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const popularMinusClick = () => {
    if (popularTvData) {
      if (movingRow) return;
      toggleMovingRow();
      setIndexBack(true);
      const totalMovies = popularTvData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setPopularIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const airTodayPlusClick = () => {
    if (airTodayTvData) {
      if (movingRow) return;
      toggleMovingRow();
      setIndexBack(false);
      const totalMovies = airTodayTvData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setAirTodayIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const airTodayMinusClick = () => {
    if (airTodayTvData) {
      if (movingRow) return;
      toggleMovingRow();
      setIndexBack(true);
      const totalMovies = airTodayTvData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setAirTodayIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
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

  const onTrandTvBoxClicked = (TvId: number) => {
    history.push(`/tv/trand/${TvId}`);
  };
  const onTopTvBoxClicked = (TvId: number) => {
    history.push(`/tv/top/${TvId}`);
  };
  const onPopularTvBoxClicked = (TvId: number) => {
    history.push(`/tv/popular/${TvId}`);
  };
  const onAirTodayBoxClicked = (TvId: number) => {
    history.push(`/tv/airtoday/${TvId}`);
  };

  const clickedTrandTv =
    trandTvMatch?.params.TvId &&
    trandTvData?.results.find((tv) => tv.id + "" === trandTvMatch.params.TvId);
  const clickedTopTv =
    topTvMatch?.params.TvId &&
    topTvData?.results.find((tv) => tv.id + "" === topTvMatch.params.TvId);

  const clickedPopularTv =
    popularTvMatch?.params.TvId &&
    popularTvData?.results.find(
      (tv) => tv.id + "" === popularTvMatch.params.TvId
    );

  const clickedAirTodayTv =
    airTodayTvMatch?.params.TvId &&
    airTodayTvData?.results.find(
      (tv) => tv.id + "" === airTodayTvMatch.params.TvId
    );

  const overlayClick = () => {
    history.push(`/tv`);
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading ... </Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImgPath(trandTvData?.results[0].backdrop_path || "")}
          >
            <Title>{trandTvData?.results[0].name}</Title>
            <Overview>{trandTvData?.results[0].overview}</Overview>
          </Banner>
          <TrandSlider>
            <SliderName>Trand Tv</SliderName>
            <IndexNextButton onClick={trandPlusClick}>
              <FontAwesomeIcon icon={faAnglesRight} />
            </IndexNextButton>
            <IndexPrevButton onClick={trandMinusClick}>
              <FontAwesomeIcon icon={faAnglesLeft} />
            </IndexPrevButton>
            <AnimatePresence initial={false} onExitComplete={toggleMovingRow}>
              <Row
                custom={indexBack}
                key={trandIndex}
                variants={rowVar}
                initial="hidden"
                animate="visible"
                transition={{ type: "tween", duration: 1 }}
                exit="exit"
              >
                {trandTvData?.results
                  .slice(1)
                  .slice(offset * trandIndex, offset * trandIndex + offset)
                  .map((Tv) => (
                    <Box
                      key={Tv.id}
                      layoutId={Tv.id + "Trand"}
                      variants={boxVar}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      onClick={() => onTrandTvBoxClicked(Tv.id)}
                      bgphoto={makeImgPath(
                        Tv.backdrop_path ? Tv.backdrop_path : Tv.poster_path,
                        "w300"
                      )}
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
          </TrandSlider>

          <TopTvSlider>
            <SliderName>Top Rated Tv</SliderName>
            <IndexNextButton onClick={topTvPlusClick}>
              <FontAwesomeIcon icon={faAnglesRight} />
            </IndexNextButton>
            <IndexPrevButton onClick={topTvMinusClick}>
              <FontAwesomeIcon icon={faAnglesLeft} />
            </IndexPrevButton>
            <AnimatePresence initial={false} onExitComplete={toggleMovingRow}>
              <Row
                custom={indexBack}
                key={topIndex}
                variants={rowVar}
                initial="hidden"
                animate="visible"
                transition={{ type: "tween", duration: 1 }}
                exit="exit"
              >
                {topTvData?.results
                  .slice(1)
                  .slice(offset * topIndex, offset * topIndex + offset)
                  .map((Tv) => (
                    <Box
                      key={Tv.id}
                      layoutId={Tv.id + "Top"}
                      variants={boxVar}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      onClick={() => onTopTvBoxClicked(Tv.id)}
                      bgphoto={makeImgPath(
                        Tv.backdrop_path ? Tv.backdrop_path : Tv.poster_path,
                        "w300"
                      )}
                    >
                      <BoxName variants={boxNameVar}>
                        <span>
                          {Tv.title.length > 20
                            ? `${Tv.title.slice(0, 20)}...`
                            : Tv.title}
                        </span>
                      </BoxName>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </TopTvSlider>

          <PopularTvSlider>
            <SliderName>Popular Tv</SliderName>
            <IndexNextButton onClick={popularPlusClick}>
              <FontAwesomeIcon icon={faAnglesRight} />
            </IndexNextButton>
            <IndexPrevButton onClick={popularMinusClick}>
              <FontAwesomeIcon icon={faAnglesLeft} />
            </IndexPrevButton>
            <AnimatePresence initial={false} onExitComplete={toggleMovingRow}>
              <Row
                custom={indexBack}
                key={popularIndex}
                variants={rowVar}
                initial="hidden"
                animate="visible"
                transition={{ type: "tween", duration: 1 }}
                exit="exit"
              >
                {popularTvData?.results
                  .slice(1)
                  .slice(offset * popularIndex, offset * popularIndex + offset)
                  .map((Tv) => (
                    <Box
                      key={Tv.id}
                      layoutId={Tv.id + "Popular"}
                      variants={boxVar}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      onClick={() => onPopularTvBoxClicked(Tv.id)}
                      bgphoto={makeImgPath(
                        Tv.backdrop_path ? Tv.backdrop_path : Tv.poster_path,
                        "w300"
                      )}
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
          </PopularTvSlider>

          <AirTodaySlider>
            <SliderName>Air Today</SliderName>
            <IndexNextButton onClick={airTodayPlusClick}>
              <FontAwesomeIcon icon={faAnglesRight} />
            </IndexNextButton>
            <IndexPrevButton onClick={airTodayMinusClick}>
              <FontAwesomeIcon icon={faAnglesLeft} />
            </IndexPrevButton>
            <AnimatePresence initial={false} onExitComplete={toggleMovingRow}>
              <Row
                custom={indexBack}
                key={airTodayIndex}
                variants={rowVar}
                initial="hidden"
                animate="visible"
                transition={{ type: "tween", duration: 1 }}
                exit="exit"
              >
                {airTodayTvData?.results
                  .slice(1)
                  .slice(
                    offset * airTodayIndex,
                    offset * airTodayIndex + offset
                  )
                  .map((Tv) => (
                    <Box
                      key={Tv.id}
                      layoutId={Tv.id + "AirToday"}
                      variants={boxVar}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      onClick={() => onAirTodayBoxClicked(Tv.id)}
                      bgphoto={makeImgPath(
                        Tv.backdrop_path ? Tv.backdrop_path : Tv.poster_path,
                        "w300"
                      )}
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
          </AirTodaySlider>

          <AnimatePresence>
            {trandTvMatch ? (
              <>
                <Overlay
                  onClick={overlayClick}
                  animate={{ opacity: 1, transition: { duration: 0.5 } }}
                  exit={{ opacity: 0, transition: { duration: 0.5 } }}
                />
                <InfoBigBox
                  ypoint={scrollY.get()}
                  layoutId={trandTvMatch.params.TvId + "Trand"}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                >
                  {clickedTrandTv ? (
                    <>
                      <img
                        style={{ height: "360px" }}
                        src={makeImgPath(
                          clickedTrandTv.backdrop_path
                            ? clickedTrandTv.backdrop_path
                            : clickedTrandTv.poster_path,
                          "w500"
                        )}
                        alt=""
                      />
                      <BigTitle>
                        {clickedTrandTv.name.length < 25
                          ? clickedTrandTv.name
                          : clickedTrandTv.name.slice(0, 25) + "..."}
                      </BigTitle>
                      <BigOVerview>{clickedTrandTv.overview}</BigOVerview>
                      <MoreInfo>
                        <span>
                          ⭐ : {clickedTrandTv.vote_average} (
                          {clickedTrandTv.vote_count})
                        </span>
                        <span>
                          Popularity :{Math.floor(clickedTrandTv.popularity)}
                        </span>
                        <span>
                          First Air Date : {clickedTrandTv.first_air_date}
                        </span>
                      </MoreInfo>
                    </>
                  ) : null}
                </InfoBigBox>
              </>
            ) : topTvMatch ? (
              <>
                <Overlay
                  onClick={overlayClick}
                  animate={{ opacity: 1, transition: { duration: 0.5 } }}
                  exit={{ opacity: 0, transition: { duration: 0.5 } }}
                />
                <InfoBigBox
                  ypoint={scrollY.get()}
                  layoutId={topTvMatch.params.TvId + "Top"}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                >
                  {clickedTopTv ? (
                    <>
                      <img
                        style={{ height: "360px" }}
                        src={makeImgPath(
                          clickedTopTv.backdrop_path
                            ? clickedTopTv.backdrop_path
                            : clickedTopTv.poster_path,
                          "w500"
                        )}
                        alt=""
                      />
                      <BigTitle>
                        {clickedTopTv.title.length < 25
                          ? clickedTopTv.title
                          : clickedTopTv.title.slice(0, 25) + "..."}
                      </BigTitle>
                      <BigOVerview>{clickedTopTv.overview}</BigOVerview>
                      <MoreInfo>
                        <span>
                          ⭐ : {clickedTopTv.vote_average} (
                          {clickedTopTv.vote_count})
                        </span>
                        <span>
                          Popularity :{Math.floor(clickedTopTv.popularity)}
                        </span>
                        <span>
                          First Air Date : {clickedTopTv.first_air_date}
                        </span>
                      </MoreInfo>
                    </>
                  ) : null}
                </InfoBigBox>
              </>
            ) : popularTvMatch ? (
              <>
                <Overlay
                  onClick={overlayClick}
                  animate={{ opacity: 1, transition: { duration: 0.5 } }}
                  exit={{ opacity: 0, transition: { duration: 0.5 } }}
                />
                <InfoBigBox
                  ypoint={scrollY.get()}
                  layoutId={popularTvMatch.params.TvId + "Popular"}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                >
                  {clickedPopularTv ? (
                    <>
                      <img
                        style={{ height: "360px" }}
                        src={makeImgPath(
                          clickedPopularTv.backdrop_path
                            ? clickedPopularTv.backdrop_path
                            : clickedPopularTv.poster_path,
                          "w500"
                        )}
                        alt=""
                      />
                      <BigTitle>
                        {clickedPopularTv.name.length < 25
                          ? clickedPopularTv.name
                          : clickedPopularTv.name.slice(0, 25) + "..."}
                      </BigTitle>
                      <BigOVerview>{clickedPopularTv.overview}</BigOVerview>
                      <MoreInfo>
                        <span>
                          ⭐ : {clickedPopularTv.vote_average} (
                          {clickedPopularTv.vote_count})
                        </span>
                        <span>
                          Popularity :{Math.floor(clickedPopularTv.popularity)}
                        </span>
                        <span>
                          First Air Date : {clickedPopularTv.first_air_date}
                        </span>
                      </MoreInfo>
                    </>
                  ) : null}
                </InfoBigBox>
              </>
            ) : airTodayTvMatch ? (
              <>
                <Overlay
                  onClick={overlayClick}
                  animate={{ opacity: 1, transition: { duration: 0.5 } }}
                  exit={{ opacity: 0, transition: { duration: 0.5 } }}
                />
                <InfoBigBox
                  ypoint={scrollY.get()}
                  layoutId={airTodayTvMatch.params.TvId + "AirToday"}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                >
                  {clickedAirTodayTv ? (
                    <>
                      <img
                        style={{ height: "360px" }}
                        src={makeImgPath(
                          clickedAirTodayTv.backdrop_path
                            ? clickedAirTodayTv.backdrop_path
                            : clickedAirTodayTv.poster_path,
                          "w500"
                        )}
                        alt=""
                      />
                      <BigTitle>
                        {clickedAirTodayTv.name.length < 25
                          ? clickedAirTodayTv.name
                          : clickedAirTodayTv.name.slice(0, 25) + "..."}
                      </BigTitle>
                      <BigOVerview>{clickedAirTodayTv.overview}</BigOVerview>
                      <MoreInfo>
                        <span>
                          ⭐ : {clickedAirTodayTv.vote_average} (
                          {clickedAirTodayTv.vote_count})
                        </span>
                        <span>
                          Popularity :{Math.floor(clickedAirTodayTv.popularity)}
                        </span>
                        <span>
                          First Air Date : {clickedAirTodayTv.first_air_date}
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

export default Tv;
