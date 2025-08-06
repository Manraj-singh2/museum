import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Error from "next/error";
import { Card, Col, Pagination, Row } from "react-bootstrap";
import ArtworkCard from "../components/ArtworkCard";

const fetcher = (url) => fetch(url).then((res) => res.json());
const PER_PAGE = 12;
export default function Artworks() {
  const [artworkList, setArtworkList] = useState("");
  let [page, setPage] = useState(1);

  const router = useRouter();
  let finalQuery = router.asPath.split("?")[1];

  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`,
    fetcher
  );

  function previousPage() {
    if (page < 1) {
      setPage((page) => page -1)
    }
  }

  function nextPage() {
    if (page < artworkList.length) {
      setPage((page) => page +1);
    }
  }

  useEffect(() => {
    const results = [];
    if (data) {
      for (let i = 0; i < data?.objectIDs?.length; i += PER_PAGE) {
        const chunk = data?.objectIDs.slice(i, i + PER_PAGE);
        results.push(chunk);
      }
      setArtworkList(results);
    }

    setPage(1);
  }, [data]);

  if (error) return <Error statusCode={404} />;

  if (artworkList) {
    return (
      <>
        <Row className="gy-4">
          {artworkList.length ? (
            artworkList[page - 1].map((art) => {
              return (
                <Col lg={3} key={art}>
                  <ArtworkCard objectId={art} />
                </Col>
              );
            })
          ) : (
            <Card><h4>Nothing Here</h4><p>Try searching for something else.</p></Card>
          )}
        </Row>
          {/*{console.log("Before:", {page})}*/}
        <Row  className="mt-4">
          <Col>
          <Pagination>
            <Pagination.Prev onClick={previousPage} />
            <Pagination.Item >{page}</Pagination.Item>
            <Pagination.Next onClick={nextPage} />
          </Pagination>
        </Col>
        </Row>
            {/*{console.log("After", {page})}*/}
      </>
    );
  } else {
    <p>Loading</p>;
  }
}
