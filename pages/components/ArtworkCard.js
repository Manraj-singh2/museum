import useSWR from "swr";
import { useEffect, useState } from "react";
import Error from "next/error";
import { Button, Card } from "react-bootstrap";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ArtworkCard({ objectId }) {
  const [cardData, setCardData] = useState(null);

  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`,
    fetcher
  );

  useEffect(() => {
    if (data) {
      setCardData(data);
    }
  }, [data]);

  if (error) return <Error statusCode={404} />;

  if (!cardData) return <p>loading...</p>;

  
  const source =
    cardData.primaryImageSmall ||
    `https://placehold.co/375x375?text=Not+Available`;

    const ref = `/artwork/${cardData.objectID}`

  return (
    <>
      <Card style={{ width: "18rem" }}>
        <Card.Img variant="top" src={source} alt="image" />
        <Card.Body>
          <Card.Title>{cardData.title || "N/A"}</Card.Title>
          <Card.Text>
            <strong>Date: </strong>{cardData.objectDate || "N/A"}<br />
            <strong>Classification: </strong>{cardData.classification || 'N/A'}<br />
            <strong>Medium: </strong>{cardData.medium || "N/A"}
          </Card.Text>
          <Link href={ref} passHref><Button variant="outline-primary"><strong>ID: </strong>{cardData.objectID}</Button></Link>
        </Card.Body>
      </Card>
    </>
  );
}